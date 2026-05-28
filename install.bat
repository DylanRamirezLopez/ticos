@echo off
title TICOS - Install
echo ╔══════════════════════════════════════════╗
echo ║       TICOS — Installing Everything      ║
echo ╚══════════════════════════════════════════╝
echo.
echo 📦 Installing root dependencies...
call npm install
echo.
echo 📦 Installing server dependencies...
cd server
call npm install
cd ..
echo.
echo 📦 Installing client dependencies...
cd client
call npm install
cd ..
echo.
echo ✅ All dependencies installed!
echo.
echo ▶ Run 'run.bat' to start TICOS
pause
