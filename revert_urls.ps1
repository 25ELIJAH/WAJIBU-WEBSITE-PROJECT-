# revert_urls.ps1
# Reverts clean URL links back to .html — restores original working state

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = @(
    "index.html", "about.html", "services.html", "insights.html",
    "impact.html", "contact.html", "terms.html", "privacy.html", "404.html"
)

$replacements = @{
    'href="/"'          = 'href="index.html"'
    'href="/about"'     = 'href="about.html"'
    'href="/services"'  = 'href="services.html"'
    'href="/insights"'  = 'href="insights.html"'
    'href="/impact"'    = 'href="impact.html"'
    'href="/contact"'   = 'href="contact.html"'
    'href="/terms"'     = 'href="terms.html"'
    'href="/privacy"'   = 'href="privacy.html"'
}

foreach ($file in $files) {
    $path = Join-Path $dir $file
    if (-not (Test-Path $path)) { Write-Host "SKIP: $file"; continue }

    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $original = $content

    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $content = $content.Replace($old, $new)
    }

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
        Write-Host "REVERTED: $file"
    } else {
        Write-Host "NO CHANGE: $file"
    }
}

Write-Host ""
Write-Host "Done. All links restored to .html — re-upload all HTML files to GoDaddy."
