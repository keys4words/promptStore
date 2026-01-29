# PowerShell script to manually download and install Prisma engines for Windows
# Usage: .\scripts\download-prisma-engines.ps1

param(
    [string]$PrismaVersion = "",
    [string]$EngineVersion = ""
)

Write-Host "Prisma Engines Manual Download Script for Windows" -ForegroundColor Cyan
Write-Host ""

# Get project root (parent of scripts directory)
$projectRoot = Split-Path -Parent $PSScriptRoot
$packageJsonPath = Join-Path $projectRoot "package.json"

# Auto-detect Prisma version from package.json
if (-not $PrismaVersion -and (Test-Path $packageJsonPath)) {
    try {
        $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
        $prismaDep = $packageJson.devDependencies.prisma
        if (-not $prismaDep) {
            $prismaDep = $packageJson.dependencies.prisma
        }
        if ($prismaDep) {
            # Extract version (remove ^ or ~)
            $PrismaVersion = $prismaDep -replace '[\^~]', ''
            Write-Host "Auto-detected Prisma version: $PrismaVersion" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Warning: Could not read package.json" -ForegroundColor Yellow
    }
}

# Default versions if not specified
if (-not $PrismaVersion) {
    $PrismaVersion = "5.22.0"
    Write-Host "Using default Prisma version: $PrismaVersion" -ForegroundColor Yellow
}

if (-not $EngineVersion) {
    # Try to get engine version from installed package
    $enginesPackagePath = Join-Path $projectRoot "node_modules\@prisma\engines\package.json"
    if (Test-Path $enginesPackagePath) {
        try {
            $enginesPackage = Get-Content $enginesPackagePath | ConvertFrom-Json
            $EngineVersion = $enginesPackage.version
            Write-Host "Auto-detected engine version: $EngineVersion" -ForegroundColor Green
        }
        catch {
            # Default engine version for Prisma 5.22.0
            $EngineVersion = "5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2"
            Write-Host "Using default engine version: $EngineVersion" -ForegroundColor Yellow
        }
    }
    else {
        # Default engine version for Prisma 5.22.0
        $EngineVersion = "5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2"
        Write-Host "Using default engine version: $EngineVersion" -ForegroundColor Yellow
        Write-Host "(You may need to check the correct version in package-lock.json)" -ForegroundColor Gray
    }
}

Write-Host ""

# Detect platform
$platform = "windows"
$arch = "x64"
$binaryName = "query-engine-windows.exe.node"

# Determine Node.js architecture
try {
    $nodeArchOutput = node -p "process.arch" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $nodeArch = $nodeArchOutput.Trim()
        if ($nodeArch -eq "arm64") {
            $arch = "arm64"
            $binaryName = "query-engine-windows-arm64.exe.node"
        }
    }
}
catch {
    Write-Host "Warning: Could not detect Node.js architecture, using x64" -ForegroundColor Yellow
}

Write-Host "Prisma Version: $PrismaVersion" -ForegroundColor Yellow
Write-Host "Engine Version: $EngineVersion" -ForegroundColor Yellow
Write-Host "Platform: $platform-$arch" -ForegroundColor Yellow
Write-Host ""

# Base URL for Prisma binaries
$baseUrl = "https://binaries.prisma.sh"
$basePath = "all_commits"

# Engines to download
$engines = @(
    @{
        Name = "query-engine"
        File = $binaryName
        Platform = "$platform-$arch"
    },
    @{
        Name = "migration-engine"
        File = "migration-engine-windows.exe"
        Platform = "$platform-$arch"
    },
    @{
        Name = "introspection-engine"
        File = "introspection-engine-windows.exe"
        Platform = "$platform-$arch"
    },
    @{
        Name = "format"
        File = "prisma-fmt-windows.exe"
        Platform = "$platform-$arch"
    }
)

# Create engines directory
$enginesDir = "node_modules\@prisma\engines"
$enginesPath = Join-Path $projectRoot $enginesDir

# Ensure node_modules exists
$nodeModulesPath = Join-Path $projectRoot "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "node_modules not found. Running npm install --ignore-scripts..." -ForegroundColor Yellow
    Push-Location $projectRoot
    npm install --ignore-scripts
    Pop-Location
}

# Ensure @prisma directory exists
$prismaDir = Join-Path $projectRoot "node_modules\@prisma"
if (-not (Test-Path $prismaDir)) {
    Write-Host "Creating @prisma directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $prismaDir -Force | Out-Null
}

if (-not (Test-Path $enginesPath)) {
    Write-Host "Creating engines directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $enginesPath -Force | Out-Null
}

Write-Host "Downloading Prisma engines..." -ForegroundColor Cyan
Write-Host ""

$downloadSuccess = $true

foreach ($engine in $engines) {
    $fileName = $engine.File
    $url = "$baseUrl/$basePath/$EngineVersion/$($engine.Platform)/$fileName"
    $outputPath = Join-Path $enginesPath $fileName
    
    Write-Host "  Downloading $($engine.Name)..." -ForegroundColor White -NoNewline
    
    try {
        # Create temporary file path
        $tempFile = "$outputPath.tmp"
        
        # Download with progress
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($url, $tempFile)
        
        # Move to final location
        if (Test-Path $tempFile) {
            Move-Item -Path $tempFile -Destination $outputPath -Force
            Write-Host " OK" -ForegroundColor Green
        }
        else {
            throw "Download failed"
        }
    }
    catch {
        Write-Host " Failed" -ForegroundColor Red
        Write-Host "    URL: $url" -ForegroundColor Gray
        Write-Host "    Error: $_" -ForegroundColor Red
        $downloadSuccess = $false
    }
}

Write-Host ""

if ($downloadSuccess) {
    Write-Host "All engines downloaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run: npm run db:generate" -ForegroundColor White
    Write-Host "  2. Or continue with: npm run db:push" -ForegroundColor White
}
else {
    Write-Host "Some downloads failed. You can:" -ForegroundColor Yellow
    Write-Host "  1. Try downloading manually from:" -ForegroundColor White
    Write-Host "     https://binaries.prisma.sh/all_commits/$EngineVersion/" -ForegroundColor Cyan
    Write-Host "  2. Or use alternative method (see README)" -ForegroundColor White
}
