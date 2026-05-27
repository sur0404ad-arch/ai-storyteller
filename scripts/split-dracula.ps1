$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "DRACULA GENERATION PIPELINE"
Write-Host ""

$apiKey = $env:ELEVENLABS_API_KEY

if (-not $apiKey) {
    Write-Host "ELEVENLABS_API_KEY NOT FOUND"
    exit
}

$voiceId = "ErXwobaYiN019PkySvjV"

$inputFile = "public/books/chunks/dracula/chunk-1.txt"
$outputDir = "public/generated/dracula/michael"

if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
}

$text = Get-Content $inputFile -Raw

$text = $text `
    -replace "`r", "" `
    -replace "`n", " " `
    -replace '"', "'"

$body = @{
    text = $text
    model_id = "eleven_multilingual_v2"
} | ConvertTo-Json -Depth 5

$outputFile = "$outputDir/chapter-1.mp3"

Invoke-RestMethod `
    -Uri "https://api.elevenlabs.io/v1/text-to-speech/$voiceId?output_format=mp3_44100_128" `
    -Method POST `
    -Headers @{
        "xi-api-key" = $apiKey
        "Content-Type" = "application/json"
    } `
    -Body $body `
    -OutFile $outputFile

Write-Host ""
Write-Host "DONE"
Write-Host "Saved: $outputFile"