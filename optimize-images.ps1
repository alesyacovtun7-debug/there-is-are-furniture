$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$assetRoot = Join-Path $PSScriptRoot 'assets'
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$jpegOptions = [System.Drawing.Imaging.EncoderParameters]::new(1)
$jpegOptions.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]82)
Get-ChildItem -LiteralPath $assetRoot -Filter '*.png' | ForEach-Object {
    $source = [System.Drawing.Image]::FromFile($_.FullName)
    $isHouse = $_.BaseName -match '^(\d{2})-'
    $outputName = if ($isHouse) { 'home-' + $Matches[1] + '.jpg' } else { $_.BaseName + '.jpg' }
    $maxEdge = if ($isHouse) { 1536 } else { 640 }
    $ratio = [Math]::Min([double]1, $maxEdge / [double][Math]::Max($source.Width, $source.Height))
    $bitmap = [System.Drawing.Bitmap]::new([int]($source.Width * $ratio), [int]($source.Height * $ratio))
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::White)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($source, 0, 0, $bitmap.Width, $bitmap.Height)
    $bitmap.Save((Join-Path $assetRoot $outputName), $jpegCodec, $jpegOptions)
    $graphics.Dispose()
    $bitmap.Dispose()
    $source.Dispose()
}
$jpegOptions.Dispose()
Get-ChildItem -LiteralPath $assetRoot -Filter '*.jpg' | Select-Object Name, Length | ConvertTo-Json
