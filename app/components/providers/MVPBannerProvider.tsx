"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MVPBannerContextType {
  isBannerVisible: boolean;
  setBannerVisible: (visible: boolean) => void;
}

const MVPBannerContext = createContext<MVPBannerContextType | undefined>(
  undefined
);

export function MVPBannerProvider({ children }: { children: ReactNode }) {
  const [isBannerVisible, setBannerVisible] = useState(true);

  return (
    <MVPBannerContext.Provider value={{ isBannerVisible, setBannerVisible }}>
      {children}
    </MVPBannerContext.Provider>
  );
}

export function useMVPBanner() {
  const context = useContext(MVPBannerContext);
  if (context === undefined) {
    throw new Error("useMVPBanner must be used within a MVPBannerProvider");
  }
  return context;
}
