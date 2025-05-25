Write-Host "Fetching content audit data..." -ForegroundColor Yellow

$response = Invoke-WebRequest -Uri "http://localhost:3001/api/content/audit" -Method GET
$auditData = $response.Content | ConvertFrom-Json

$lowQualityPages = $auditData.content | Where-Object { $_.qualityScore -lt 40 }

Write-Host "Found $($lowQualityPages.Count) pages with quality score < 40" -ForegroundColor Red

if ($lowQualityPages.Count -eq 0) {
    Write-Host "No low-quality pages found to delete." -ForegroundColor Green
    exit 0
}

Write-Host "`nPages to be deleted:" -ForegroundColor Red
foreach ($page in $lowQualityPages) {
    Write-Host "- $($page.title) (Score: $($page.qualityScore), Type: $($page.type))" -ForegroundColor Red
}

$confirmation = Read-Host "`nDo you want to delete these $($lowQualityPages.Count) low-quality pages? (y/N)"

if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
    $deletedCount = 0
    $errorCount = 0
    
    foreach ($page in $lowQualityPages) {
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
        
        if (Test-Path $filePath) {
            Remove-Item $filePath -Force
            Write-Host "✓ Deleted: $filePath" -ForegroundColor Green
            $deletedCount++
        } else {
            Write-Host "✗ File not found: $filePath" -ForegroundColor Yellow
            $errorCount++
        }
    }
    
    Write-Host "`nDeletion Summary:" -ForegroundColor Cyan
    Write-Host "✓ Successfully deleted: $deletedCount files" -ForegroundColor Green
    if ($errorCount -gt 0) {
        Write-Host "✗ Errors: $errorCount files" -ForegroundColor Red
    }
} else {
    Write-Host "Deletion cancelled." -ForegroundColor Yellow
} 