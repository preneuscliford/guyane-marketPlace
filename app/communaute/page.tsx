"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import CommunityPost from "@/components/community/CommunityPost";
import SponsoredBanner from "@/components/advertisements/SponsoredBanner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { retryWithExponentialBackoff } from "@/lib/retryWithExponentialBackoff";
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
} from "lucide-react";
import type { Post } from "@/types/community";
import type { Database } from "@/types/supabase";
import { useAnalytics } from "@/hooks/useAnalytics";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

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
  const { trackPostCreated, trackSearch } = useAnalytics();
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
   * Charge les statistiques de la communauté avec retry automatique
   */
  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoISO = weekAgo.toISOString();

      await retryWithExponentialBackoff(
        async () => {
          // Total des posts
          const { count: totalPosts, error: error1 } = await supabase
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("is_hidden", false);

          if (error1) throw error1;

          // Posts d'aujourd'hui
          const { count: postsToday, error: error2 } = await supabase
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("is_hidden", false)
            .gte("created_at", todayISO);

          if (error2) throw error2;

          // Total des utilisateurs
          const { count: totalUsers, error: error3 } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });

          if (error3) throw error3;

          // Utilisateurs actifs (ayant posté dans les 7 derniers jours)
          const { data: activeUsersData, error: error4 } = await supabase
            .from("posts")
            .select("user_id")
            .gte("created_at", weekAgoISO)
            .eq("is_hidden", false);

          if (error4) throw error4;

          const activeUsers = new Set(activeUsersData?.map((p) => p.user_id))
            .size;

          setStats({
            total_posts: totalPosts || 0,
            total_users: totalUsers || 0,
            posts_today: postsToday || 0,
            active_users: activeUsers,
          });
          return true;
        },
        3,
        500
      );
    } catch (error) {
      console.error("Failed to load stats after retries:", error);
      // Les stats gardent leurs valeurs par défaut
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

      // Construction explicite du Post avec typage unifié
      const profilesData = (data as any)?.profiles;
      const mappedProfile: ProfileRow | undefined =
        profilesData &&
        typeof profilesData === "object" &&
        !("error" in profilesData)
          ? {
              id: profilesData.id ?? "",
              username: profilesData.username ?? null,
              avatar_url: profilesData.avatar_url ?? null,
              full_name: profilesData.full_name ?? null,
              bio: profilesData.bio ?? null,
              created_at:
                (profilesData.created_at as string) ?? new Date().toISOString(),
              updated_at:
                (profilesData.updated_at as string) ?? new Date().toISOString(),
              description: (profilesData.description as string) ?? null,
              location: (profilesData.location as string) ?? null,
              phone: (profilesData.phone as string) ?? null,
              role: (profilesData.role as string) ?? null,
              skills: (profilesData.skills as string[]) ?? null,
              website: (profilesData.website as string) ?? null,
            }
          : undefined;

      const newPost: Post = {
        id: data.id,
        content: data.content,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        hidden_at: data.hidden_at ?? null,
        hidden_by: data.hidden_by ?? null,
        hidden_reason: data.hidden_reason ?? null,
        image_url: data.image_url ?? null,
        is_hidden: data.is_hidden ?? false,
        profiles: mappedProfile,
        like_count: 0,
        comment_count: 0,
        user_liked: false,
        likes: [],
      };

      setPosts((prev) => [newPost, ...prev]);
      setNewPostContent("");
      toast.success("Post publié avec succès!");

      // Track: Post créé
      trackPostCreated({
        content_length: newPostContent.length,
        has_image: false,
        post_type: "community_post",
      });

      try {
        // Tracking GA (si disponible)
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "community_post_create", {
            event_category: "Communauté",
            event_label: "new_post",
          });
        }
      } catch {}

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

    // Track: Recherche effectuée
    if (searchQuery.trim()) {
      trackSearch({
        search_term: searchQuery,
        category: "community",
      });
    }

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
        const rows = (data as any[]) || [];
        const cleanedPosts: Post[] = rows.map((rawPost: any) => {
          // Créer un nouveau post avec la structure attendue
          const cleanPost: Post = {
            id: rawPost.id ?? "",
            user_id: rawPost.user_id ?? null,
            content: rawPost.content ?? "",
            image_url: rawPost.image_url ?? null,
            created_at: rawPost.created_at ?? new Date().toISOString(),
            updated_at: rawPost.updated_at ?? new Date().toISOString(),
            is_hidden: rawPost.is_hidden ?? false,
            hidden_by: rawPost.hidden_by ?? null,
            hidden_at: rawPost.hidden_at ?? null,
            hidden_reason: rawPost.hidden_reason ?? null,

            // Gérer le profil avec une valeur par défaut en cas d'erreur
            profiles:
              rawPost.profiles &&
              typeof rawPost.profiles === "object" &&
              !("error" in rawPost.profiles)
                ? {
                    id: rawPost.profiles.id ?? "",
                    username: rawPost.profiles.username ?? null,
                    avatar_url: rawPost.profiles.avatar_url ?? null,
                    full_name: rawPost.profiles.full_name ?? null,
                    bio: rawPost.profiles.bio ?? null,
                    created_at:
                      rawPost.profiles.created_at ?? new Date().toISOString(),
                    updated_at:
                      rawPost.profiles.updated_at ?? new Date().toISOString(),
                    description: rawPost.profiles.description ?? null,
                    location: rawPost.profiles.location ?? null,
                    phone: rawPost.profiles.phone ?? null,
                    role: rawPost.profiles.role ?? null,
                    skills: rawPost.profiles.skills ?? null,
                    website: rawPost.profiles.website ?? null,
                  }
                : undefined,

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
              ? post.likes.some(
                  (like: { user_id: string }) => like.user_id === user.id
                )
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
        const simplePosts: Post[] = ((data as any[]) || []).map((p: any) => ({
          id: p.id,
          user_id: p.user_id ?? null,
          content: p.content,
          image_url: p.image_url ?? null,
          created_at: p.created_at,
          updated_at: p.updated_at,
          hidden_at: p.hidden_at ?? null,
          hidden_by: p.hidden_by ?? null,
          hidden_reason: p.hidden_reason ?? null,
          is_hidden: p.is_hidden ?? false,
          profiles:
            typeof p.profiles === "object" && p.profiles
              ? {
                  id: p.profiles.id ?? "",
                  username: p.profiles.username ?? null,
                  avatar_url: p.profiles.avatar_url ?? null,
                  full_name: p.profiles.full_name ?? null,
                  bio: p.profiles.bio ?? null,
                  created_at: p.profiles.created_at ?? new Date().toISOString(),
                  updated_at: p.profiles.updated_at ?? new Date().toISOString(),
                  description: p.profiles.description ?? null,
                  location: p.profiles.location ?? null,
                  phone: p.profiles.phone ?? null,
                  role: p.profiles.role ?? null,
                  skills: p.profiles.skills ?? null,
                  website: p.profiles.website ?? null,
                }
              : undefined,
          like_count: 0,
          comment_count: 0,
          user_liked: false,
          likes: [],
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
          hidden_at: null,
          hidden_by: null,
          hidden_reason: null,
          image_url: null,
          is_hidden: false,
          like_count: 0,
          comment_count: 0,
          user_liked: false,
          likes: [],
          profiles: {
            id: "system",
            username: "Système",
            avatar_url: null,
            full_name: null,
            bio: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            description: null,
            location: null,
            phone: null,
            role: null,
            skills: null,
            website: null,
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
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600 flex-shrink-0" />
                Communauté
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 leading-relaxed">
                Un espace pour échanger entre Guyanais, poser des questions,
                partager des opportunités locales.
              </p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => {
                  const el = document.querySelector("#new-post-form");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Poster un message
              </Button>
              <Button variant="outline" asChild>
                <a href="/auth">Rejoindre la communauté</a>
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {stats.total_posts}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Posts totaux
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {stats.posts_today}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Aujourd'hui
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {stats.total_users}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Membres
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {stats.active_users}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Actifs (7j)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message incitatif de la communauté */}
          <Card className="bg-gradient-to-r from-purple-50 to-emerald-50 border-purple-200">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                Bienvenue dans la communauté mcGuyane
              </h3>
              <p className="text-gray-700 text-sm sm:text-base mb-4">
                Un espace pour discuter, s'entraider et partager les bons plans
                locaux en Guyane française.
              </p>
              <ul className="text-gray-600 text-sm space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">✓</span>
                  <span>
                    Posez vos questions et obtenez des réponses d'habitants
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">✓</span>
                  <span>Partagez des bons plans, offres et opportunités</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold mt-0.5">✓</span>
                  <span>
                    Connectez-vous avec d'autres résidents et professionnels
                  </span>
                </li>
              </ul>
              {!user && (
                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Link href="/auth">S'inscrire pour participer</Link>
                </Button>
              )}
            </CardContent>
          </Card>

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
                      id="new-post-form"
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
