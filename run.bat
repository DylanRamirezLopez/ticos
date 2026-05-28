@echo off
title TICOS - Go Live
pwsh -ExecutionPolicy Bypass -File "%~dp0go-live.ps1" %*
pause
