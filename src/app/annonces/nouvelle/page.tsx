"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";

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
      <div className="container max-w-2xl py-8">
        <h1 className="mb-8 text-3xl font-bold">
          Publier une nouvelle annonce
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Titre
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Prix (€)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Localisation
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/annonces")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Publication..." : "Publier"}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}
