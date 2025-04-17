import dynamic from "next/dynamic";
import { Suspense } from "react";

const VerifyClient = dynamic(() => import("./verifyClient"), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
