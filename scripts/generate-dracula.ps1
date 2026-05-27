$ErrorActionPreference = "Stop"

Write-Host "DRACULA GENERATION PIPELINE"

$envFile = ".env.local"
$inputFile = "public/books/chunks/dracula/chunk-1.txt"
$outputDir = "public/generated/dracula/michael"
$outputFile = "$outputDir/chapter-1.mp3"
$voiceId = "ErXwobaYiN019PkySvjV"

$apiKeyLine = Get-Content $envFile | Where-Object { $_ -like "ELEVENLABS_API_KEY=*" } | Select-Object -First 1
$apiKey = $apiKeyLine.Replace("ELEVENLABS_API_KEY=", "").Trim()

$text = Get-Content $inputFile -Raw
$text = $text -replace "`r", "" -replace "`n", " " -replace '"', "'"

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$body = @{
  text = $text
  model_id = "eleven_multilingual_v2"
} | ConvertTo-Json -Depth 5

Invoke-WebRequest `
  -Uri "https://api.elevenlabs.io/v1/text-to-speech/$voiceId?output_format=mp3_44100_128" `
  -Method POST `
  -Headers @{
    "xi-api-key" = $apiKey
    "Content-Type" = "application/json"
  } `
  -Body $body `
  -OutFile $outputFile `
  -TimeoutSec 60

Write-Host "DONE"
Write-Host "Saved: $outputFile"
