"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setError("Vérifiez votre email pour confirmer votre inscription.");
      } else {
        await signIn(email, password);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Une erreur est survenue"
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
              />
            </div>
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

          <p className="text-center text-sm text-gray-600 mt-4">
            {isSignUp ? "Déjà un compte?" : "Pas encore de compte?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-purple-600 hover:text-purple-700 font-medium underline"
            >
              {isSignUp ? "Se connecter" : "Créer un compte"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}