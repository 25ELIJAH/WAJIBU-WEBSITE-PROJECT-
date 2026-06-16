# clean_urls.ps1
# Replaces all internal .html href links with clean paths across all pages

$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = @(
    "index.html", "about.html", "services.html", "insights.html",
    "impact.html", "contact.html", "terms.html", "privacy.html", "404.html"
)

$replacements = @{
    'href="index.html"'    = 'href="/"'
    'href="about.html"'    = 'href="/about"'
    'href="services.html"' = 'href="/services"'
    'href="insights.html"' = 'href="/insights"'
    'href="impact.html"'   = 'href="/impact"'
    'href="contact.html"'  = 'href="/contact"'
    'href="terms.html"'    = 'href="/terms"'
    'href="privacy.html"'  = 'href="/privacy"'
}

foreach ($file in $files) {
    $path = Join-Path $dir $file
    if (-not (Test-Path $path)) {
        Write-Host "SKIP (not found): $file"
        continue
    }

    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $original = $content

    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        $content = $content.Replace($old, $new)
    }

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
        Write-Host "UPDATED: $file"
    } else {
        Write-Host "NO CHANGE: $file"
    }
}

Write-Host ""
Write-Host "Done. All internal links now use clean paths."
