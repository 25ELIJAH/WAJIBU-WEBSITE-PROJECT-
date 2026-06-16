@echo off
echo Reverting all links back to .html...
powershell -ExecutionPolicy Bypass -File "%~dp0revert_urls.ps1"
echo.
echo Done! Now re-upload ALL html files to GoDaddy.
pause
