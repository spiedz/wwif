$response = Invoke-WebRequest -Uri "http://localhost:3001/api/content/audit" -Method GET
$auditData = $response.Content | ConvertFrom-Json
$lowQualityPages = $auditData.content | Where-Object { $_.qualityScore -lt 40 }

Write-Host "Found $($lowQualityPages.Count) remaining low-quality pages to delete" -ForegroundColor Red

$deletedCount = 0
foreach ($page in $lowQualityPages) {
    if ($page.type -eq "film") {
        $filePath = "content/films/$($page.slug).md"
    } elseif ($page.type -eq "series") {
        $filePath = "content/series/$($page.slug).md"
    } elseif ($page.type -eq "blog") {
        $filePath = "content/blog/$($page.slug).md"
    } else {
        continue
    }
    
    if (Test-Path $filePath) {
        Remove-Item $filePath -Force
        Write-Host "Deleted: $($page.title)" -ForegroundColor Green
        $deletedCount++
    }
}

Write-Host "Total deleted: $deletedCount files" -ForegroundColor Cyan

$updatedResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/content/audit" -Method GET
$updatedData = $updatedResponse.Content | ConvertFrom-Json
Write-Host "Remaining content: $($updatedData.content.Count) pages" -ForegroundColor Yellow
$avgQuality = [math]::Round($updatedData.stats.averageQuality, 1)
Write-Host "Average quality: $avgQuality" -ForegroundColor Yellow 