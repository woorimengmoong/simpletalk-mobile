Write-Host "== SimpleTalk Mobile: Hard reset =="

# 안전 삭제 (PowerShell 네이티브)
if (Test-Path .\node_modules) { Remove-Item .\node_modules -Recurse -Force }
if (Test-Path .\.expo)       { Remove-Item .\.expo       -Recurse -Force }
if (Test-Path .\.next)       { Remove-Item .\.next       -Recurse -Force }
if (Test-Path .\.turbo)      { Remove-Item .\.turbo      -Recurse -Force }

# 잠금 파일 정리 (원한다면 유지해도 됨)
# if (Test-Path .\package-lock.json) { Remove-Item .\package-lock.json -Force }

if (Test-Path .\yarn.lock)      { Remove-Item .\yarn.lock -Force }
if (Test-Path .\pnpm-lock.yaml) { Remove-Item .\pnpm-lock.yaml -Force }

$env:EXPO_NO_TELEMETRY = "1"

# 설치 전략: lock 있으면 ci, 없으면 install
if (Test-Path .\package-lock.json) {
  Write-Host "Using npm ci (package-lock.json found)"
  npm ci
} else {
  Write-Host "Using npm install (no package-lock.json)"
  npm install
}

# expo 의존성 보장 (없으면 설치)
$pkg = Get-Content package.json -Raw | ConvertFrom-Json
$hasExpo = $false
if ($pkg.dependencies.PSObject.Properties.Name -contains "expo") { $hasExpo = $true }
if (-not $hasExpo -and $pkg.devDependencies) {
  if ($pkg.devDependencies.PSObject.Properties.Name -contains "expo") { $hasExpo = $true }
}
if (-not $hasExpo) {
  Write-Host "Installing expo@~54.0.0"
  npm install expo@~54.0.0
}

# Expo 추천 설치 (버전 자동 맞춤)
npx expo install expo-status-bar react-native-screens react-native-safe-area-context expo-barcode-scanner

Write-Host "== Done. To start: npx expo start -c =="
