Add-Type -AssemblyName System.Drawing
$img = "C:\Users\Owner\Desktop\MACH-Akihabara-LP\assets\images"
$out = "$img\why"
New-Item -ItemType Directory -Force -Path $out | Out-Null

function Save-Jpeg($bmp,$path,$q){
  $enc=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()|?{$_.MimeType -eq 'image/jpeg'}
  $ep=New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality,[int64]$q)
  $bmp.Save($path,$enc,$ep);$ep.Dispose()
}
# center-square crop -> size x size
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

SquareCrop "$img\hobby-kan\hobby-kan-02.jpg"   "$out\cards.jpg"    600
SquareCrop "$img\suehirocho\suehirocho-05.jpg" "$out\figures.jpg"  600
SquareCrop "$img\hobby-kan\hobby-kan-06.jpg"   "$out\hololive.jpg" 600
SquareCrop "$img\suehirocho\suehirocho-01.jpg" "$out\route.jpg"    600
"DONE"