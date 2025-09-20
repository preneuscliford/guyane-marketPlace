# Script pour corriger tous les imports UI

# Fonction pour corriger les imports dans un fichier
function Fix-UIImports {
    param([string]$filePath)
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Encoding UTF8
        $modified = $false
        
        for ($i = 0; $i -lt $content.Length; $i++) {
            # Corriger tous les imports UI majuscules vers minuscules
            if ($content[$i] -match '@/components/ui/Input') {
                $content[$i] = $content[$i] -replace '@/components/ui/Input', '@/components/ui/input'
                $modified = $true
            }
            if ($content[$i] -match '@/components/ui/Label') {
                $content[$i] = $content[$i] -replace '@/components/ui/Label', '@/components/ui/label'
                $modified = $true
            }
            if ($content[$i] -match '@/components/ui/Textarea') {
                $content[$i] = $content[$i] -replace '@/components/ui/Textarea', '@/components/ui/textarea'
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "Fixed UI imports: $filePath"
        }
    }
}

# Rechercher et corriger tous les fichiers .tsx et .ts
$files = Get-ChildItem -Path "." -Recurse -Include "*.tsx", "*.ts" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    Fix-UIImports -filePath $file.FullName
}

Write-Host "UI import fixes completed!"