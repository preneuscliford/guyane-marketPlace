"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { Button } from "@/components/ui/Button";
import { Loader2, Camera, X } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    location: "",
    skills: "",
    phone: "",
    website: "",
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        username: user.profile.username || "",
        full_name: user.profile.full_name || "",
        bio: user.profile.bio || "",
        location: user.profile.location || "",
        skills: user.profile.skills ? user.profile.skills.join(", ") : "",
        phone: user.profile.phone || "",
        website: user.profile.website || "",
      });
      setAvatarUrl(user.profile.avatar_url || null);
    }
  }, [user?.profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 2 Mo");
        return;
      }
      
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarUrl(null);
  };

  const uploadAvatar = async () => {
    if (!user || !avatarFile) return null;

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'avatar:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      
      // Télécharger l'avatar si nécessaire
      let newAvatarUrl = user?.profile?.avatar_url;
      if (avatarFile) {
      const uploadResult = await uploadAvatar();
      newAvatarUrl = uploadResult ?? undefined;
      } else if (avatarUrl === null && user?.profile?.avatar_url) {
        // L'utilisateur a supprimé son avatar
        newAvatarUrl = undefined;
      }
      
      // Préparer les données du profil
      const profileData = {
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        location: formData.location,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        phone: formData.phone,
        website: formData.website,
        avatar_url: newAvatarUrl,
      };
      
      const { error } = await updateProfile(profileData);
      
      if (error) throw error;
      
      alert("Profil mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert("Une erreur est survenue lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="container max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {avatarUrl ? (
                  <div className="relative">
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      width={128}
                      height={128}
                      className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100"
                    />
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-bold text-4xl">
                      {formData.username ? formData.username.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                )}
                
                <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-md hover:bg-indigo-700 transition-colors cursor-pointer">
                  <Camera size={20} />
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG ou GIF. 2 Mo maximum.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d&apos;utilisateur*
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Biographie
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Parlez-nous de vous..."
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Cayenne, Guyane"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Compétences
                </label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Séparées par des virgules"
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Site web
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://monsite.com"
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}