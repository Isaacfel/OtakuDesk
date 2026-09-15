# Weekly price refresh, run from this PC by Windows Task Scheduler.
#
# GitHub's hosted runners are blocked by Amazon's bot check, so the job runs
# here instead: pull main, re-read every listing, and open a pull request
# with the report if any price changed. Nothing is merged automatically.
#
# Register (once, from an elevated or normal PowerShell):
#   schtasks /Create /SC WEEKLY /D MON /ST 09:00 /TN "Otakudesk price refresh" `
#     /TR "powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\isaac\OtakuDesk\scripts\refresh-prices.ps1"
# Run by hand:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\refresh-prices.ps1

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$log = Join-Path $repo 'scripts\refresh-prices.log'
Set-Location $repo

function Log($msg) {
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
  Write-Output $line
  Add-Content -Path $log -Value $line -Encoding utf8
}

try {
  Log 'start'
  git checkout -q main
  git pull -q origin main
  if (-not (Test-Path (Join-Path $repo 'node_modules'))) { npm ci --no-audit --no-fund | Out-Null }

  $report = Join-Path $env:TEMP 'otakudesk-price-report.md'
  npx tsx scripts/refresh-prices.ts --write --report $report
  if ($LASTEXITCODE -eq 2) { Log 'Amazon blocked most requests; nothing opened'; exit 2 }
  if ($LASTEXITCODE -ne 0) { Log "refresh failed with exit code $LASTEXITCODE"; exit $LASTEXITCODE }

  git diff --quiet -- data/picks.ts
  if ($LASTEXITCODE -eq 0) { Log 'no price changes'; exit 0 }

  $date = Get-Date -Format 'yyyy-MM-dd'
  $branch = "chore/prices-$date"
  git checkout -q -b $branch
  git add data/picks.ts
  git commit -q -m "Refresh prices ($date)"
  git push -q -u origin $branch
  $url = gh pr create --repo Isaacfel/OtakuDesk --base main --head $branch --title "Refresh prices ($date)" --body-file $report
  Log "opened $url"
  git checkout -q main
} catch {
  Log "error: $($_.Exception.Message)"
  try { git checkout -q main } catch {}
  exit 1
}
