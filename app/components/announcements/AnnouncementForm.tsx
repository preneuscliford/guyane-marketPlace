"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { Database } from "@/types/supabase";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

const CATEGORIES = [
  "Véhicules",
  "Immobilier",
  "Emploi",
  "Mode",
  "Maison",
  "Multimédia",
  "Loisirs",
  "Matériel Professionnel",
  "Services",
  "Autres",
];

interface AnnouncementFormProps {
  onSuccess?: () => void;
  initialData?: Database["public"]["Tables"]["announcements"]["Row"];
}

export default function AnnouncementForm({
  onSuccess,
  initialData,
}: AnnouncementFormProps) {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const { trackEvent } = useGoogleAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category || "",
    location: initialData?.location || "",
  });
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      let error;
      if (initialData?.id) {
        // Update existing announcement
        ({ error } = await supabase
          .from("announcements")
          .update({
            title: formData.title,
            description: formData.description,
            price: formData.price ? Number(formData.price) : null,
            category: formData.category,
            location: formData.location,
            images: images.length > 0 ? images : null,
          })
          .eq("id", initialData.id));
      } else {
        // Create new announcement
        ({ error } = await supabase.from("announcements").insert({
          title: formData.title,
          description: formData.description,
          price: formData.price ? Number(formData.price) : null,
          category: formData.category,
          location: formData.location,
          user_id: user.id,
          images: images.length > 0 ? images : null,
        }));
      }

      if (error) throw error;
      toast.success("Annonce publiée avec succès!");
      trackEvent({
        action: initialData?.id ? "update_announcement" : "publish_announcement",
        category: "Annonces",
        label: formData.title,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Une erreur est survenue lors de la publication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Images</Label>
          <ImageUpload
            value={images}
            onChange={(urls) => setImages(urls)}
            onRemove={(url) =>
              setImages((prev) => prev.filter((u) => u !== url))
            }
          />
        </div>
        <div>
          <Label htmlFor="title">Titre de l'annonce</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            placeholder="Ex: iPhone 13 Pro Max - 256GB"
          />
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            placeholder="Décrivez votre annonce en détail (minimum 20 caractères)"
            rows={5}
          />
        </div>

        <div>
          <Label htmlFor="price">Prix (€)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="Ex: 299.99"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
            placeholder="Ex: Cayenne, Guyane"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Publication..." : "Publier l'annonce"}
        </Button>
      </div>
    </form>
  );
}
