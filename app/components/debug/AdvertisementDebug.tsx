"use client";

import { useActiveAdvertisementsForCarousel } from "@/hooks/useAdvertisements.query";

export function AdvertisementDebug() {
  const { advertisements, loading, error } =
    useActiveAdvertisementsForCarousel();

  console.log("🐛 Debug - advertisements:", advertisements);
  console.log("🐛 Debug - loading:", loading);
  console.log("🐛 Debug - error:", error);

  return (
    <div className="p-4 bg-gray-100 rounded-lg m-4">
      <h3 className="font-bold text-lg mb-2">🐛 Debug Advertisements</h3>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Loading:</strong> {loading ? "Oui" : "Non"}
        </p>
        <p>
          <strong>Error:</strong> {error || "Aucune"}
        </p>
        <p>
          <strong>Nombre de publicités:</strong> {advertisements.length}
        </p>
        {advertisements.length > 0 && (
          <div className="mt-4">
            <strong>Publicités trouvées:</strong>
            <ul className="list-disc ml-4 mt-2">
              {advertisements.map((ad, index) => (
                <li key={ad.id}>
                  {index + 1}. {ad.title} ({ad.status})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
