# Script PowerShell pour exécuter la migration des données de démonstration
Write-Host "🚀 Démarrage de la migration des données de démonstration..." -ForegroundColor Green

# Vérification de la présence du CLI Supabase
if (-not (Get-Command "supabase" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ CLI Supabase non trouvé. Veuillez l'installer d'abord." -ForegroundColor Red
    Write-Host "Installation: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Exécution du script de migration
Write-Host "📊 Exécution du script de migration..." -ForegroundColor Cyan

try {
    # Utilisation de psql via Supabase pour exécuter le script
    $env:PGPASSWORD = "your_db_password_here"  # À remplacer
    
    # Alternative: exécution directe via le fichier SQL
    $scriptPath = ".\supabase\migration-script.sql"
    
    if (Test-Path $scriptPath) {
        Write-Host "📄 Lecture du script: $scriptPath" -ForegroundColor Blue
        $sqlContent = Get-Content $scriptPath -Raw
        
        Write-Host "✅ Script lu avec succès. Prêt pour l'exécution." -ForegroundColor Green
        Write-Host "📋 Contenu du script:" -ForegroundColor Yellow
        Write-Host "- Vérification et création des profils"
        Write-Host "- Nettoyage des données de test"
        Write-Host "- Insertion de 7 services réalistes"
        Write-Host "- Insertion de 5 annonces réalistes"
        Write-Host "- Génération de reviews et statistiques"
        
        # Note: L'exécution réelle nécessite les credentials de production
        Write-Host "⚠️  Pour exécuter ce script en production:" -ForegroundColor Yellow
        Write-Host "   supabase db reset --db-url 'YOUR_DATABASE_URL'" -ForegroundColor White
        Write-Host "   ou utilisez le dashboard Supabase pour exécuter le SQL" -ForegroundColor White
        
    } else {
        Write-Host "❌ Script non trouvé: $scriptPath" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Erreur lors de l'exécution: $_" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Migration préparée avec succès!" -ForegroundColor Green