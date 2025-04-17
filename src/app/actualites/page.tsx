"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/types/supabase";
import Link from "next/link";
import { ProtectedLayout } from "@/components/layout/protected-layout";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type PostBase = Database["public"]["Tables"]["posts"]["Row"];

type Post = PostBase & {
  profiles: Profile;
  likes: { user_id: string }[];
  comments: { id: string }[];
};

export default function ActualitesPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkAndCreateProfile();
    }
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles!inner(*), likes(user_id), comments(id)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement:", error);
        setError(
          "Erreur lors du chargement des publications: " + error.message
        );
        return;
      }

      console.log("Publications chargées avec succès:", data);

      // Transformer les données pour correspondre au type Post
      const formattedPosts = data.map((post: any) => ({
        ...post,
        profiles: post.profiles,
        likes: post.likes || [],
        comments: post.comments || [],
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Erreur inattendue:", error);
      setError("Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

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

      const newPostData = {
        content: newPost.trim(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Données de la nouvelle publication:", newPostData);

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

      console.log("Publication créée avec succès:", data);
      setNewPost("");
      await fetchPosts();
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
      const existingLike = posts
        .find((p) => p.id === postId)
        ?.likes.some((like) => like.user_id === user.id);

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

      fetchPosts();
    } catch (error) {
      console.error("Erreur lors de la gestion du like:", error);
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </ProtectedLayout>
    );
  }

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

            {loading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-teal-600"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center text-slate-500">
                Aucune publication pour le moment.
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post: Post) => (
                  <div
                    key={post.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="p-6">
                      <div className="mb-4 flex items-center space-x-4">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                          {post.profiles.avatar_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={post.profiles.avatar_url}
                              alt={post.profiles.username || ""}
                              className="h-full w-full rounded-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
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

                      <p className="whitespace-pre-wrap text-slate-600">
                        {post.content}
                      </p>

                      <div className="mt-4 flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-1 rounded-lg px-3 py-1 text-sm transition-colors ${
                            post.likes.some((like) => like.user_id === user?.id)
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
                          <span>{post.likes.length}</span>
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
                          <span>{post.comments.length}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
