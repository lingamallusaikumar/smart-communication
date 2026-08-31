$sourceDir = "c:\Users\saiku\OneDrive\Desktop\ELEVATEIQ\github project"
$zipPath = "c:\Users\saiku\OneDrive\Desktop\ELEVATEIQ\smart-communication-crm-final.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath
}

# Create a temporary directory to copy allowed files
$tempDir = Join-Path $env:TEMP "smartcomm-zip-temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy files excluding heavy folders
Write-Host "Copying files to temp directory..."
Copy-Item -Path "$sourceDir\*" -Destination $tempDir -Recurse -Exclude "node_modules", "target", ".next", "out", "dist", "build", "playwright-report", "test-results" -Force
Copy-Item -Path "$sourceDir\.git" -Destination "$tempDir\.git" -Recurse -Force
Copy-Item -Path "$sourceDir\.gitignore" -Destination "$tempDir\.gitignore" -Force

# Compress the temp directory
Write-Host "Compressing..."
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
Compress-Archive -Path "$tempDir\.git" -DestinationPath $zipPath -Update
Compress-Archive -Path "$tempDir\.gitignore" -DestinationPath $zipPath -Update

# Clean up
Remove-Item $tempDir -Recurse -Force

Write-Host "Zip created successfully at $zipPath"
