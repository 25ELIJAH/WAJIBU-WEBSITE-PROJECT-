@echo off
echo Running clean URL link replacements...
powershell -ExecutionPolicy Bypass -File "%~dp0clean_urls.ps1"
echo.
echo Complete! All internal links updated.
pause
