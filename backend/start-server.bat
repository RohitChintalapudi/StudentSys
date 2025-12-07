@echo off
echo Starting Backend Server...
echo.
echo Make sure you have:
echo 1. Node.js installed
echo 2. Dependencies installed (npm install)
echo 3. MongoDB connection is working
echo.
cd /d %~dp0
node server.js
pause

