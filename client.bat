@echo off

echo ==========================================
echo    Uruchamianie klienta SnippetShare...
echo NIE ZAMYKAJ TEGO OKNA!
color 0f
echo ==========================================
echo logs:



cd resources && npm install && npx electron .

pause