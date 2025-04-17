// VerifyPage.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");
        const next = searchParams.get("next") ?? "/";

        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            router.push(
              "/auth?error=Erreur lors de la vérification de votre email"
            );
          } else {
            router.push("/auth?success=Email vérifié avec succès");
          }
        }
      } catch (error) {
        router.push("/auth?error=Une erreur est survenue");
      }
    };

    handleEmailVerification();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-[#f8fafc] to-background">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7L11 14L20 3" />
            </svg>
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground/90">
            Vérification en cours
          </h1>
          <p className="text-foreground/60">
            Un instant pendant que nous confirmons votre identité...
          </p>
        </div>
      </div>
    </div>
  );
}
