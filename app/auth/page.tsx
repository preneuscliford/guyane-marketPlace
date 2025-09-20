"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  // Fonction de validation du mot de passe
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!/[a-zA-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une lettre";
    }
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    return null;
  };

  // Fonction de validation du nom d'utilisateur
  const validateUsername = (username: string): string | null => {
    if (username.length < 3) {
      return "Le nom d'utilisateur doit contenir au moins 3 caractères";
    }
    if (username.length > 20) {
      return "Le nom d'utilisateur ne peut pas dépasser 20 caractères";
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Validation du nom d'utilisateur pour l'inscription
        const usernameError = validateUsername(username);
        if (usernameError) {
          setError(usernameError);
          setIsLoading(false);
          return;
        }

        // Validation du mot de passe pour l'inscription
        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          setIsLoading(false);
          return;
        }

        const result = await signUp(email, password, username);
        if (result.error) {
          // Gestion spécifique des erreurs d'unicité du nom d'utilisateur
          if (result.error.message.includes('profiles_username_key')) {
            setError("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");
          } else {
            setError(result.error.message);
          }
        } else {
          // Redirection directe vers la page d'accueil après inscription
          router.push("/");
          router.refresh();
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error.message);
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gère la connexion avec Google OAuth
   */
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
      // La redirection sera gérée automatiquement par Supabase
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erreur lors de la connexion avec Google"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header className="fixed top-0 w-full bg-white shadow-sm z-50" />
      
      <div className="mt-32 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {isSignUp ? "Créer un compte" : "Bienvenue"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                  placeholder="nom_utilisateur"
                  required
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_-]+"
                  title="Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                3-20 caractères, lettres, chiffres, tirets et underscores uniquement
              </p>
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">
                Au moins 8 caractères avec des lettres et des chiffres
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Traitement..." : (isSignUp ? "S'inscrire" : "Se connecter")}
          </Button>
        </form>

        {/* Séparateur */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500 bg-white">ou</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Bouton de connexion Google */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg transition-all hover:bg-gray-50 hover:shadow-md flex items-center justify-center gap-3"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </Button>

        <p className="text-center text-sm text-gray-600 mt-6">
          {isSignUp ? "Déjà un compte?" : "Pas encore de compte?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-purple-600 hover:text-purple-700 font-medium underline"
          >
            {isSignUp ? "Se connecter" : "Créer un compte"}
          </button>
        </p>
      </div>
    </div>
  );
}
