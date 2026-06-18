$folder = 'C:\Users\easte\OneDrive\Desktop\WAJIBU WEBSITE'

# Read the base64 logo
$logoB64 = (Get-Content "$folder\logo_b64.txt" -Raw).Trim()
$logoSrc  = "data:image/jpeg;base64,$logoB64"

# Read source file
$content = Get-Content "$folder\contact (3).html" -Raw -Encoding UTF8

# Embed logo — replace every occurrence of the external src
$content = $content.Replace('src="images/wajibu_logo.jpeg"', "src=""$logoSrc""")

# Remove ELIJAH JAMES line and add registration number
$oldFooter = '<p class="fbld">Built by <a href="https://wa.me/254740840018" target="_blank" rel="noopener noreferrer">ELIJAH JAMES (+254 740840018)</a></p>'
$newFooter = '<p style="font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:0.5px;width:100%;text-align:center;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06);">WAJIBU LTD &middot; Company Registration No. 17247586 &middot; Registered in England</p>'
$content = $content.Replace($oldFooter, $newFooter)

# Save as contact.html
$content | Set-Content "$folder\contact.html" -Encoding UTF8

Write-Host "Done! contact.html has been created with the embedded logo and updated footer."
Pause
