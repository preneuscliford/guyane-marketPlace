"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/hooks/useAuth";

import Link from "next/link";
import { Button } from "@components/ui/Button";

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: string;
    user_id: string;
    created_at: string;
  };
  onDelete?: () => void;
}

export default function AnnouncementCard({
  announcement,
  onDelete,
}: AnnouncementCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClientComponentClient();

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", announcement.id);

      if (error) throw error;
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {announcement.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {announcement.category} •{" "}
            {new Date(announcement.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>
        {announcement.price && (
          <p className="text-lg font-semibold text-teal-600">
            {announcement.price.toLocaleString("fr-FR")} €
          </p>
        )}
      </div>

      <p className="mt-4 text-gray-600">{announcement.description}</p>

      {user && user.id === announcement.user_id && (
        <div className="mt-6 flex space-x-4">
          <Button variant="outline" asChild>
            <Link href={`/annonces/${announcement.id}/edit`}>Modifier</Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      )}
    </div>
  );
}
