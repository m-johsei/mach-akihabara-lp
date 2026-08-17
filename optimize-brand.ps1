param(
  [Parameter(Mandatory=$true)][string]$Src,
  [Parameter(Mandatory=$true)][string]$Out,
  [int]$MaxEdge = 800,
  [int]$Quality = 88
)
Add-Type -AssemblyName System.Drawing

function Save-Jpeg {
  param($bmp, $outPath, [int]$quality)
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep  = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)
  $bmp.Save($outPath, $enc, $ep); $ep.Dispose()
}

$img = [System.Drawing.Image]::FromFile($Src)
try {
  $w = $img.Width; $h = $img.Height
  $scale = [Math]::Min(1.0, $MaxEdge / [Math]::Max($w, $h))
  $nw = [int][Math]::Round($w * $scale); $nh = [int][Math]::Round($h * $scale)
  $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  if ($Out -match '\.png$') {
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($img, 0, 0, $nw, $nh)
    $bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
  } else {
    $g.DrawImage($img, 0, 0, $nw, $nh)
    Save-Jpeg -bmp $bmp -outPath $Out -quality $Quality
  }
  $g.Dispose(); $bmp.Dispose()
  Write-Host "Saved $Out ($nw x $nh)"
} finally { $img.Dispose() }