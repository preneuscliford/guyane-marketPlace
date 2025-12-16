"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useActiveAdvertisementsForCarousel } from "@/hooks/useAdvertisements.query";
import Autoplay from "embla-carousel-autoplay";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const { advertisements, loading, error } =
    useActiveAdvertisementsForCarousel();

  console.log("🎯 HeroSection render - advertisements:", advertisements);
  console.log("🎯 HeroSection render - loading:", loading);
  console.log("🎯 HeroSection render - error:", error);
  console.log(
    "🎯 HeroSection render - advertisements.length:",
    advertisements.length
  );

  const handleAdvertisementClick = (ad: any) => {
    if (ad.target_url) {
      window.open(ad.target_url, "_blank");
    }
  };

  return (
    <div className="relative w-full mt-4 sm:mt-6">
      {/* Carousel Publicités plein écran collé au top */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-80 sm:h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-xl text-gray-500">
                Impossible de charger les publicités
              </p>
            </div>
          ) : advertisements.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-xl text-gray-500">
                Aucune publicité disponible pour le moment
              </p>
            </div>
          ) : (
            <Carousel
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {advertisements.map((ad) => (
                  <CarouselItem key={ad.id} className="pl-2 md:pl-4 basis-full">
                    <Card
                      className="cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                      onClick={() => handleAdvertisementClick(ad)}
                    >
                      <CardContent className="p-0">
                        <div className="relative h-80 sm:h-96 md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
                          {ad.image_url ? (
                            <Image
                              src={ad.image_url}
                              alt={ad.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                              priority
                              quality={95}
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-500 flex items-center justify-center">
                              <div className="text-center text-white p-8 max-w-2xl">
                                <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                                  {ad.title}
                                </h3>
                                <p className="text-lg sm:text-xl opacity-90">
                                  {ad.description}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Overlay avec informations toujours visible */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                            <div className="w-full p-6 sm:p-8">
                              <div className="text-white max-w-3xl">
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">
                                  {ad.title}
                                </h3>
                                <p className="text-base sm:text-lg md:text-xl opacity-95 mb-4 line-clamp-3 drop-shadow-md">
                                  {ad.description}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  {ad.category && (
                                    <span className="px-4 py-2 bg-white/90 text-gray-800 backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg">
                                      📂 {ad.category}
                                    </span>
                                  )}
                                  {ad.location && (
                                    <span className="px-4 py-2 bg-white/90 text-gray-800 backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg">
                                      📍 {ad.location}
                                    </span>
                                  )}
                                  <span className="px-4 py-2 bg-purple-600/95 backdrop-blur-sm rounded-full text-sm font-semibold shadow-lg">
                                    👆 Cliquez pour découvrir
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
}
