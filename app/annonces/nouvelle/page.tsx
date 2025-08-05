"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/ui/ImageUpload";

import { ProtectedLayout } from "@/components/layout/protected-layout";
import { Header } from "@/components/layout/Header";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";

const categories = [
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

export default function NewAnnouncementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    images: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.from("announcements").insert({
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        user_id: user.id,
      });

      if (error) throw error;
      router.push("/annonces");
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce:", error);
      setError("Une erreur est survenue lors de la publication");

      // Clean up uploaded images
      try {
        await Promise.all(
          formData.images.map(async (url) => {
            const path = url.split("/").pop();
            await supabase.storage
              .from("announcements-images")
              .remove([`announcements/${path}`]);
          })
        );
        setFormData((prev) => ({ ...prev, images: [] }));
      } catch (cleanupError) {
        console.error("Erreur lors du nettoyage des images:", cleanupError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ProtectedLayout>
      <Header />
      <div className="container py-8 pt-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold">
            Publier une nouvelle annonce
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Titre */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title" className="text-base font-medium">Titre de l'annonce</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: iPhone 13 Pro Max - 256GB"
                  className="h-12 text-base"
                />
              </div>

              {/* Catégorie et Prix */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-medium">Catégorie</Label>
                <select
                  id="category"
                  name="category"
                  required
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-base font-medium">Prix (€)</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 299.99"
                  className="h-12 text-base"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">Description détaillée</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                required
                className="min-h-[150px] text-base resize-y"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre annonce en détail..."
              />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Photos de l'annonce</Label>
              <ImageUpload
                value={formData.images}
                onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                onRemove={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    images: prev.images.filter((imageUrl) => imageUrl !== url),
                  }))
                }
              />
            </div>

            {/* Localisation */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-medium">Localisation</Label>
              <Input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Cayenne, Guyane"
                className="h-12 text-base"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex flex-col-reverse gap-4 pt-4 md:flex-row md:justify-end md:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/annonces")}
                className="w-full md:w-auto bg-white text-gray-700 border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white transition-colors"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    Publication en cours...
                  </div>
                ) : (
                  "Publier l'annonce"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
