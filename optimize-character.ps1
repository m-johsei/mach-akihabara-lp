Add-Type -AssemblyName System.Drawing
$tmp = "C:\Users\Owner\Desktop\MACH-Akihabara-LP\_brand_src"
$out = "C:\Users\Owner\Desktop\MACH-Akihabara-LP\assets\images\brand"

function Save-Jpeg($bmp,$path,$q){
  $enc=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()|?{$_.MimeType -eq 'image/jpeg'}
  $ep=New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality,[int64]$q)
  $bmp.Save($path,$enc,$ep);$ep.Dispose()
}
function Resize($in,$out,$maxEdge,$q){
  $img=[System.Drawing.Image]::FromFile($in)
  try{
    $w=$img.Width;$h=$img.Height
    $sc=[Math]::Min(1.0,$maxEdge/[Math]::Max($w,$h))
    $nw=[int][Math]::Round($w*$sc);$nh=[int][Math]::Round($h*$sc)
    $bmp=New-Object System.Drawing.Bitmap($nw,$nh)
    $g=[System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img,0,0,$nw,$nh)
    Save-Jpeg $bmp $out $q
    $g.Dispose();$bmp.Dispose()
    "$out  ${nw}x${nh}"
  } finally { $img.Dispose() }
}

# 1 = full-body logo, 2 = face icon, 3 = IG header (wide banner), 5 = YT header
Resize "$tmp\asset-1.jpg" "$out\char-fullbody.jpg" 900 90
Resize "$tmp\asset-2.jpg" "$out\char-face.jpg" 500 90
Resize "$tmp\asset-3.jpg" "$out\banner-wide.jpg" 1500 88

# sample the yellow background colour (top-left corner of full-body)
$img=[System.Drawing.Image]::FromFile("$tmp\asset-1.jpg")
$bmp=New-Object System.Drawing.Bitmap($img)
$c=$bmp.GetPixel(10,10)
"YELLOW corner of full-body = #{0:X2}{1:X2}{2:X2}" -f $c.R,$c.G,$c.B
$img2=[System.Drawing.Image]::FromFile("$tmp\asset-3.jpg")
$bmp2=New-Object System.Drawing.Bitmap($img2)
$c2=$bmp2.GetPixel(10,10)
"YELLOW corner of banner = #{0:X2}{1:X2}{2:X2}" -f $c2.R,$c2.G,$c2.B
$bmp.Dispose();$img.Dispose();$bmp2.Dispose();$img2.Dispose()