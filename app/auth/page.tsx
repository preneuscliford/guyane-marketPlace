"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { ExclamationTriangleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50">
      <Header className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50" />
      
      <div className="flex items-center justify-center min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              {isSignUp ? "Créer un compte" : "Bienvenue"}
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              {isSignUp 
                ? "Rejoignez la communauté mcGuyane" 
                : "Connectez-vous à votre compte"
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="h-11"
                  error={error && error.includes('email') ? error : undefined}
                />
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Nom d'utilisateur
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nom_utilisateur"
                    required
                    minLength={3}
                    maxLength={20}
                    pattern="[a-zA-Z0-9_-]+"
                    title="Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores"
                    className="h-11"
                    error={error && error.includes('utilisateur') ? error : undefined}
                  />
                  <p className="text-xs text-muted-foreground">
                    3-20 caractères, lettres, chiffres, tirets et underscores uniquement
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="h-11 pr-10"
                    error={error && error.includes('mot de passe') ? error : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-muted-foreground">
                    Au moins 8 caractères avec des lettres et des chiffres
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Traitement...
                  </div>
                ) : (
                  isSignUp ? "S'inscrire" : "Se connecter"
                )}
              </Button>
            </form>

            {/* Séparateur et bouton Google temporairement cachés */}
            {false && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">ou</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full h-11 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </Button>
              </>
            )}

            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Déjà un compte?" : "Pas encore de compte?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-medium text-purple-600 hover:text-purple-700 underline underline-offset-2 transition-colors"
                >
                  {isSignUp ? "Se connecter" : "Créer un compte"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
