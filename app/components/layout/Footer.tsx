import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">À propos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/annonces" className="text-muted-foreground hover:text-foreground">
                  Annonces
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-muted-foreground hover:text-foreground">
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Conditions d&apos;utilisation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Instagram
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Guyane Marketplace. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}