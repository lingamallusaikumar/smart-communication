@echo off
echo ===================================================
echo Starting SmartCommunication CRM Full-Stack Suite
echo ===================================================

cd /d "%~dp0frontend"
start "SmartComm Frontend" cmd /k "set PATH=C:\Program Files\nodejs;%PATH% && npm run dev"

cd /d "%~dp0backend"
start "SmartComm Backend" cmd /k "set JAVA_HOME=C:\Users\saiku\.jdk\jdk-21.0.6+7&& set PATH=C:\Users\saiku\.jdk\jdk-21.0.6+7\bin;%PATH%&& C:\Users\saiku\.maven\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run"

echo.
echo Starting Frontend (http://localhost:3000) and Backend (http://localhost:8080/api/v1)...
