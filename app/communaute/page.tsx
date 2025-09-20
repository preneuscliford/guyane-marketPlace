"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import CommunityPost from "@/components/community/CommunityPost";
import SponsoredBanner from "@/components/advertisements/SponsoredBanner";
import FeedbackModal from "@/components/feedback/FeedbackModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MessageCircle,
  Heart,
  Share2,
  HelpCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  full_name?: string; // Utilise full_name au lieu de business_name
  bio?: string; // Ajout du champ bio qui existe dans la DB
}

interface Like {
  user_id: string;
}

interface Post {
  id: string;
  user_id: string; // Changed from author_id to match database
  content: string;
  image_url?: string | null; // Added to match database
  created_at: string;
  updated_at: string;
  is_hidden: boolean;
  hidden_by?: string | null; // Added to match database
  hidden_at?: string | null; // Added to match database
  hidden_reason?: string | null; // Added to match database

  // Données des jointures
  profiles?: Profile; // Made optional since we'll add it manually
  likes?: Like[]; // Le tableau des likes récupéré par la jointure

  // Custom fields added by our app logic
  like_count?: number; // Made optional, calculated from likes
  comment_count?: number; // Made optional, calculated from comments
  user_liked?: boolean; // Optional
}

interface CommunityStats {
  total_posts: number;
  total_users: number;
  posts_today: number;
  active_users: number;
}

/**
 * Page principale de la communauté avec système de posts imbriqués,
 * affiches publicitaires intégrées et statistiques
 */
export default function CommunautePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [stats, setStats] = useState<CommunityStats>({
    total_posts: 0,
    total_users: 0,
    posts_today: 0,
    active_users: 0,
  });

  /**
   * Charge les statistiques de la communauté
   */
  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Total des posts
      const { count: totalPosts } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("is_hidden", false);

      // Posts d'aujourd'hui
      const { count: postsToday } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("is_hidden", false)
        .gte("created_at", todayISO);

      // Total des utilisateurs
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Utilisateurs actifs (ayant posté dans les 7 derniers jours)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoISO = weekAgo.toISOString();

      const { data: activeUsersData } = await supabase
        .from("posts")
        .select("user_id")
        .gte("created_at", weekAgoISO)
        .eq("is_hidden", false);

      const activeUsers = new Set(activeUsersData?.map((p) => p.user_id)).size;

      setStats({
        total_posts: totalPosts || 0,
        total_users: totalUsers || 0,
        posts_today: postsToday || 0,
        active_users: activeUsers,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  /**
   * Publie un nouveau post
   */
  const submitPost = async () => {
    if (!user || !newPostContent.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          content: newPostContent.trim(),
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_hidden: false,
        })
        .select(
          `
          *,
          profiles:user_id(id, username, avatar_url, full_name, bio)
        `
        )
        .single();

      if (error) {
        console.error("Error submitting post:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      const newPost = {
        ...data,
        user_liked: false,
        like_count: 0,
      };

      // Fix for type issues - explicitly cast to Post
      setPosts((prev) => [newPost as Post, ...prev]);
      setNewPostContent("");
      toast.success("Post publié avec succès!");

      // Recharger les statistiques
      fetchStats();
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      toast.error("Erreur lors de la publication");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Gère la recherche
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  /**
   * Charge les posts de la communauté
   */
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching posts with searchQuery:", searchQuery);

      // Query that matches the actual database schema
      let query = supabase
        .from("posts")
        .select(
          `
          id,
          user_id, 
          content,
          image_url,
          created_at,
          updated_at,
          is_hidden,
          hidden_by,
          hidden_at,
          hidden_reason,
          profiles:user_id(id, username, avatar_url, full_name, bio),
          likes(user_id)
        `
        )
        .eq("is_hidden", false); // Récupérer tous les posts sans filtre parent_id

      // Filtrage par recherche
      if (searchQuery.trim()) {
        query = query.ilike("content", `%${searchQuery.trim()}%`);
      }

      // Tri selon la sélection
      if (sortBy === "recent") {
        query = query.order("created_at", { ascending: false });
      } else {
        // Par défaut on utilise le tri par date récent
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase query error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        toast.error(
          `Erreur de chargement: ${
            error.message || error.details || error.hint || "Inconnue"
          }`
        );
        throw error;
      }

      console.log(`Posts récupérés: ${data?.length || 0}`);

      if (!data || data.length === 0) {
        console.log("Aucun post trouvé");
        setPosts([]);
        return;
      }

      try {
        // 1. Nettoyer et transformer les données
        const cleanedPosts: Post[] = data.map((rawPost) => {
          // Créer un nouveau post avec la structure attendue
          const cleanPost: Post = {
            id: rawPost.id || "",
            user_id: rawPost.user_id || "",
            content: rawPost.content || "",
            image_url: rawPost.image_url,
            created_at: rawPost.created_at || new Date().toISOString(),
            updated_at: rawPost.updated_at || new Date().toISOString(),
            is_hidden: rawPost.is_hidden || false,
            hidden_by: rawPost.hidden_by,
            hidden_at: rawPost.hidden_at,
            hidden_reason: rawPost.hidden_reason,

            // Gérer le profil avec une valeur par défaut en cas d'erreur
            profiles:
              rawPost.profiles &&
              typeof rawPost.profiles === "object" &&
              !("error" in rawPost.profiles)
                ? {
                    id: rawPost.profiles.id || "",
                    username: rawPost.profiles.username || "Utilisateur",
                    avatar_url: rawPost.profiles.avatar_url,
                    full_name: rawPost.profiles.full_name,
                    bio: rawPost.profiles.bio,
                  }
                : {
                    id: "",
                    username: "Utilisateur inconnu",
                  },

            // Transformer les likes en tableau
            likes: Array.isArray(rawPost.likes) ? rawPost.likes : [],

            // Initialiser les champs calculés
            like_count: 0,
            comment_count: 0,
            user_liked: false,
          };
          return cleanPost;
        });

        // 2. Calculer les métriques pour chaque post
        const processedPosts = cleanedPosts.map((post) => {
          // Calculer le nombre de likes
          const likeCount = post.likes ? post.likes.length : 0;

          // Déterminer si l'utilisateur actuel a liké
          const userLiked =
            post.likes && user
              ? post.likes.some((like) => like.user_id === user.id)
              : false;

          return {
            ...post,
            like_count: likeCount,
            user_liked: userLiked,
          };
        });

        // Mettre à jour l'état avec les posts traités
        setPosts(processedPosts);

        // 3. Pour simplifier, nous allons initialiser tous les posts avec un nombre de commentaires à 0
        if (processedPosts.length > 0) {
          const fetchComments = async () => {
            try {
              // Initialiser tous les posts avec 0 commentaire
              const commentCounts: Record<string, number> = {};
              processedPosts.forEach((post) => {
                commentCounts[post.id] = 0;
              });

              // Mettre à jour les compteurs de commentaires (tous à zéro pour l'instant)
              setPosts((currentPosts) =>
                currentPosts.map((post) => ({
                  ...post,
                  comment_count: commentCounts[post.id] || 0,
                }))
              );

              // Mettre à jour les compteurs de commentaires
              setPosts((currentPosts) =>
                currentPosts.map((post) => ({
                  ...post,
                  comment_count: commentCounts[post.id] || 0,
                }))
              );
            } catch (error) {
              if (error instanceof Error) {
                console.error(
                  "Erreur lors du comptage des commentaires:",
                  error.message
                );
              } else {
                console.error(
                  "Erreur inconnue lors du comptage des commentaires"
                );
              }
            }
          };

          fetchComments();
        }
      } catch (processError) {
        console.error("Erreur lors du traitement des posts:", processError);

        // En cas d'erreur de traitement, utiliser les données brutes
        const simplePosts: Post[] = data.map((p) => ({
          id: p.id,
          user_id: p.user_id,
          content: p.content,
          image_url: p.image_url,
          created_at: p.created_at,
          updated_at: p.updated_at,
          is_hidden: p.is_hidden,
          profiles:
            typeof p.profiles === "object" && p.profiles
              ? {
                  id: p.profiles.id || "",
                  username: p.profiles.username || "Utilisateur",
                }
              : { id: "", username: "Utilisateur inconnu" },
          like_count: 0,
          comment_count: 0,
          user_liked: false,
        }));

        setPosts(simplePosts);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des posts:", error);

      // Afficher un post d'erreur
      const dummyPosts: Post[] = [
        {
          id: "1",
          content:
            "Erreur de chargement des posts. Veuillez réessayer plus tard.",
          user_id: "system",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_hidden: false,
          like_count: 0,
          comment_count: 0,
          profiles: {
            id: "system",
            username: "Système",
            avatar_url: undefined,
            full_name: undefined,
            bio: undefined,
          },
        },
      ];

      setPosts(dummyPosts);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, user, sortBy]);

  const refreshPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    refreshPosts();
    fetchStats();
  }, [refreshPosts]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      refreshPosts();
    }
  }, [refreshPosts, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la communauté */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8 text-teal-600" />
                Communauté
              </h1>
              <p className="text-gray-600 mt-2">
                Partagez, discutez et connectez-vous avec la communauté
                guyanaise
              </p>
            </div>

            <FeedbackModal>
              <Button variant="outline" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Aide & Feedback
              </Button>
            </FeedbackModal>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.total_posts}
                </div>
                <div className="text-sm text-gray-600">Posts totaux</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.posts_today}
                </div>
                <div className="text-sm text-gray-600">Posts aujourd'hui</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.total_users}
                </div>
                <div className="text-sm text-gray-600">Membres</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.active_users}
                </div>
                <div className="text-sm text-gray-600">Actifs (7j)</div>
              </CardContent>
            </Card>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans les discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récents</SelectItem>
                <SelectItem value="popular">Plus populaires</SelectItem>
                <SelectItem value="discussed">Plus commentés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulaire de nouveau post */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Partager quelque chose
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Quoi de neuf ? Partagez vos pensées avec la communauté..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {newPostContent.length}/1000 caractères
                      </div>
                      <Button
                        onClick={submitPost}
                        disabled={isSubmitting || !newPostContent.trim()}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        {isSubmitting ? "Publication..." : "Publier"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Affiche publicitaire intégrée */}
            <div className="my-8">
              <SponsoredBanner
                className="h-48 md:h-56"
                autoPlayInterval={8000}
                showControls={true}
              />
            </div>

            {/* Liste des posts */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-600"></div>
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery
                      ? "Aucun résultat trouvé"
                      : "Aucun post pour le moment"}
                  </h3>
                  <p className="text-gray-500 text-center">
                    {searchQuery
                      ? "Essayez avec d'autres mots-clés"
                      : "Soyez le premier à partager quelque chose avec la communauté !"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <div key={post.id}>
                    <CommunityPost post={post} onUpdate={fetchPosts} />

                    {/* Affiche publicitaire tous les 3 posts */}
                    {(index + 1) % 3 === 0 && index < posts.length - 1 && (
                      <div className="my-6">
                        <SponsoredBanner
                          className="h-40 md:h-48"
                          autoPlayInterval={10000}
                          showControls={false}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tendances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tendances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#MarketplaceGuyane</span>
                    <span className="text-xs text-gray-500">24 posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#ServiceLocal</span>
                    <span className="text-xs text-gray-500">18 posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">#Entreprendre</span>
                    <span className="text-xs text-gray-500">12 posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions communautaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Voir mes posts favoris
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Inviter des membres
                </Button>
                {user?.id === "admin" && (
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Gérer la communauté
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Règles de la communauté */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Règles de la communauté
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>1. Restez respectueux envers tous les membres</p>
                <p>2. Publiez du contenu pertinent pour la Guyane</p>
                <p>3. Évitez la promotion excessive</p>
                <p>4. Aucun contenu inapproprié ou illégal</p>
                <p>5. Signalez tout abus à un modérateur</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
