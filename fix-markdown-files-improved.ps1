# PowerShell script to fix common formatting issues in markdown files
# More aggressive approach to fix line breaks in YAML frontmatter

$filmsDirectory = "content\films"
$files = Get-ChildItem -Path $filmsDirectory -Filter "*.md"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    
    # Read all lines from the file
    $lines = Get-Content -Path $file.FullName
    
    # Initialize variables to track frontmatter state
    $inFrontmatter = $false
    $inCoordinates = $false
    $currentField = ""
    $currentValue = ""
    $newLines = @()
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        
        # Detect start of frontmatter
        if ($line -eq "---" -and -not $inFrontmatter) {
            $inFrontmatter = $true
            $newLines += $line
            continue
        }
        
        # Detect end of frontmatter
        if ($line -eq "---" -and $inFrontmatter) {
            $inFrontmatter = $false
            # Add the last field if it exists
            if ($currentField -ne "") {
                $newLines += "$currentField $currentValue"
                $currentField = ""
                $currentValue = ""
            }
            $newLines += $line
            continue
        }
        
        if ($inFrontmatter) {
            # Check if line starts with a field name (e.g., "title:")
            if ($line -match '^([a-zA-Z]+):(.*)$') {
                # Save previous field if it exists
                if ($currentField -ne "") {
                    $newLines += "$currentField $currentValue"
                }
                
                $currentField = $matches[1] + ":"
                $currentValue = $matches[2].Trim()
                
                # Check if we're entering coordinates section
                if ($currentField -eq "coordinates:") {
                    $inCoordinates = $true
                    $newLines += "$currentField $currentValue"
                    $currentField = ""
                    $currentValue = ""
                }
                
                continue
            }
            # We're inside coordinates array, handle differently
            elseif ($inCoordinates) {
                # Just add the line as is for now (we'll fix coordinates separately)
                $newLines += $line
            }
            # This is a continuation of a previous field
            elseif ($currentField -ne "") {
                # Append this line to current value, with a space
                $currentValue += " " + $line.Trim()
            }
            # Standalone line in frontmatter (like a blank line)
            else {
                $newLines += $line
            }
        }
        # Outside frontmatter, just add the line
        else {
            $newLines += $line
        }
    }
    
    # Fix coordinates section specifically - this is more complex and needs special handling
    $content = $newLines -join "`n"
    
    # Join broken URL strings in posterImage and image fields
    $content = $content -replace '(?s)(posterImage: "https?://[^\n"]*)\s+([^\n"]*")', '$1$2'
    $content = $content -replace '(?s)(image: "https?://[^\n"]*)\s+([^\n"]*")', '$1$2'
    
    # Join broken description fields in coordinates
    $content = $content -replace '(?s)("description": "[^\n"]*)\s+([^\n"]*")', '$1 $2'
    
    # Remove excessive blank lines
    $content = $content -replace '(\r?\n){3,}', "`n`n"
    
    # Write the fixed content back to the file
    Set-Content -Path $file.FullName -Value $content -NoNewline
    
    Write-Host "Fixed $($file.Name)"
}

Write-Host "All files processed." 