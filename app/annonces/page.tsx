"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { Plus, MapPin } from "lucide-react";

import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate, formatPrice } from "lib/utils";



export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select(`
          *,
          profiles:user_id(
            username,
            avatar_url
          )
        `)
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
      <div className="container py-16 px-8">
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
    );
  }

  return (
    <div className="container py-8 px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Marché Guyanais</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Votre marché communautaire en ligne
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/annonces/nouvelle" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Déposer une annonce
          </Link>
        </Button>
      </div>

      {announcements.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-lg border">
          <p className="text-xl text-muted-foreground">
            Aucune annonce disponible pour le moment
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <Link
              key={announcement.id}
              href={`/annonces/${announcement.id}`}
              className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            >
              {/* Image Gallery */}
              {announcement.images?.length > 0 && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={announcement.images[0]}
                    alt={announcement.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              <div className="p-5">
                {/* Category and User */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {announcement.category}
                  </span>
                  {announcement.profiles && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {announcement.profiles.username}
                      </span>
                    </div>
                  )}
                </div>

                {/* Title and Description */}
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  {announcement.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-muted-foreground">
                  {announcement.description}
                </p>

                {/* Price and Location */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {announcement.price ? formatPrice(announcement.price) : "Prix sur demande"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(announcement.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {announcement.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
