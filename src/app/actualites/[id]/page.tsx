"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/types/supabase";
import { ProtectedLayout } from "@/components/layout/protected-layout";
// // type Post = Database["public"]["Tables"]["posts"]["Row"]
// type Comment = Database["public"]["Tables"]["comments"]["Row"]

type Post = Database["public"]["Tables"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
  likes: { user_id: string }[];
};

type Comment = Database["public"]["Tables"] & {
  profiles: Database["public"]["Tables"]["profiles"]["Row"];
};

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, []);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profiles (
            id,
            username,
            full_name,
            avatar_url
          ),
          likes (user_id)
        `
        )
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Erreur lors du chargement de la publication:", error);
      router.push("/actualites");
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          *,
          profiles (
            id,
            username,
            full_name,
            avatar_url
          )
        `
        )
        .eq("post_id", params.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase.from("comments").insert({
        content: newComment.trim(),
        post_id: params.id,
        user_id: user.id,
      });

      if (error) throw error;
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de la création du commentaire:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!user || !post) return;

    try {
      const existingLike = post.likes.some((like) => like.user_id === user.id);

      if (existingLike) {
        await supabase
          .from("likes")
          .delete()
          .match({ post_id: post.id, user_id: user.id });
      } else {
        await supabase.from("likes").insert({
          post_id: post.id,
          user_id: user.id,
        });
      }

      fetchPost();
    } catch (error) {
      console.error("Erreur lors de la gestion du like:", error);
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    if (!user) return;
    setEditingCommentId(commentId);
    setEditedContent(content);
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!user || !editedContent.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from("comments")
        .update({ content: editedContent.trim() })
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;
      setEditingCommentId(null);
      setEditedContent("");
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de la modification du commentaire:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleDeleteComment = async (commentId: string) => {
    if (
      !user ||
      !window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")
    )
      return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
    }
  };

  if (loading || !post) {
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
      <div className="container py-8">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => router.push("/actualites")}
            className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour au fil d'actualité
          </button>

          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="p-6">
              <div className="mb-4 flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200">
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
                  <p className="font-semibold">
                    {post.profiles.full_name || post.profiles.username}
                  </p>
                  <p className="text-sm text-gray-500">
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

              <p className="whitespace-pre-wrap text-gray-700">
                {post.content}
              </p>

              <div className="mt-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 text-sm ${
                    post.likes.some((like) => like.user_id === user?.id)
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-blue-600"
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
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">
              Commentaires ({comments.length})
            </h2>

            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="rounded-lg border bg-card p-4">
                <textarea
                  placeholder="Ajouter un commentaire..."
                  className="min-h-[80px] w-full resize-none rounded-md border-0 bg-transparent p-2 text-sm focus:outline-none focus:ring-0"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                  >
                    {submitting ? "Publication..." : "Publier"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border bg-card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-gray-200">
                        {comment.profiles.avatar_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={comment.profiles.avatar_url}
                            alt={comment.profiles.username || ""}
                            className="h-full w-full rounded-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {comment.profiles.full_name ||
                            comment.profiles.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString(
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
                    {user?.id === comment.user_id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleEditComment(comment.id, comment.content)
                          }
                          className="text-sm text-gray-500 hover:text-blue-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-sm text-gray-500 hover:text-red-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        className="min-h-[80px] w-full resize-none rounded-md border bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                      />
                      <div className="mt-2 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={submitting}
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={() => handleSaveEdit(comment.id)}
                          disabled={submitting || !editedContent.trim()}
                        >
                          {submitting ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-gray-700">
                      {comment.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
