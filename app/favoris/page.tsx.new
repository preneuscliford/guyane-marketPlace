"use client";

import { useEffect, useState, useCallback } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Tag, Loader2 } from "lucide-react";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Announcement {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: string;
  location: string;
  created_at: string;
  images: string[] | null;
  user_id: string;
  user: {
    username: string;
    avatar_url: string | null;
  };
}

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const [favoriteAnnouncements, setFavoriteAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch announcements based on favorites IDs
  const fetchFavoriteAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      if (favorites.length === 0) {
        setFavoriteAnnouncements([]);
        return;
      }
      
      const { data, error } = await supabase
        .from("announcements")
        .select(`
          *,
          user:user_id (
            username:username,
            avatar_url:avatar_url
          )
        `)
        .in("id", favorites);

      if (error) throw error;

      if (data) {
        setFavoriteAnnouncements(data as Announcement[]);
      }
    } catch (error) {
      console.error("Error fetching favorite announcements:", error);
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  useEffect(() => {
    if (isAuthenticated && favorites.length > 0) {
      fetchFavoriteAnnouncements();
    } else if (isAuthenticated && favorites.length === 0) {
      setFavoriteAnnouncements([]);
      setLoading(false);
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, favorites, fetchFavoriteAnnouncements]);

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold mb-6">Mes Favoris</h1>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <p className="mb-6">Vous devez être connecté pour voir vos favoris.</p>
            <Link
              href="/auth?redirect=/favoris"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold mb-2">Mes Favoris</h1>
        <p className="text-gray-600 mb-8">
          Retrouvez toutes les annonces que vous avez sauvegardées
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : favoriteAnnouncements.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Aucun favori</h2>
            <p className="text-gray-600 mb-6">
              Vous n&apos;avez pas encore ajouté d&apos;annonces à vos favoris.
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Explorer la marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteAnnouncements.map((announcement) => (
              <Link
                href={`/annonces/${announcement.id}`}
                key={announcement.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group"
              >
                <div className="absolute top-3 right-3 z-10">
                  <FavoriteButton announcementId={announcement.id} />
                </div>
                
                <div className="h-48 relative">
                  <Image
                    src={announcement.images?.[0] || "/placeholder-image.jpg"}
                    alt={announcement.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors line-clamp-1">
                      {announcement.title}
                    </h3>
                    {announcement.price && (
                      <span className="font-bold text-purple-600">
                        {announcement.price.toLocaleString('fr-FR')} €
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {announcement.description}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{announcement.location}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Tag className="w-3 h-3 mr-1" />
                    <span>{announcement.category}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>
                      {formatDistanceToNow(new Date(announcement.created_at), {
                        addSuffix: true,
                        locale: fr
                      })}
                    </span>
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
