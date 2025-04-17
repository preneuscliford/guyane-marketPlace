"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type VerificationType =
  | "signup"
  | "magiclink"
  | "recovery"
  | "invite"
  | "email_change";

export default function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get("token_hash");
        const type = searchParams.get("type") as VerificationType;

        if (!token || !type) {
          throw new Error("Paramètres de vérification manquants");
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type,
        });

        if (error) {
          router.push(`/auth?error=${encodeURIComponent(error.message)}`);
        } else {
          router.push("/auth?message=Email vérifié avec succès");
        }
      } catch (error) {
        router.push("/auth?error=Erreur de vérification");
      }
    };

    verifyToken();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-blue-500 mx-auto" />
        <p className="text-gray-600">Vérification en cours...</p>
      </div>
    </div>
  );
}
