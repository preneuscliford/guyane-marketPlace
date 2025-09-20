"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TestUploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      console.log("Début de l'upload...", file.name, file.size);

      // Vérifier la taille du fichier
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Le fichier est trop volumineux (max 5MB)");
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error("Le fichier doit être une image");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `announcements/${fileName}`;

      console.log("Tentative d'upload vers:", filePath);

      // Test de connexion Supabase
      const { data: user } = await supabase.auth.getUser();
      console.log("Utilisateur connecté:", user.user?.email || "Non connecté");

      // Upload du fichier
      const { data, error: uploadError } = await supabase.storage
        .from("announcements-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Erreur d'upload:", uploadError);
        throw uploadError;
      }

      console.log("Upload réussi:", data);

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from("announcements-images")
        .getPublicUrl(filePath);

      console.log("URL publique:", publicUrl);
      setUploadedUrl(publicUrl);
      toast.success("Image uploadée avec succès!");

    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Test Upload d'Images</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Sélectionner une image de test
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {isUploading && (
          <div className="text-blue-600">
            Upload en cours... Vérifiez la console pour les détails.
          </div>
        )}

        {uploadedUrl && (
          <div className="space-y-2">
            <p className="text-green-600 font-medium">Image uploadée avec succès!</p>
            <p className="text-sm text-gray-600 break-all">URL: {uploadedUrl}</p>
            <img 
              src={uploadedUrl} 
              alt="Image uploadée" 
              className="max-w-xs rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Instructions de debug:</h3>
        <ol className="text-sm text-gray-600 space-y-1">
          <li>1. Ouvrez la console du navigateur (F12)</li>
          <li>2. Sélectionnez une image</li>
          <li>3. Observez les logs dans la console</li>
          <li>4. Vérifiez les erreurs éventuelles</li>
        </ol>
      </div>
    </div>
  );
}
