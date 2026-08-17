param([int]$Port = 8123)
# Minimal static file server for local preview (no Node/Python needed).
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "MACH LP serving $root at http://localhost:$Port/"

$mime = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8';
  '.json'='application/json; charset=utf-8'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png';
  '.webp'='image/webp'; '.svg'='image/svg+xml'; '.ico'='image/x-icon'; '.woff2'='font/woff2'; '.pdf'='application/pdf'
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
    if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }
    $path = Join-Path $root $rel
    if ((Test-Path $path -PathType Container)) { $path = Join-Path $path 'index.html' }
    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found: ' + $rel)
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.OutputStream.Close()
  } catch { Write-Host "err: $($_.Exception.Message)" }
}
