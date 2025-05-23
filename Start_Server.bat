@echo off

echo ==========================================
echo    Uruchamianie serwera SnippetShare...
color 0d
echo ==========================================
echo logs:

cd resources && npm install && node server.js

pause