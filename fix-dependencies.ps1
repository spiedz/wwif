# PowerShell script to fix dependencies for WWIF project
Write-Host "Starting dependency fix script..." -ForegroundColor Cyan

# Function to check if a command exists
function Test-Command {
    param (
        [string]$Command
    )
    
    return $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Function to prompt user to continue
function Prompt-Continue {
    param (
        [string]$Message = "Would you like to continue? (y/n)"
    )
    
    $response = Read-Host -Prompt $Message
    return $response -eq "y" -or $response -eq "Y" -or $response -eq "yes" -or $response -eq "Yes"
}

# Check if npm is installed
if (-not (Test-Command "npm")) {
    Write-Host "ERROR: npm is not installed or not in PATH. Please install Node.js and npm first." -ForegroundColor Red
    exit 1
}

# Step 1: Clean up node_modules and package-lock
Write-Host "Cleaning node_modules and package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ Removed node_modules directory" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✅ Removed package-lock.json" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠ Error installing dependencies: $_" -ForegroundColor Red
    if (-not (Prompt-Continue "Would you like to continue with the script? (y/n)")) {
        exit 1
    }
}

# Step 3: Ensure specific packages are installed
Write-Host "Installing rehype-raw and remark-gfm..." -ForegroundColor Yellow
try {
    npm install rehype-raw remark-gfm --save
    Write-Host "✅ Installed rehype-raw and remark-gfm" -ForegroundColor Green
} catch {
    Write-Host "⚠ Error installing rehype-raw and remark-gfm: $_" -ForegroundColor Red
    Write-Host "The codebase has been modified to work without these packages, but formatting may be affected." -ForegroundColor Yellow
}

# Clear Next.js cache
Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Cleared Next.js cache" -ForegroundColor Green
} else {
    Write-Host "No .next directory found, nothing to clear" -ForegroundColor Green
}

# Create empty .next directory to avoid startup errors
if (-not (Test-Path ".next")) {
    New-Item -ItemType Directory -Path ".next"
    New-Item -ItemType Directory -Path ".next\cache"
    New-Item -ItemType Directory -Path ".next\server"
    New-Item -ItemType Directory -Path ".next\static"
    Write-Host "✅ Created empty .next directory structure" -ForegroundColor Green
}

Write-Host "Dependency fix completed!" -ForegroundColor Cyan
Write-Host "You can now run 'npm run dev' to start the development server." -ForegroundColor Cyan
Write-Host "NOTE: HTML in markdown may not render correctly due to the fallback markdown processor." -ForegroundColor Yellow 