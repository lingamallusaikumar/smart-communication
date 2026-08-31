$scriptDir = $PSScriptRoot
if (-not $scriptDir) { $scriptDir = Get-Location }

$frontendDir = Join-Path $scriptDir "frontend"
$backendDir = Join-Path $scriptDir "backend"

Write-Host "Launching Frontend Terminal Window..."
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; `$env:PATH = 'C:\Program Files\nodejs;' + `$env:PATH; Write-Host '=========================================='; Write-Host '  SmartComm NEXT.JS FRONTEND (Port 3000)  '; Write-Host '=========================================='; & 'C:\Program Files\nodejs\npm.cmd' run dev"

Write-Host "Launching Backend Terminal Window..."
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; `$env:JAVA_HOME = 'C:\Users\saiku\.jdk\jdk-21.0.6+7'; `$env:PATH = 'C:\Users\saiku\.jdk\jdk-21.0.6+7\bin;' + `$env:PATH; Write-Host '=========================================='; Write-Host '  SmartComm SPRING BOOT BACKEND (Port 8080) '; Write-Host '=========================================='; & 'C:\Users\saiku\.maven\apache-maven-3.9.9\bin\mvn.cmd' spring-boot:run"

Write-Host "Both servers launched successfully!"
