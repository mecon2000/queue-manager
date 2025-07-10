param(
  [string]$queue,
  [string]$message
)

$apiHost = "http://localhost:3000"

if (-not $queue -or -not $message) {
  Write-Host "Usage: .\curl_enqueue.ps1 <queue_name> <json_message>"
  exit 1
}

Invoke-RestMethod -Uri "$apiHost/api/$queue" -Method Post -ContentType "application/json" -Body $message 