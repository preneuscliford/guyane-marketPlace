"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");
        const next = searchParams.get("next") ?? "/";

        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            console.error("Erreur lors de la vérification:", error);
            router.push(
              "/auth?error=Erreur lors de la vérification de votre email"
            );
          } else {
            router.push("/auth?message=Email vérifié avec succès");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
        router.push("/auth?error=Une erreur est survenue");
      }
    };

    handleEmailVerification();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900 mx-auto"></div>
        <h1 className="text-xl font-semibold mb-2">Vérification en cours...</h1>
        <p className="text-gray-600">
          Veuillez patienter pendant que nous vérifions votre email.
        </p>
      </div>
    </div>
  );
}
