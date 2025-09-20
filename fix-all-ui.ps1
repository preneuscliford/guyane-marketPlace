# Script complet pour corriger tous les imports UI

function Fix-AllUIImports {
    param([string]$filePath)
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Encoding UTF8
        $modified = $false
        
        for ($i = 0; $i -lt $content.Length; $i++) {
            $originalLine = $content[$i]
            
            # Corriger tous les imports UI majuscules vers minuscules
            $content[$i] = $content[$i] -replace 'ui/Card"', 'ui/card"'
            $content[$i] = $content[$i] -replace 'ui/Card''', 'ui/card'''
            $content[$i] = $content[$i] -replace 'ui/Card;', 'ui/card;'
            $content[$i] = $content[$i] -replace 'ui/Input"', 'ui/input"'
            $content[$i] = $content[$i] -replace 'ui/Input''', 'ui/input'''
            $content[$i] = $content[$i] -replace 'ui/Input;', 'ui/input;'
            $content[$i] = $content[$i] -replace 'ui/Label"', 'ui/label"'
            $content[$i] = $content[$i] -replace 'ui/Label''', 'ui/label'''
            $content[$i] = $content[$i] -replace 'ui/Label;', 'ui/label;'
            $content[$i] = $content[$i] -replace 'ui/Textarea"', 'ui/textarea"'
            $content[$i] = $content[$i] -replace 'ui/Textarea''', 'ui/textarea'''
            $content[$i] = $content[$i] -replace 'ui/Textarea;', 'ui/textarea;'
            $content[$i] = $content[$i] -replace 'ui/Button"', 'ui/button"'
            $content[$i] = $content[$i] -replace 'ui/Button''', 'ui/button'''
            $content[$i] = $content[$i] -replace 'ui/Button;', 'ui/button;'
            
            if ($content[$i] -ne $originalLine) {
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "Fixed all UI imports: $filePath"
        }
    }
}

# Rechercher et corriger tous les fichiers .tsx et .ts
$files = Get-ChildItem -Path "." -Recurse -Include "*.tsx", "*.ts" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    Fix-AllUIImports -filePath $file.FullName
}

Write-Host "All UI import fixes completed!"