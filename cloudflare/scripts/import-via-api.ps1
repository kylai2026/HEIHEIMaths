param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl
)

$ErrorActionPreference = 'Stop'
$base = $BaseUrl.TrimEnd('/')
$backupDir = Join-Path $PSScriptRoot '..\..\backups'
$backup = Get-ChildItem $backupDir -Filter 'supabase-progress-*.json' |
  Sort-Object Name -Descending |
  Select-Object -First 1

if (-not $backup) { throw "No backup JSON in $backupDir" }

$json = Get-Content $backup.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
$rows = $json.rows
Write-Host "Importing $($rows.Count) rows from $($backup.Name) via $base"

foreach ($row in $rows) {
  $profileKey = $row.profile_key
  $url = "$base/api/progress?profile_key=$([uri]::EscapeDataString($profileKey))"
  $bodyObj = @{
    family_code  = $row.family_code
    student_name = $row.student_name
    data         = $row.data
  }
  $body = $bodyObj | ConvertTo-Json -Depth 100 -Compress
  $tmp = Join-Path $env:TEMP "cf-import-$([guid]::NewGuid().ToString('n')).json"
  [System.IO.File]::WriteAllText($tmp, $body, [System.Text.UTF8Encoding]::new($false))

  try {
    $resp = curl.exe -sS -w "`n%{http_code}" -X PUT $url `
      -H "Content-Type: application/json" `
      --data-binary "@$tmp"
    $parts = $resp -split "`n"
    $code = $parts[-1]
    $out = ($parts[0..($parts.Length - 2)] -join "`n")
    if ($code -ne '200') {
      throw "FAIL $profileKey HTTP $code $out"
    }
    $pts = 0; $bonus = 0; $spent = 0
    if ($row.data.points) { $pts = $row.data.points }
    if ($row.data.bonusPoints) { $bonus = $row.data.bonusPoints }
    if ($row.data.gachaPointsSpent) { $spent = $row.data.gachaPointsSpent }
    Write-Host "OK $profileKey  points=$pts bonus=$bonus spent=$spent"
  }
  finally {
    Remove-Item $tmp -ErrorAction SilentlyContinue
  }
}

Write-Host 'Import done.'
