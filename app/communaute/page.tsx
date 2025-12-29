"use client";

import { useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
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
  Award,
  ShoppingBag
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { 
  usePostsQuery, 
  useCreatePostMutation, 
  useCommunityStatsQuery,
  type PostFilters
} from "@/hooks/usePosts.query";
import { PostWithDetails } from "@/hooks/usePosts.query";

/**
 * Page principale de la communauté avec système de posts imbriqués,
 * affiches publicitaires intégrées et statistiques
 * Migrée vers TanStack Query pour une meilleure performance et UX
 */
export default function CommunautePage() {
  const { user } = useAuth();
  const { trackPostCreated, trackSearch } = useAnalytics();
  
  // États locaux pour les filtres et le formulaire
  const [newPostContent, setNewPostContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // Debounce ou état intermédiaire pour la recherche si nécessaire, 
  // ici on passera searchQuery directement au hook mais idéalement on debouncerait
  const [activeSearch, setActiveSearch] = useState(""); 
  
  const [sortBy, setSortBy] = useState<PostFilters['sortBy']>("recent");

  // Hooks TanStack Query
  const { 
    data: posts = [], 
    isLoading: postsLoading, 
    refetch: refetchPosts 
  } = usePostsQuery({ 
    searchQuery: activeSearch, 
    sortBy 
  });

  const { data: stats } = useCommunityStatsQuery();

  const createPostMutation = useCreatePostMutation();

  /**
   * Publie un nouveau post
   */
  const handleSubmitPost = async () => {
    if (!user || !newPostContent.trim()) return;

    try {
      await createPostMutation.mutateAsync({
        content: newPostContent.trim(),
        image_url: undefined // Support image à ajouter plus tard si besoin
      });

      setNewPostContent("");
      
      // Analytics
      trackPostCreated({
        content_length: newPostContent.length,
        has_image: false,
        post_type: "community_post",
      });

      try {
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "community_post_create", {
            event_category: "Communauté",
            event_label: "new_post",
          });
        }
      } catch {}

    } catch (error) {
      // L'erreur est déjà gérée par le hook (toast.error)
      console.error("Erreur lors de la publication:", error);
    }
  };

  /**
   * Gère la recherche
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);

    if (searchQuery.trim()) {
      trackSearch({
        search_term: searchQuery,
        category: "community",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la communauté */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-teal-600 flex-shrink-0" />
                Communauté {"&"} Entraide
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 leading-relaxed">
                Le cœur battant de la Guyane : échangez, recommandez, et trouvez les meilleurs produits et services.
              </p>
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => {
                  const el = document.querySelector("#new-post-form");
                  el?.scrollIntoView({ behavior: "smooth" });
                  // Focus le textarea si possible
                  setTimeout(() => {
                    const textarea = document.querySelector("#new-post-form") as HTMLTextAreaElement;
                    textarea?.focus();
                  }, 500);
                }}
              >
                Poster un message
              </Button>
              {!user && (
                <Button variant="outline" asChild>
                  <Link href="/auth">Rejoindre la communauté</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {stats?.total_posts || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Discussions
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {stats?.posts_today || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Aujourd'hui
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {stats?.total_users || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Membres
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                  {stats?.active_users || 0}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Actifs (24h)
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message incitatif de la communauté */}
          <Card className="bg-gradient-to-r from-purple-50 to-emerald-50 border-purple-200 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 p-1 rounded">🎯</span>
                Ici, la communauté aide à :
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 bg-green-100 text-green-700 rounded-full p-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-gray-700 font-medium">Trouver un service fiable</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 bg-green-100 text-green-700 rounded-full p-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-gray-700 font-medium">Éviter les arnaques</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 bg-green-100 text-green-700 rounded-full p-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-gray-700 font-medium">Repérer les bonnes opportunités locales</span>
                  </li>
                </ul>

                <div className="flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-purple-100 pt-4 md:pt-0 md:pl-6">
                   <p className="text-sm text-gray-600 italic mb-1">
                     "La confiance est notre monnaie d'échange."
                   </p>
                   <Link href="/services" className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800 hover:underline transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                      Découvrir les services recommandés
                   </Link>
                   <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                      <Award className="w-4 h-4" />
                      Gagnez des badges (Membre Actif, Ambassadeur...)
                   </div>
                </div>
              </div>
              
              {!user && (
                <div className="mt-6 flex justify-center sm:justify-start">
                  <Button
                    asChild
                    className="bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all"
                  >
                    <Link href="/auth">Rejoindre la communauté</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
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

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as PostFilters['sortBy'])}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récents</SelectItem>
                <SelectItem value="popular">Plus populaires</SelectItem>
                <SelectItem value="trending">Tendances</SelectItem>
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
                      placeholder="Quoi de neuf ? Une question, un bon plan, une recommandation ?"
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
                        onClick={handleSubmitPost}
                        disabled={createPostMutation.isPending || !newPostContent.trim()}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        {createPostMutation.isPending ? "Publication..." : "Publier"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Affiche publicitaire intégrée */}
            <div className="my-8">
              <div className="relative w-full h-48 md:h-56 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl overflow-hidden flex items-center justify-center shadow-md">
                <div className="text-center text-white p-4">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Marketplace Guyane</h3>
                  <p className="text-teal-100 text-sm sm:text-base font-medium">Votre plateforme locale de confiance</p>
                </div>
              </div>
            </div>

            {/* Liste des posts */}
            {postsLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-600"></div>
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeSearch
                      ? "Aucun résultat trouvé"
                      : "Aucun post pour le moment"}
                  </h3>
                  <p className="text-gray-500 text-center">
                    {activeSearch
                      ? "Essayez avec d'autres mots-clés"
                      : "Soyez le premier à partager quelque chose avec la communauté !"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {posts.map((post: PostWithDetails) => (
                  <div key={post.id}>
                    {/* 
                       Note: Le composant CommunityPost attend peut-être un type légèrement différent 
                       mais PostWithDetails est très complet. Si erreur TS, on adaptera.
                       Ici on passe les props nécessaires.
                    */}
                    <CommunityPost post={post} onUpdate={() => refetchPosts()} />

                    {/* Affiche publicitaire tous les 3 posts - Supprimé pour ne garder que la bannière principale */}
                    {/* {(index + 1) % 3 === 0 && index < posts.length - 1 && (
                      <div className="my-6">
                        <SponsoredBanner
                          className="h-40 md:h-48"
                          autoPlayInterval={10000}
                          showControls={false}
                        />
                      </div>
                    )} */}
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
                  <div className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors">
                    <span className="text-sm font-medium text-teal-700">#MarketplaceGuyane</span>
                    <span className="text-xs text-gray-500">Populaire</span>
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors">
                    <span className="text-sm font-medium text-teal-700">#ServiceLocal</span>
                    <span className="text-xs text-gray-500">Top Service</span>
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors">
                    <span className="text-sm font-medium text-teal-700">#Entreprendre</span>
                    <span className="text-xs text-gray-500">Business</span>
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
