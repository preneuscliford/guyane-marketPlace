import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);



  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("favorites")
        .select("announcement_id")
        .eq("user_id", user?.id);

      if (error) throw error;

      if (data) {
        setFavorites(data.map((item) => item.announcement_id));
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch favorites when user changes
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user, fetchFavorites]);

  // Fetch all favorites for the current user
 

  // Add an announcement to favorites
  const addFavorite = async (announcementId: string) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        announcement_id: announcementId,
      });

      if (error) throw error;

      // Update local state
      setFavorites([...favorites, announcementId]);
      return { success: true };
    } catch (error: Error | unknown) {
      console.error("Error adding favorite:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to add favorite" 
      };
    }
  };

  // Remove an announcement from favorites
  const removeFavorite = async (announcementId: string) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("announcement_id", announcementId);

      if (error) throw error;

      // Update local state
      setFavorites(favorites.filter((id) => id !== announcementId));
      return { success: true };
    } catch (error: Error | unknown) {
      console.error("Error removing favorite:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to remove favorite" 
      };
    }
  };

  // Check if an announcement is in favorites
  const isFavorite = (announcementId: string) => {
    return favorites.includes(announcementId);
  };

  // Toggle favorite status
  const toggleFavorite = async (announcementId: string) => {
    if (isFavorite(announcementId)) {
      return removeFavorite(announcementId);
    } else {
      return addFavorite(announcementId);
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites: fetchFavorites,
  };
}
