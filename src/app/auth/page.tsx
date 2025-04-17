"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { signIn, signUp }: any = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const message = searchParams.get("message");
  const error = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      if (isLogin) {
        await signIn(email, password);
        router.push("/annonces");
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      setFormError(err?.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {isLogin ? "Connexion à votre compte" : "Créer un compte"}
          </h2>
        </div>

        {/* Message global */}
        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {formError && (
          <p className="text-red-500 text-sm text-center">{formError}</p>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              {isLogin ? "Se connecter" : "S'inscrire"}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Vous n'avez pas de compte ? Inscrivez-vous"
              : "Déjà un compte ? Connectez-vous"}
          </button>
        </div>
      </div>
    </div>
  );
}
