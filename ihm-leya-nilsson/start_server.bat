@echo off
title NÅD Dev Server (localhost:3000)
echo ==============================================
echo   Startar NÅD Dev Server på localhost...
echo ==============================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
