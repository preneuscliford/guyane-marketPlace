"use client";

import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const client = supabase;

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      try {
        setIsUploading(true);
        const newImages = [];
        const toastId = toast.loading("Téléchargement des images...");

        for (const [index, file] of acceptedFiles.entries()) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}.${fileExt}`;
          const filePath = `announcements/${fileName}`;

          toast.loading(
            `Téléchargement de l&#39;image ${index + 1}/${
              acceptedFiles.length
            }...`,
            {
              id: toastId,
            }
          );

          const { error: uploadError } = await client.storage
            .from("announcements-images")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw uploadError;
          }

          const {
            data: { publicUrl },
          } = client.storage
            .from("announcements-images")
            .getPublicUrl(filePath);

          newImages.push(publicUrl);
        }

        onChange([...value, ...newImages]);
        toast.success("Images téléchargées avec succès", { id: toastId });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Erreur lors du téléchargement des images";
        toast.error(message, { duration: 5000 });
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center cursor-pointer bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-colors duration-200"
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
              <p>Déposez les images ici&#8230;</p>
            ) : (
              <p>
                Glissez-déposez des images ici, ou cliquez pour sélectionner
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, JPEG jusqu&#39;à 5MB
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
                className="object-cover rounded-lg transition-transform duration-200 hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Supprimer cette image ?")) {
                    onRemove(url);
                  }
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
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
