param(
  [Parameter(Mandatory=$true)][string]$InDir,
  [Parameter(Mandatory=$true)][string]$Slug,
  [Parameter(Mandatory=$true)][string]$OutDir
)
# Optimizes one store's photos: resize (max edge) + JPEG re-encode using GDI+
Add-Type -AssemblyName System.Drawing

function Save-Jpeg {
  param($bmp, $outPath, [int]$quality)
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep  = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)
  $bmp.Save($outPath, $enc, $ep)
  $ep.Dispose()
}

function Resize-Image {
  param($imgPath, $outPath, [int]$maxEdge, [int]$quality)
  $img = [System.Drawing.Image]::FromFile($imgPath)
  try {
    $w = $img.Width; $h = $img.Height
    $scale = [Math]::Min(1.0, $maxEdge / [Math]::Max($w, $h))
    $nw = [int][Math]::Round($w * $scale)
    $nh = [int][Math]::Round($h * $scale)
    $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, 0, 0, $nw, $nh)
    Save-Jpeg -bmp $bmp -outPath $outPath -quality $quality
    $g.Dispose(); $bmp.Dispose()
    return "${nw}x${nh}"
  } finally {
    $img.Dispose()
  }
}

$files = Get-ChildItem $InDir -File | Where-Object { $_.Extension -match '\.(png|jpg|jpeg)$' } | Sort-Object Name
$i = 0
foreach ($f in $files) {
  $i++
  $num = "{0:D2}" -f $i
  $fullName = "$Slug-$num.jpg"
  $fullOut  = Join-Path $OutDir $fullName
  $dimFull  = Resize-Image -imgPath $f.FullName -outPath $fullOut -maxEdge 1600 -quality 82
  $thumbName = "$Slug-$num-thumb.jpg"
  $thumbOut  = Join-Path $OutDir $thumbName
  Resize-Image -imgPath $f.FullName -outPath $thumbOut -maxEdge 800 -quality 78 | Out-Null
  $sizeKB = [int]((Get-Item $fullOut).Length / 1KB)
  Write-Host "$Slug-$num  src=$($f.Name)  $dimFull  ${sizeKB}KB"
}
Write-Host "$Slug DONE: $($files.Count) images"