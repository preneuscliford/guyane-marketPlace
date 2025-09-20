"use client";

import { X, Info, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMVPBanner } from "@/components/providers/MVPBannerProvider";

export function MVPBanner() {
  const { isBannerVisible, setBannerVisible } = useMVPBanner();

  if (!isBannerVisible) return null;

  return (
    <div className="fixed bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 sm:py-3 px-3 sm:px-4 z-[10002] top-0 left-0 right-0">
      <div className="container mx-auto flex items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <Info className="h-4 w-4 sm:h-5 sm:w-5 text-orange-100 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-white leading-tight">
              <span className="font-bold">⚠️ Version MVP</span>
              <span className="hidden xs:inline">
                {" "}
                (Produit Minimum Viable)
              </span>
              <span className="hidden sm:inline"> - </span>
              <span className="block xs:inline sm:inline text-orange-100 mt-1 xs:mt-0 sm:mt-0">
                Site en développement
                <span className="hidden xs:inline">
                  . Fonctionnalités limitées.
                </span>
              </span>
            </p>
            <p className="text-xs text-orange-100 mt-1 leading-tight">
              <span className="font-medium hidden xs:inline">
                MVP : Version de base pour tester le concept.{" "}
              </span>
              <Link
                href="/about-mvp"
                className="underline hover:text-white inline-flex items-center gap-1"
              >
                <span className="xs:hidden">Plus d'infos</span>
                <span className="hidden xs:inline">En savoir plus</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </p>
          </div>
        </div>

        <button
          onClick={() => setBannerVisible(false)}
          className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          aria-label="Fermer le bandeau"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
