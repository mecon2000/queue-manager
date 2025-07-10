param(
  [string]$queue,
  [int]$timeout = 10000
)

if (-not $queue) {
  Write-Host "Usage: .\curl_dequeue.ps1 <queue_name> [timeout_ms]"
  exit 1
}

$apiHost = "http://localhost:3000/api/$queue"
if ($timeout) {
  $apiHost = "$apiHost" + "?timeout=" + "$timeout"
}

try {
  $response = Invoke-RestMethod -Uri $apiHost -Method Get
  $response | ConvertTo-Json -Compress
} catch {
  if ($_.Exception.Response.StatusCode.value__ -eq 204) {
    Write-Host "No Content (204): No message in queue after timeout."
  } else {
    Write-Host "Error: $($_.Exception.Message)"
  }
} 

