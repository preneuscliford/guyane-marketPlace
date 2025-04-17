"use client";

import { useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Type sécurité renforcée
type VerificationType =
  | "signup"
  | "magiclink"
  | "recovery"
  | "invite"
  | "email_change";

export default function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type") as VerificationType;
        const next = searchParams.get("next") || "/";

        if (!token_hash || !type) {
          throw new Error("Paramètres de vérification manquants");
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        });

        startTransition(() => {
          if (error) {
            console.error("Erreur de vérification:", error.message);
            router.push(`/auth?error=${encodeURIComponent(error.message)}`);
          } else {
            router.push(
              `/auth?message=${encodeURIComponent("Vérification réussie!")}`
            );
          }
        });
      } catch (error) {
        console.error("Erreur critique:", error);
        startTransition(() => {
          router.push(
            "/auth?error=" +
              encodeURIComponent("Erreur système - Veuillez réessayer")
          );
        });
      }
    };

    verifyToken();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div
          className="mx-auto h-12 w-12 animate-spin rounded-full 
          border-4 border-blue-500 border-t-transparent"
        />

        <h1 className="text-2xl font-bold text-gray-900">
          {isPending ? "Finalisation..." : "Vérification en cours"}
        </h1>

        <p className="text-gray-600 max-w-md">
          Patientez pendant que nous sécurisons votre compte. Cette opération
          peut prendre quelques secondes.
        </p>
      </div>
    </div>
  );
}
