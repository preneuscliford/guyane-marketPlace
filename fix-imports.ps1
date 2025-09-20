# Script pour corriger les imports de fichiers UI avec la bonne casse

# Fonction pour corriger les imports dans un fichier
function Fix-Imports {
    param([string]$filePath)
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Encoding UTF8
        $modified = $false
        
        for ($i = 0; $i -lt $content.Length; $i++) {
            if ($content[$i] -match '@/components/ui/Card') {
                $content[$i] = $content[$i] -replace '@/components/ui/Card', '@/components/ui/card'
                $modified = $true
            }
            if ($content[$i] -match '@/components/ui/Button') {
                $content[$i] = $content[$i] -replace '@/components/ui/Button', '@/components/ui/button'
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "Fixed: $filePath"
        }
    }
}

# Rechercher et corriger tous les fichiers .tsx et .ts
$files = Get-ChildItem -Path "." -Recurse -Include "*.tsx", "*.ts" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    Fix-Imports -filePath $file.FullName
}

Write-Host "Import fixes completed!"