"use client";

import { useMVPBanner } from "@/components/providers/MVPBannerProvider";
import { useEffect } from "react";

export function DynamicPadding() {
  const { isBannerVisible } = useMVPBanner();

  useEffect(() => {
    const body = document.body;
    if (isBannerVisible) {
      body.className = body.className.replace(/pt-14|pt-16/, "pt-28");
      body.className = body.className.replace(/sm:pt-16|sm:pt-20/, "sm:pt-32");
    } else {
      body.className = body.className.replace(/pt-28|pt-32/, "pt-14");
      body.className = body.className.replace(/sm:pt-32|sm:pt-28/, "sm:pt-16");
    }
  }, [isBannerVisible]);

  return null;
}
