# PowerShell script to delete fair and poor quality pages
# Gets content audit data and deletes pages with quality score < 40

Write-Host "Fetching content audit data..." -ForegroundColor Yellow

try {
    # Get content audit data
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/content/audit" -Method GET
    $auditData = $response.Content | ConvertFrom-Json
    
    # Filter pages with quality score < 40 (fair and poor quality)
    $lowQualityPages = $auditData.content | Where-Object { $_.qualityScore -lt 40 }
    
    Write-Host "Found $($lowQualityPages.Count) pages with quality score < 40" -ForegroundColor Red
    
    if ($lowQualityPages.Count -eq 0) {
        Write-Host "No low-quality pages found to delete." -ForegroundColor Green
        exit 0
    }
    
    # Show pages that will be deleted
    Write-Host "`nPages to be deleted:" -ForegroundColor Red
    foreach ($page in $lowQualityPages) {
        Write-Host "- $($page.title) (Score: $($page.qualityScore), Type: $($page.type))" -ForegroundColor Red
    }
    
    # Ask for confirmation
    $confirmation = Read-Host "`nDo you want to delete these $($lowQualityPages.Count) low-quality pages? (y/N)"
    
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        $deletedCount = 0
        $errorCount = 0
        
        foreach ($page in $lowQualityPages) {
            try {
                # Construct file path based on type and slug
                if ($page.type -eq "film") {
                    $filePath = "content/films/$($page.slug).md"
                } elseif ($page.type -eq "series") {
                    $filePath = "content/series/$($page.slug).md"
                } elseif ($page.type -eq "blog") {
                    $filePath = "content/blog/$($page.slug).md"
                } else {
                    Write-Host "Unknown type for page: $($page.title)" -ForegroundColor Yellow
                    continue
                }
                
                # Check if file exists and delete it
                if (Test-Path $filePath) {
                    Remove-Item $filePath -Force
                    Write-Host "✓ Deleted: $filePath" -ForegroundColor Green
                    $deletedCount++
                } else {
                    Write-Host "✗ File not found: $filePath" -ForegroundColor Yellow
                    $errorCount++
                }
            }
            catch {
                Write-Host "✗ Error deleting $($page.title): $($_.Exception.Message)" -ForegroundColor Red
                $errorCount++
            }
        }
        
        Write-Host "`nDeletion Summary:" -ForegroundColor Cyan
        Write-Host "✓ Successfully deleted: $deletedCount files" -ForegroundColor Green
        if ($errorCount -gt 0) {
            Write-Host "✗ Errors: $errorCount files" -ForegroundColor Red
        }
        
        # Show remaining content stats
        Write-Host "`nFetching updated content stats..." -ForegroundColor Yellow
        $updatedResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/content/audit" -Method GET
        $updatedData = $updatedResponse.Content | ConvertFrom-Json
        
        Write-Host "`nRemaining content:" -ForegroundColor Cyan
        Write-Host "Total pages: $($updatedData.content.Count)" -ForegroundColor White
        Write-Host "Average quality: $([math]::Round($updatedData.stats.averageQuality, 1))" -ForegroundColor White
        
        $qualityDistribution = $updatedData.content | Group-Object { 
            if ($_.qualityScore -ge 70) { "Good (70+)" }
            elseif ($_.qualityScore -ge 40) { "Fair (40-69)" }
            else { "Poor (<40)" }
        }
        
        foreach ($group in $qualityDistribution) {
            Write-Host "$($group.Name): $($group.Count) pages" -ForegroundColor White
        }
        
    } else {
        Write-Host "Deletion cancelled." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 