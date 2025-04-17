// app/auth/verify/page.tsx
import { Suspense } from "react";
import dynamicLoader from "next/dynamic"; // Renommez l'import ici

const VerifyClient = dynamicLoader(() => import("./verifyClient"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  ),
});

// Configuration de rendu dynamique
export const dynamic = "force-dynamic"; // Gardez ce nom exact

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement initial...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
