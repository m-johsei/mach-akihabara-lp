# Builds a single-page PDF embedding export.jpg (image-only proof PDF).
param(
  [string]$Jpg = "C:\Users\Owner\AppData\Local\Temp\claude\C--Users-Owner-Desktop\9c71c2c5-f3dd-48e0-b7bf-c29bb8465b39\scratchpad\export.jpg",
  [string]$Out = "C:\Users\Owner\Desktop\MACH-Akihabara-LP.pdf",
  [double]$PageWpt = 450.0,      # 600 css px @96dpi -> 450 pt
  [double]$PageHpt = 6399.75     # 8533 css px @96dpi -> 6399.75 pt
)
$ErrorActionPreference = 'Stop'
$jpgBytes = [System.IO.File]::ReadAllBytes($Jpg)

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($Jpg)
$iw = $img.Width; $ih = $img.Height; $img.Dispose()

$ms = New-Object System.IO.MemoryStream
$enc = [System.Text.Encoding]::ASCII
function W([byte[]]$b){ $ms.Write($b,0,$b.Length) }
function WS([string]$s){ W($enc.GetBytes($s)) }
$offsets = @{}

WS("%PDF-1.4`n%????`n")

$offsets[1] = $ms.Position
WS("1 0 obj`n<< /Type /Catalog /Pages 2 0 R >>`nendobj`n")

$offsets[2] = $ms.Position
WS("2 0 obj`n<< /Type /Pages /Kids [3 0 R] /Count 1 >>`nendobj`n")

$offsets[3] = $ms.Position
WS("3 0 obj`n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 $PageWpt $PageHpt] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`nendobj`n")

$offsets[4] = $ms.Position
WS("4 0 obj`n<< /Type /XObject /Subtype /Image /Width $iw /Height $ih /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length $($jpgBytes.Length) >>`nstream`n")
W($jpgBytes)
WS("`nendstream`nendobj`n")

$content = "q $PageWpt 0 0 $PageHpt 0 0 cm /Im0 Do Q`n"
$cbytes = $enc.GetBytes($content)
$offsets[5] = $ms.Position
WS("5 0 obj`n<< /Length $($cbytes.Length) >>`nstream`n")
W($cbytes)
WS("endstream`nendobj`n")

$xrefPos = $ms.Position
WS("xref`n0 6`n")
WS("0000000000 65535 f `n")
for ($i=1; $i -le 5; $i++){ WS(("{0:D10} 00000 n `n" -f [int]$offsets[$i])) }
WS("trailer`n<< /Size 6 /Root 1 0 R >>`nstartxref`n$xrefPos`n%%EOF")

[System.IO.File]::WriteAllBytes($Out, $ms.ToArray())
$ms.Dispose()
"Wrote $Out : {0:N0} KB (image {1}x{2}, page {3}x{4} pt)" -f ((Get-Item $Out).Length/1KB), $iw, $ih, $PageWpt, $PageHpt