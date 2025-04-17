// AuthPage.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password);
      }

      if (result?.error) {
        console.error("Erreur Supabase:", result.error.message);
        alert("Erreur: " + result.error.message);
      } else {
        // Redirection après connexion réussie
        router.push("/annonces"); // change cette route selon ton app
      }
    } catch (error) {
      console.error("Erreur inconnue:", error);
      alert("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-[#f8fafc] to-background">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-background p-8 shadow-2xl shadow-foreground/10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MarketPlace
            </span>
          </h1>
          <h2 className="mt-4 text-xl font-medium text-foreground/90">
            {isLogin
              ? "Content de vous revoir !"
              : "Rejoignez notre communauté"}
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-3 text-foreground/90 placeholder:text-foreground/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="adresse@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-3 text-foreground/90 placeholder:text-foreground/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/30"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isLogin ? (
              "Se connecter"
            ) : (
              "Créer un compte"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-foreground/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-foreground/60">
              Ou continuer avec
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2 border-foreground/20 py-3 text-foreground/80 hover:border-indigo-500/30 hover:bg-indigo-500/10"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-foreground/80"
          >
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          Google
        </Button>

        <p className="text-center text-sm text-foreground/60">
          {isLogin ? "Première visite ?" : "Déjà membre ?"}{" "}
          <button
            type="button"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}
