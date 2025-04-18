"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";



import { ProtectedLayout } from "@/components/layout/protected-layout";
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase.from("announcements").insert({
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        user_id: user.id,
      });

      if (error) throw error;
      router.push("/annonces");
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce:", error);
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
      <div className="container py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold">Publier une nouvelle annonce</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Titre */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: iPhone 13 Pro Max - 256GB"
                />
              </div>

              {/* Catégorie et Prix */}
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  name="category"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 299.99"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
              
                id="description"
                name="description"
                rows={5}
                required
                className="min-h-[120px]"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre annonce en détail..."
              />
            </div>

            {/* Localisation */}
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Cayenne, Guyane"
              />
            </div>

            {/* Boutons */}
            <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-end md:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/annonces")}
                className="w-full md:w-auto bg-white text-primary border-primary hover:bg-gray-50"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white"
              >
                {loading ? "Publication..." : "Publier l'annonce"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
