import dynamic from "next/dynamic";
import { Suspense } from "react";

const VerifyClient = dynamic(() => import("./verifyClient"), {
  ssr: false,
  loading: () => <div> chargement.... </div>, // Créez un composant Spinner
});

export default function Page() {
  return (
    <Suspense fallback={<div> chargement.... </div>}>
      <VerifyClient />
    </Suspense>
  );
}
