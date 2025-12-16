"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { PostImageUpload } from "@/components/ui/PostImageUpload";
import Link from "next/link";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import ReportButton from "@/components/moderation/ReportButton";
import { usePostsQuery, useCreatePostMutation } from "@/hooks/usePosts.query";
import { useToggleLikeMutation } from "@/hooks/useLikes.query";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};
type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: Profile;
  likes_count: number;
  comments_count: number;
  image_url?: string;
  likes?: { user_id: string }[];
};

export default function ActualitesPage() {
  const { user } = useAuth();
  const { data: postsData = [], isLoading: loading, refetch } = usePostsQuery({ sortBy: "recent" });
  const createPostMutation = useCreatePostMutation();
  const toggleLikeMutation = useToggleLikeMutation();
  const [newPost, setNewPost] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          refetch();
        }
      },
      { threshold: 1.0 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [refetch]);

  const posts = postsData as unknown as Post[];

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const hasMore = true;

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

      // Upload des images
      const imageUrls = await Promise.all(
        selectedImages.map(async (file) => {
          const fileExt = file.name.split(".").pop();
          const filePath = `post_${Date.now()}_${Math.random().toString(
            36
          )}.${fileExt}`;

          const { error } = await supabase.storage
            .from("post-images")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (error) throw error;
          return supabase.storage.from("post-images").getPublicUrl(filePath)
            .data.publicUrl;
        })
      );

      const newPostData = {
        content: newPost.trim(),
        image_url: imageUrls[0], // Using first image only since table expects single URL
      };

      await createPostMutation.mutateAsync(newPostData);

      setNewPost("");
      setSelectedImages([]);
      setUploadProgress(0);
      await refetch();
    } catch (error) {
      console.error("Erreur complète lors de la création:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      setError(
        error instanceof Error
          ? `Erreur: ${error.message}`
          : "Une erreur inattendue s'est produite lors de la création de la publication"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      const currentlyLiked =
        posts.find((p) => p.id === postId)?.likes?.some((like) => like.user_id === user?.id) ??
        false;
      toggleLikeMutation.mutate({ postId, currentlyLiked });
      await refetch();
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
                  {post.profiles?.avatar_url && (
                    <Image
                      src={post.profiles?.avatar_url}
                      width={48}
                      height={48}
                      className="h-full w-full rounded-full object-cover"
                      alt={post.profiles?.username || ""}
                    />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-800">
                    {post.profiles?.full_name || post.profiles?.username}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(post.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <p className="mb-6 whitespace-pre-wrap text-slate-700">
                {post.content}
              </p>

              {post.image_url && (
                <div className="mb-6 aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={post.image_url}
                    alt=""
                    width={800}
                    height={800}
                    className="h-full w-full object-cover"
                  />
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

                    <span>{post?.likes?.length || 0}</span>
                  </button>
                  <Link
                    href={`/communaute/${post.id}`}
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
                <ReportButton
                  contentType="post"
                  contentId={post.id}
                  reportedUserId={post.user_id}
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-red-600"
                  showText={false}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <ProtectedLayout>
        <div className="min-h-screen">
          <div className="container py-8 pt-8">
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
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images
                    </label>
                    <PostImageUpload
                      value={selectedImages}
                      onChange={setSelectedImages}
                      onRemove={(index) => {
                        setSelectedImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    />
                  </div>
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
    </>
  );
}
