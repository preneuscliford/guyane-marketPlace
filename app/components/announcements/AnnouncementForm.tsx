"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";

interface AnnouncementFormProps {
  onSuccess?: () => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
  };
}

const CATEGORIES = [
  "Immobilier",
  "Véhicules",
  "Emploi",
  "Mode",
  "Maison",
  "Multimédia",
  "Loisirs",
  "Matériel Professionnel",
  "Services",
  "Autres",
];

export default function AnnouncementForm({
  onSuccess,
  initialData,
}: AnnouncementFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [category, setCategory] = useState(
    initialData?.category || CATEGORIES[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Vous devez être connecté pour publier une annonce");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data = {
        title,
        description,
        price: price ? parseFloat(price) : null,
        category,
        user_id: user.id,
      };

      let result;
      if (initialData) {
        result = await supabase
          .from("announcements")
          .update(data)
          .eq("id", initialData.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("announcements")
          .insert([data])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      if (onSuccess) onSuccess();

      if (!initialData) {
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory(CATEGORIES[0]);
      }
    } catch (error) {
      console.error("Erreur:", error);
      if (error instanceof Error) {
        if (error.message.includes("duplicate key")) {
          setError("Une annonce similaire existe déjà");
        } else if (error.message.includes("not found")) {
          setError("Table non trouvée. Contactez l'administrateur");
        } else if (error.message.includes("permission denied")) {
          setError("Vous n'avez pas les permissions nécessaires");
        } else {
          setError(error.message);
        }
      } else {
        setError("Une erreur inattendue est survenue");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        Vous devez être connecté pour publier une annonce
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Titre
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Catégorie
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Prix (€)
        </label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          rows={5}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? "Envoi en cours..."
          : initialData
          ? "Mettre à jour l'annonce"
          : "Publier l'annonce"}
      </Button>
    </form>
  );
}
