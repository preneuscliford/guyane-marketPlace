"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/types/supabase";
import Link from "next/link";
import { ProtectedLayout } from "@/components/layout/protected-layout";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: Profile;
  likes_count: number;
  comments_count: number;
  images?: string[];
  likes?: { user_id: string }[];
};

type PostWithProfile = Post & {
  profiles: Profile;
};

export default function ActualitesPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  const fetchPosts = async (currentPage = 1) => {
    try {
      currentPage === 1 ? setLoading(true) : setLoadingMore(true);
      const limit = 10;
      const from = (currentPage - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id(
            username,
            avatar_url
          ),
           likes(*),
           comments(*)
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

        console.log(data)

      if (error) throw error;

      setHasMore(data.length >= limit);
      setPosts((prev) =>
        currentPage === 1 ? data : [...prev, ...data]
      );
    } catch (error) {
      console.error("Erreur de chargement détaillée:", {
        message: error.message,
        details: error.details,
        code: error.code
      });
      setError(error.message || "Erreur lors du chargement des publications");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkAndCreateProfile();
      fetchPosts(1);
    }
  }, [user]);


  const checkAndCreateProfile = async () => {
    if (!user) return;

    try {
      // Vérifier si le profil existe
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (fetchError || !profile) {
        // Créer le profil s'il n'existe pas
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          username: user.email?.split("@")[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("Erreur lors de la création du profil:", insertError);
          setError("Erreur lors de la création du profil utilisateur");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du profil:", error);
    }
  };

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Vous devez être connecté pour publier");
      return;
    }

    if (!newPost.trim()) {
      setError("Le contenu de la publication ne peut pas être vide");
      return;
    }

    try {
      setSubmitting(true);

      // Vérifier à nouveau si le profil existe
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        await checkAndCreateProfile();
      }

      // Upload des images
      const imageUrls = await Promise.all(
        selectedImages.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const filePath = `post_${Date.now()}_${Math.random().toString(36)}.${fileExt}`;
          
          const { error } = await supabase.storage
            .from('post_images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });
          
          if (error) throw error;
          return supabase.storage.from('post_images').getPublicUrl(filePath).data.publicUrl;
        })
      );

      const newPostData = {
        content: newPost.trim(),
        user_id: user.id,
        images: imageUrls,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("posts")
        .insert(newPostData)
        .select()
        .single();

      if (error) {
        console.error("Erreur détaillée lors de la création:", error);
        setError(`Erreur lors de la création: ${error.message}`);
        return;
      }

      setNewPost("");
      setSelectedImages([]);
      setUploadProgress(0);
      await fetchPosts(1);
    } catch (error) {
      console.error("Erreur complète lors de la création:", error);
      setError(
        "Une erreur inattendue s'est produite lors de la création de la publication"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const { data: likes } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id);

      const existingLike = likes && likes.length > 0;

      if (existingLike) {
        await supabase
          .from("likes")
          .delete()
          .match({ post_id: postId, user_id: user.id });
      } else {
        await supabase.from("likes").insert({
          post_id: postId,
          user_id: user.id,
        });
      }

      await fetchPosts(1);
    } catch (error) {
      console.error("Erreur lors de la gestion du like:", error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-teal-600"></div>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center text-slate-500">
          Aucune publication pour le moment.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all hover:shadow-lg"
          >
            <div className="p-6">
              <div className="mb-4 flex items-center space-x-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                  {post.profiles.avatar_url && (
                    <img
                      src={post.profiles.avatar_url}
                      className="h-full w-full rounded-full object-cover"
                      alt={post.profiles.username || ""}
                    />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-800">
                    {post.profiles.full_name || post.profiles.username}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(post.created_at).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              <p className="mb-6 whitespace-pre-wrap text-slate-700">
                {post.content}
              </p>

              {post.images && post.images.length > 0 && (
                <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {post.images.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-xl"
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm transition-colors ${
                      post.likes?.some((like) => like.user_id === user?.id)
                        ? "bg-rose-50 text-rose-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-rose-600"
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    
                    <span>{post?.likes?.length  || 0}</span>
                  </button>
                  <Link
                    href={`/actualites/${post.id}`}
                    className="flex items-center space-x-1 rounded-lg px-3 py-1 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-teal-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{post?.comments_count || 0}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container py-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-8 text-3xl font-bold text-slate-800">
              Fil d'actualité
            </h1>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitPost} className="mb-8">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedImages(Array.from(e.target.files || []))}
                  className="mb-4 text-sm"
                />
                {uploadProgress > 0 && (
                  <div className="mb-4 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                <textarea
                  placeholder="Partagez quelque chose avec la communauté..."
                  className="min-h-[100px] w-full resize-none rounded-lg border-0 bg-transparent p-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-0"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting || !newPost.trim()}
                    className="bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                  >
                    {submitting ? "Publication..." : "Publier"}
                  </Button>
                </div>
              </div>
            </form>

            {renderContent()}

            {hasMore && (
              <div ref={loaderRef} className="flex justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-teal-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
