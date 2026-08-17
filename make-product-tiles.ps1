Add-Type -AssemblyName System.Drawing
$img = "C:\Users\Owner\Desktop\MACH-Akihabara-LP\assets\images"
$why = "$img\why"
$hero = "$img\hero"
New-Item -ItemType Directory -Force -Path $hero | Out-Null

function Save-Jpeg($bmp,$path,$q){
  $enc=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()|?{$_.MimeType -eq 'image/jpeg'}
  $ep=New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality,[int64]$q)
  $bmp.Save($path,$enc,$ep);$ep.Dispose()
}
function SquareCrop($in,$outPath,$size){
  $src=[System.Drawing.Image]::FromFile($in)
  try{
    $w=$src.Width;$h=$src.Height;$s=[Math]::Min($w,$h)
    $sx=[int](($w-$s)/2);$sy=[int](($h-$s)/2)
    $bmp=New-Object System.Drawing.Bitmap($size,$size)
    $g=[System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src,(New-Object System.Drawing.Rectangle(0,0,$size,$size)),(New-Object System.Drawing.Rectangle($sx,$sy,$s,$s)),[System.Drawing.GraphicsUnit]::Pixel)
    Save-Jpeg $bmp $outPath 86
    $g.Dispose();$bmp.Dispose()
    "$outPath"
  } finally { $src.Dispose() }
}

# ---- WHY tiles (update Cards -> Pokemon cards, Figures -> single figure) ----
SquareCrop "$img\suehirocho\suehirocho-06.jpg" "$why\cards.jpg"   600   # Pikachu Pokemon cards
SquareCrop "$img\suehirocho\suehirocho-02.jpg" "$why\figures.jpg" 600   # Vegito single figure

# ---- HERO product tiles (what the shops sell) ----
SquareCrop "$img\radio-kaikan\radio-kaikan-04.jpg" "$hero\cards.jpg"    640   # Pokemon booster boxes
SquareCrop "$img\suehirocho\suehirocho-04.jpg"     "$hero\figures.jpg"  640   # anime figure boxes
SquareCrop "$img\hobby-kan\hobby-kan-01.jpg"       "$hero\hololive.jpg" 640   # hololive cards/goods
"DONE"