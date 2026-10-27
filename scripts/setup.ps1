# WonderMap one-shot local setup (Windows PowerShell).
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

Write-Host "> Installing workspace dependencies..." -ForegroundColor Cyan
npm install

Write-Host "> Preparing environment files..." -ForegroundColor Cyan
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
if (-not (Test-Path server/.env)) { Copy-Item server/.env.example server/.env }

Write-Host "> Seeding the database (requires MongoDB)..." -ForegroundColor Cyan
npm run seed

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "  Start everything:   npm run dev"
Write-Host "  Client: http://localhost:5173   API: http://localhost:4000/api"
Write-Host "  Demo  -> demo@wondermap.dev / demo1234"
Write-Host "  Admin -> admin@wondermap.dev / admin1234"
