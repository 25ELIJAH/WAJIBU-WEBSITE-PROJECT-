@echo off
powershell -Command "[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\Users\easte\OneDrive\Desktop\WAJIBU WEBSITE\images\wajibu_logo.jpeg'))" > "C:\Users\easte\OneDrive\Desktop\WAJIBU WEBSITE\logo_b64.txt"
echo Done! logo_b64.txt created.
pause
