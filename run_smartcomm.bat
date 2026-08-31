@echo off
echo ===================================================
echo Starting SmartCommunication CRM Full-Stack Suite
echo ===================================================

echo Starting Frontend on Port 3000...
start "SmartComm Frontend" cmd /k "cd /d "%~dp0frontend" && set PATH=C:\Program Files\nodejs;%PATH% && npm run dev"

echo Starting Backend on Port 8080...
start "SmartComm Backend" cmd /k "cd /d "%~dp0backend" && set JAVA_HOME=C:\Users\saiku\.jdk\jdk-21.0.6+7&& set PATH=C:\Users\saiku\.jdk\jdk-21.0.6+7\bin;%PATH%&& C:\Users\saiku\.maven\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run"

echo.
echo Launching Frontend (http://localhost:3000) and Backend (http://localhost:8080/api/v1)...
