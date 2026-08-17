# 📸 Instagram 最新投稿の自動反映 — セットアップ手順書

`@mach_tcg_akihabara` の最新投稿を、LPの「Fresh from Instagram」欄に**自動で**反映させる手順です。

> ✅ **方式：Instagramログイン（Instagram API with Instagram Login）**
> Facebookページもビジネスポートフォリオも**一切使いません**。
> （Facebookログイン方式はポートフォリオの制約で断念しました）

---

## しくみ

```
GitHub Actions（6時間ごと・無料）
  └─ scripts/fetch-instagram.js が graph.instagram.com から最新投稿を取得
       └─ data/instagram-feed.json を更新
            └─ LPが最新投稿を表示
```

- **トークンは GitHub Secrets にだけ保存**。LPのJSには書きません。
- トークンは60日で失効しますが、**毎回自動で延長**する処理を実装済みなので、
  ワークフローが動いている限り**実質無期限**で回り続けます。
- 取得に失敗してもLPは崩れません（前回JSON→fallbackを表示）。

**最終的に必要な値：**
| 名前 | 中身 |
|---|---|
| `IG_TOKEN` | Instagramの長期アクセストークン |
| `IG_USER_ID` | （任意）未設定なら `me` を使うので**不要** |

> 🔒 トークンは絶対に他人に共有しないでください（チャットにも貼らない）。

---

# STEP 1. Instagramログイン設定を開く

1. https://developers.facebook.com/apps/1097429796182555/ を開く（MACH Akihabara LP）
2. 左メニュー **「ユースケース」** → **「カスタマイズ」**
3. **「Instagramログインによる API設定」** をクリック

この画面で、`Instagramアプリ ID` と `Instagram app secret` が確認できます（STEP 2で使う場合あり）。

---

# STEP 2. トークンを発行する

同じ「Instagramログインによる API設定」の画面を下にスクロールし、
**「2. Instagramアカウントを追加」／「アクセストークンを生成」** といったセクションを探します。

1. **「Instagramアカウントを追加」** をクリック
2. `@mach_tcg_akihabara` でログイン → 権限を許可
3. **アクセストークンが発行されます** → コピー

> 💡 このダッシュボード上の生成機能を使えば、リダイレクトURIの設定やOAuth実装は**不要**です。
> 画面に「トークンを生成」ボタンが見当たらない場合は、その画面のスクショを共有してください。

### ✅ 動作テスト（推奨）
ブラウザのアドレスバーに貼って、投稿が返るか確認：
```
https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_url,permalink,timestamp&limit=3&access_token=取得したトークン
```
→ 投稿データのJSONが返れば成功です。

---

# STEP 3. GitHubに公開＋Secrets登録

## 3-1. リポジトリを作る
1. https://github.com/ にログイン
2. 右上 **「+」→「New repository」**
3. 名前（例：`mach-akihabara-lp`）／ **Public** → 「Create repository」
4. `MACH-Akihabara-LP` フォルダの中身一式をアップロード
   （**`.github` フォルダも必ず含める**＝自動更新の設定）

## 3-2. Secretsを登録
**Settings → Secrets and variables → Actions → 「New repository secret」**

| Name | Secret |
|---|---|
| `IG_TOKEN` | STEP 2 で取得したトークン |

> `IG_USER_ID` は**登録不要**です（`me` が使われます）。

### （任意）トークン自動更新を完全自動にする
デフォルトでも60日ごとに延長されますが、更新後のトークンをSecretに書き戻すには
**Personal Access Token** が必要です：
1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**
2. 対象リポジトリに対して **Secrets: Read and write** 権限を付与して発行
3. リポジトリのSecretsに `GH_PAT` という名前で登録

未設定でも動作しますが、その場合は60日ごとに手動でトークン更新が必要です。

## 3-3. サイトを公開
**Settings → Pages → Source:「Deploy from a branch」→ Branch: `main` / `(root)`** → Save
→ `https://ユーザー名.github.io/mach-akihabara-lp/` で公開されます。

## 3-4. 自動更新を動かす
**Actions タブ → 「Refresh Instagram feed」→ 「Run workflow」**
緑のチェックが付けば成功。以後6時間ごとに自動実行されます。

---

## 公開後にやること（私が対応します）
- `index.html` の `canonical` / `og:url` を本番URLに更新
- 住所・営業時間の確定情報を反映

## 補足
- **繁体字キャプション**：APIは投稿の元キャプション1言語のみ返すため、Instagram欄の繁体字は空です。
- **更新頻度**：`.github/workflows/instagram-feed.yml` の `cron: "0 */6 * * *"` を編集で変更可。
- **Facebookログイン方式に戻したい場合**：リポジトリの Variables に `IG_MODE=facebook` を設定し、
  `IG_TOKEN`（Pageトークン）と `IG_USER_ID` を登録すればそのまま動きます（スクリプトは両対応済み）。

---

## 困ったときは
どのSTEPでどう詰まったか、**画面のスクショ**を添えて教えてください（トークンの値は伏せてください）。
