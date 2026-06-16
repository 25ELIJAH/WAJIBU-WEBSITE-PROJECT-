# WAJIBU — Embed local images as base64 data URIs in all HTML files
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Map every local src path to its actual file on disk
$imageMap = @{
    "images/wajibu_logo.jpeg" = Join-Path $root "images\wajibu_logo.jpeg"
    "assets/wajibulogo.jpg"   = Join-Path $root "images\wajibu_logo.jpeg"
    "images/london.jpg"       = Join-Path $root "images\london.jpg"
}

# Build data URIs
$dataMap = @{}
foreach ($key in $imageMap.Keys) {
    $file = $imageMap[$key]
    if (Test-Path $file) {
        $bytes  = [System.IO.File]::ReadAllBytes($file)
        $b64    = [System.Convert]::ToBase64String($bytes)
        $ext    = [System.IO.Path]::GetExtension($file).TrimStart('.').ToLower()
        $mime   = if ($ext -eq "jpg" -or $ext -eq "jpeg") { "image/jpeg" } else { "image/$ext" }
        $dataMap[$key] = "data:$mime;base64,$b64"
        Write-Host "Encoded: $key ($([math]::Round($bytes.Length/1024))KB)"
    } else {
        Write-Host "MISSING: $file"
    }
}

# Replace in all HTML files
$htmlFiles = Get-ChildItem -Path $root -Filter "*.html"
foreach ($html in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($html.FullName, [System.Text.Encoding]::UTF8)
    $changed = $false
    foreach ($key in $dataMap.Keys) {
        if ($content.Contains($key)) {
            $content = $content.Replace($key, $dataMap[$key])
            $changed = $true
        }
    }
    if ($changed) {
        [System.IO.File]::WriteAllText($html.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated: $($html.Name)"
    }
}

Write-Host ""
Write-Host "Done! All images are now embedded. Press any key to close."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
