"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { Plus, MapPin, Search, Filter, Grid, List, Heart, Eye } from "lucide-react";

import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate, formatPrice } from "lib/utils";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"] & {
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
  images: string[] | null;
};

const categories = [
  "Tous",
  "Véhicules",
  "Immobilier",
  "Emploi",
  "Mode",
  "Maison",
  "Multimédia",
  "Loisirs",
  "Matériel Professionnel",
  "Autres",
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Effet pour filtrer les annonces
  useEffect(() => {
    let filtered = announcements;

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (announcement) =>
          announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par catégorie
    if (selectedCategory !== "Tous") {
      filtered = filtered.filter(
        (announcement) => announcement.category === selectedCategory
      );
    }

    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, selectedCategory]);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select(
          `
          *,
          profiles:user_id(
            username,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error loading announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-16 px-8 pt-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-8 px-8 pt-24">
        {/* En-tête avec titre et bouton */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary">Marché Guyanais</h1>
            <p className="mt-2 text-lg text-muted-foreground">Découvrez des offres uniques dans votre région</p>
          </div>
          <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90 transition-colors">
            <Link href="/annonces/nouvelle" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Déposer une annonce
            </Link>
          </Button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 space-y-4">
          {/* Barre de recherche principale */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher une annonce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Filtres et options d'affichage */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              
              {/* Filtres de catégories (toujours visibles sur desktop) */}
              <div className="hidden md:flex flex-wrap gap-2">
                {categories.slice(0, 6).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Options d'affichage et compteur */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {filteredAnnouncements.length} annonce{filteredAnnouncements.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filtres mobiles dépliables */}
          {showFilters && (
            <div className="md:hidden space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Affichage des annonces */}
        {filteredAnnouncements.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center rounded-xl border bg-gray-50">
            {announcements.length === 0 ? (
              <div className="text-center">
                <p className="text-xl text-muted-foreground mb-2">Aucune annonce disponible pour le moment</p>
                <p className="text-sm text-muted-foreground">Soyez le premier à publier une annonce !</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xl text-muted-foreground mb-2">Aucun résultat trouvé</p>
                <p className="text-sm text-muted-foreground">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "space-y-4"
          }>
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className={`group relative bg-white border rounded-xl shadow-sm transition-all hover:shadow-lg hover:border-primary/50 ${
                  viewMode === "list" ? "flex gap-4 p-4" : "flex flex-col overflow-hidden"
                }`}
              >
                {/* Image */}
                <div className={`relative bg-gray-100 ${
                  viewMode === "list" 
                    ? "w-48 h-32 flex-shrink-0 rounded-lg" 
                    : "aspect-[4/3] w-full"
                }`}>
                  <Link href={`/annonces/${announcement.id}`} className="block h-full">
                    {announcement.images && announcement.images.length > 0 ? (
                      <Image
                        src={announcement.images[0]}
                        alt={announcement.title}
                        fill
                        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                          viewMode === "list" ? "rounded-lg" : ""
                        }`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                      />
                    ) : (
                      <div className={`flex h-full items-center justify-center bg-gray-50 ${
                        viewMode === "list" ? "rounded-lg" : ""
                      }`}>
                        <span className="text-gray-400 text-sm">Aucune image</span>
                      </div>
                    )}
                  </Link>
                  
                  {/* Bouton favoris */}
                  <button className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                  </button>
                </div>

                {/* Contenu */}
                <div className={`flex flex-1 flex-col ${
                  viewMode === "list" ? "justify-between" : "p-4"
                }`}>
                  <div>
                    {/* En-tête avec catégorie et utilisateur */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        {announcement.category}
                      </span>
                      {announcement.profiles && (
                        <span className="text-sm text-muted-foreground">
                          {announcement.profiles.username}
                        </span>
                      )}
                    </div>

                    {/* Titre et description */}
                    <Link href={`/annonces/${announcement.id}`}>
                      <h3 className={`font-semibold text-foreground group-hover:text-primary transition-colors ${
                        viewMode === "list" ? "text-xl mb-2" : "text-lg mb-2 line-clamp-1"
                      }`}>
                        {announcement.title}
                      </h3>
                    </Link>
                    
                    <p className={`text-sm text-muted-foreground ${
                      viewMode === "list" ? "line-clamp-3 mb-4" : "line-clamp-2 mb-4 flex-1"
                    }`}>
                      {announcement.description}
                    </p>
                  </div>

                  {/* Pied avec prix et infos */}
                  <div className={`space-y-2 ${
                    viewMode === "list" ? "" : "mt-auto"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-primary ${
                        viewMode === "list" ? "text-xl" : "text-lg"
                      }`}>
                        {announcement.price ? formatPrice(announcement.price) : "Prix sur demande"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(announcement.created_at)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {announcement.location}
                      </div>
                      
                      {viewMode === "list" && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>125 vues</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
