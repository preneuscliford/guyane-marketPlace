"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import AnnouncementForm from "@/components/announcements/AnnouncementForm";
import { useAuth } from "@/hooks/useAuth";

interface Announcement {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  user_id: string;
}

export default function EditAnnouncement({
  params,
}: {
  params: { id: string };
}) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const client = supabase;

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const { data, error } = await client
          .from("announcements")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Annonce non trouvée");

        // Vérifier que l'utilisateur est le propriétaire
        if (user?.id !== data.user_id) {
          throw new Error("Vous n'êtes pas autorisé à modifier cette annonce");
        }

        setAnnouncement(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Une erreur est survenue"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAnnouncement();
    }
  }, [params.id, user]);

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            Vous devez être connecté pour modifier une annonce
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8">
          <div className="text-center">Chargement...</div>
        </main>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            {error || "Annonce non trouvée"}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">Modifier l'annonce</h1>
        <div className="mx-auto max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <AnnouncementForm
            initialData={announcement}
            onSuccess={() => router.push("/annonces")}
          />
        </div>
      </main>
    </div>
  );
}
