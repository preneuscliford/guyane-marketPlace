import dynamic from "next/dynamic";

const VerifyClient = dynamic(() => import("./verifyClient"), { ssr: false });

export default function Page() {
  return <VerifyClient />;
}
