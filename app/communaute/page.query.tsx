"use client";

import { useState } from "react";
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
import CommunityPost from "@/components/community/CommunityPost.query";
import SponsoredBanner from "@/components/advertisements/SponsoredBanner";
import FeedbackModal from "@/components/feedback/FeedbackModal";
import { useAuth } from "@/hooks/useAuth";
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
  Loader2,
} from "lucide-react";

// Import des nouveaux hooks TanStack Query
import { usePostsQuery, useCreatePostMutation } from "@/hooks/usePosts.query";
import {
  useCommunityStatsQuery,
  useRealTimeStatsQuery,
} from "@/hooks/useCommunityStats.query";

/**
 * Page Communauté refactorisée avec TanStack Query
 * Utilise les nouveaux hooks pour une gestion optimisée des posts et statistiques
 */
export default function CommunautePage() {
  const { user } = useAuth();

  // États locaux
  const [newPostContent, setNewPostContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // ============================================================================
  // HOOKS TANSTACK QUERY
  // ============================================================================

  // Hook pour les posts avec filtrage et tri
  const {
    data: posts = [],
    isLoading: isLoadingPosts,
    error: postsError,
    refetch: refetchPosts,
  } = usePostsQuery({
    search: searchTerm.trim() || undefined,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    sort: sortBy,
  });

  // Hook pour les statistiques de la communauté
  const { data: communityStats, isLoading: isLoadingStats } =
    useCommunityStatsQuery();

  // Hook pour les statistiques temps réel
  const { data: realTimeStats } = useRealTimeStatsQuery();

  // Mutation pour créer un post
  const createPostMutation = useCreatePostMutation();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Gère la création d'un nouveau post
   */
  const handleSubmitPost = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour publier");
      return;
    }

    if (!newPostContent.trim()) {
      toast.error("Veuillez saisir un contenu pour votre post");
      return;
    }

    if (newPostContent.length > 1000) {
      toast.error("Le contenu ne peut pas dépasser 1000 caractères");
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        content: newPostContent.trim(),
        userId: user.id,
        category: selectedCategory === "all" ? undefined : selectedCategory,
      });

      // Réinitialiser le formulaire
      setNewPostContent("");
      setSelectedCategory("all");

      toast.success("Post publié avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
      toast.error("Erreur lors de la publication du post");
    }
  };

  /**
   * Gère la recherche de posts
   */
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  /**
   * Gère le changement de catégorie
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  /**
   * Gère le changement de tri
   */
  const handleSortChange = (sort: "recent" | "popular") => {
    setSortBy(sort);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Rendu des statistiques de la communauté
   */
  const renderCommunityStats = () => {
    if (isLoadingStats) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      );
    }

    if (!communityStats) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {communityStats.total_users.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Membres</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            {communityStats.total_posts.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Posts</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {communityStats.active_users}
          </div>
          <div className="text-xs text-muted-foreground">
            Actifs aujourd'hui
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageCircle className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {realTimeStats?.users_online || 0}
          </div>
          <div className="text-xs text-muted-foreground">En ligne</div>
        </div>
      </div>
    );
  };

  /**
   * Rendu du formulaire de création de post
   */
  const renderPostForm = () => {
    if (!user) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Rejoignez la conversation !
              </h3>
              <p className="text-muted-foreground mb-4">
                Connectez-vous pour partager vos idées avec la communauté.
              </p>
              <Button onClick={() => (window.location.href = "/auth")}>
                Se connecter
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Partager quelque chose
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sélecteur de catégorie */}
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Général</SelectItem>
                <SelectItem value="discussion">Discussion</SelectItem>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="conseil">Conseil</SelectItem>
                <SelectItem value="actualite">Actualité</SelectItem>
                <SelectItem value="evenement">Événement</SelectItem>
                <SelectItem value="emploi">Emploi</SelectItem>
              </SelectContent>
            </Select>

            {/* Zone de texte */}
            <Textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Que souhaitez-vous partager avec la communauté ?"
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />

            {/* Compteur de caractères et boutons */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {newPostContent.length}/1000 caractères
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewPostContent("");
                    setSelectedCategory("all");
                  }}
                  disabled={
                    !newPostContent.trim() || createPostMutation.isPending
                  }
                >
                  Effacer
                </Button>
                <Button
                  onClick={handleSubmitPost}
                  disabled={
                    !newPostContent.trim() ||
                    newPostContent.length > 1000 ||
                    createPostMutation.isPending
                  }
                  size="sm"
                >
                  {createPostMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    "Publier"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  /**
   * Rendu des filtres et recherche
   */
  const renderFilters = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les posts..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtre de catégorie */}
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              <SelectItem value="discussion">Discussion</SelectItem>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="conseil">Conseil</SelectItem>
              <SelectItem value="actualite">Actualité</SelectItem>
              <SelectItem value="evenement">Événement</SelectItem>
              <SelectItem value="emploi">Emploi</SelectItem>
            </SelectContent>
          </Select>

          {/* Tri */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full md:w-48">
              <TrendingUp className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="popular">Plus populaires</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * Rendu de la liste des posts
   */
  const renderPosts = () => {
    if (isLoadingPosts) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <div className="w-32 h-4 bg-gray-200 rounded mb-1" />
                    <div className="w-24 h-3 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (postsError) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                <p className="font-medium">Erreur de chargement</p>
              </div>
              <p className="text-muted-foreground mb-4">
                Une erreur s'est produite lors du chargement des posts.
              </p>
              <Button onClick={() => refetchPosts()}>Réessayer</Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (posts.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || selectedCategory !== "all"
                  ? "Aucun post trouvé"
                  : "Aucun post pour le moment"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== "all"
                  ? "Essayez de modifier vos critères de recherche."
                  : "Soyez le premier à partager quelque chose avec la communauté !"}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {posts.map((post: any) => (
          <CommunityPost key={post.id} post={post} onUpdate={refetchPosts} />
        ))}
      </div>
    );
  };

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Communauté</h1>
        <p className="text-muted-foreground">
          Échangez, partagez et connectez-vous avec la communauté Guyane
          Marketplace
        </p>
      </div>

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>État de la communauté</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeedbackModal(true)}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Feedback
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>{renderCommunityStats()}</CardContent>
      </Card>

      {/* Bannière sponsorisée */}
      <SponsoredBanner />

      {/* Formulaire de création de post */}
      {renderPostForm()}

      {/* Filtres et recherche */}
      {renderFilters()}

      {/* Liste des posts */}
      {renderPosts()}

      {/* Modal de feedback */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        category="community"
      />
    </div>
  );
}
