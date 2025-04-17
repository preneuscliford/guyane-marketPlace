"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import AnnouncementForm from "@/components/announcements/AnnouncementForm";
import AnnouncementCard from "@/components/announcements/AnnouncementCard";
import { useAuth } from "@/hooks/useAuth";

interface Announcement {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: string;
  user_id: string;
  created_at: string;
}

export default function Annonces() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    const channel = supabase
      .channel("announcements")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements",
        },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAnnouncementCreated = () => {
    setShowForm(false);
    fetchAnnouncements();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1>Annonces</h1>
          {user && (
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Fermer" : "Créer une annonce"}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Nouvelle annonce</h2>
            <AnnouncementForm onSuccess={handleAnnouncementCreated} />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">Chargement des annonces...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune annonce pour le moment
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onDelete={fetchAnnouncements}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
