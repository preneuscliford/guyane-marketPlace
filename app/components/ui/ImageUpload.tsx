"use client";

import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

export function ImageUpload({
  value,
  onChange,
  onRemove
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClientComponentClient();

  const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
    try {
      setIsUploading(true);
      const newImages = [];

      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `announcements/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      onChange([...value, ...newImages]);
      toast.success("Images téléchargées avec succès");
    } catch (error) {
      toast.error("Erreur lors du téléchargement des images");
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition"
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="ml-2">Téléchargement en cours...</p>
          </div>
        ) : (
          <div>
            {isDragActive ? (
              <p>Déposez les images ici...</p>
            ) : (
              <p>Glissez-déposez des images ici, ou cliquez pour sélectionner</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, JPEG jusqu'à 5MB
            </p>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((url) => (
            <div key={url} className="relative aspect-square">
              <Image
                fill
                src={url}
                alt="Uploaded image"
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => onRemove(url)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}