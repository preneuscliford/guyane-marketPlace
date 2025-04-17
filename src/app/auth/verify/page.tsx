import dynamic from "next/dynamic";

// Import sans SSR pour éviter les erreurs
const ClientVerifier = dynamic(
  () => import("../../../components/ClientVerifier"),
  {
    ssr: false,
  }
);

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClientVerifier />
    </div>
  );
}
