"use client";

import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

interface PostImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export function PostImageUpload({
  value,
  onChange,
  onRemove,
}: PostImageUploadProps) {
  const [isUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Combine new files with existing ones (up to 5 total)
      const newFiles = [...value, ...acceptedFiles].slice(0, 5);
      onChange(newFiles);
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
              // eslint-disable-next-line react/no-unescaped-entities
              <p>Déposez les images ici...</p>
            ) : (
              // eslint-disable-next-line react/no-unescaped-entities
              <p>
                Glissez-déposez des images ici, ou cliquez pour sélectionner
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              PNG, JPG, JPEG jusqu'à 5MB (max 5 images)
            </p>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((file, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                fill
                src={URL.createObjectURL(file)}
                alt="Image preview"
                className="object-cover rounded-lg transition-transform duration-200 hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
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
