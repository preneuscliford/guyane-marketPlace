import dynamic from "next/dynamic";

const VerifyClient = dynamic(() => import("./VerifyClient"), {
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <VerifyClient />
    </div>
  );
}
