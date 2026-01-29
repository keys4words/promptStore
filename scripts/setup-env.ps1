# PowerShell script to setup .env file from Supabase credentials
# Usage: .\scripts\setup-env.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$DbPassword
)

# Extract project reference from URL
# Example: https://abcdefghijklmnop.supabase.co -> abcdefghijklmnop
$projectRef = $ProjectUrl -replace 'https://', '' -replace '.supabase.co', '' -replace '/', ''

# Generate DATABASE_URL
$databaseUrl = "postgresql://postgres:$DbPassword@$projectRef.supabase.co:5432/postgres?sslmode=require"

# Create .env file
$envContent = @"
# Supabase Configuration
SUPABASE_PROJECT_URL="$ProjectUrl"
SUPABASE_DB_PASSWORD="$DbPassword"

# Database Connection String
DATABASE_URL="$databaseUrl"
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline

Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host "📝 Project URL: $ProjectUrl" -ForegroundColor Cyan
Write-Host "🔐 Database password configured" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review .env file" -ForegroundColor White
Write-Host "  2. Run: npm run db:push" -ForegroundColor White
Write-Host "  3. Run: npm run db:seed" -ForegroundColor White

