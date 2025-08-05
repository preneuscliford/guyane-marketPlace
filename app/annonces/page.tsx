"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { Plus, MapPin } from "lucide-react";

import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate, formatPrice } from "lib/utils";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"] & {
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
  images: string[] | null;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select(
          `
          *,
          profiles:user_id(
            username,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error loading announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-16 px-8 pt-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-8 px-8 pt-24">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Marché Guyanais</h1>
          <p className="mt-2 text-lg text-muted-foreground">Découvrez des offres uniques dans votre région</p>
        </div>
        <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90 transition-colors">
          <Link href="/annonces/nouvelle" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Déposer une annonce
          </Link>
        </Button>
      </div>

      {announcements.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-xl border bg-gray-50">
          <p className="text-xl text-muted-foreground">Aucune annonce disponible pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {announcements.map((announcement) => (
            <Link
              key={announcement.id}
              href={`/annonces/${announcement.id}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg hover:border-primary/50"
            >
              <div className="relative aspect-[4/3] w-full bg-gray-100">
                {announcement.images && announcement.images.length > 0 ? (
                  <Image
                    src={announcement.images[0]}
                    alt={announcement.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-50">
                    <span className="text-gray-400">Aucune image</span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {announcement.category}
                  </span>
                  {announcement.profiles && (
                    <span className="text-sm text-muted-foreground">
                      {announcement.profiles.username}
                    </span>
                  )}
                </div>

                <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {announcement.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2 flex-1">
                  {announcement.description}
                </p>

                <div className="mt-auto space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {announcement.price ? formatPrice(announcement.price) : "Prix sur demande"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(announcement.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {announcement.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
