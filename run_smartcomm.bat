@echo off
echo ===================================================
echo Starting SmartCommunication CRM Full-Stack Suite
echo ===================================================

start "SmartComm Frontend (Port 3000)" cmd /k "cd /d "%~dp0frontend" && set PATH=C:\Program Files\nodejs;%%PATH%% && npm run dev"
start "SmartComm Backend (Port 8080)" cmd /k "cd /d "%~dp0backend" && set JAVA_HOME=C:\Users\saiku\.jdk\jdk-21.0.6+7 && set PATH=C:\Users\saiku\.jdk\jdk-21.0.6+7\bin;%%PATH%% && C:\Users\saiku\.maven\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run"

echo.
echo Both Frontend (http://localhost:3000) and Backend (http://localhost:8080/api/v1) are launching in separate windows!
