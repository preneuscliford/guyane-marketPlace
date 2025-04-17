"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

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
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data);
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Petites Annonces</h1>
          <Button asChild>
            <Link href="/annonces/nouvelle">Publier une annonce</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="p-6">
                <div className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                  {announcement.category}
                </div>
                <h3 className="text-2xl font-semibold">{announcement.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {announcement.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {announcement.price
                      ? `${announcement.price} €`
                      : "Prix sur demande"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {announcement.location}
                  </span>
                </div>
                <div className="mt-4">
                  <Button className="w-full">Contacter</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedLayout>
  );
}
