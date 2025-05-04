# PowerShell script to fix common formatting issues in markdown files
# Particularly focusing on line breaks in YAML frontmatter

$filmsDirectory = "content\films"
$files = Get-ChildItem -Path $filmsDirectory -Filter "*.md"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Fix common issues:
    
    # 1. Fix URLs split across multiple lines (posterImage and image fields)
    # This uses regex to find URL patterns across lines and joins them
    $content = $content -replace '(?s)(posterImage: "https?://[^\n"]*)\s+([^\n"]*")', '$1$2'
    $content = $content -replace '(?s)(image: "https?://[^\n"]*)\s+([^\n"]*")', '$1$2'
    
    # 2. Fix description fields split across lines
    $content = $content -replace '(?s)(description: ".*?)\s+([^"]*")', '$1 $2'
    
    # 3. Remove excessive blank lines (more than 2 consecutive blank lines)
    $content = $content -replace '(\r?\n){3,}', "`n`n"
    
    # Write the fixed content back to the file
    Set-Content -Path $file.FullName -Value $content -NoNewline
    
    Write-Host "Fixed $($file.Name)"
}

Write-Host "All files processed." 