"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "../hooks/useAuth";

interface CommentFormProps {
  postId: string;
  onCommentAdded?: () => void;
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Vous devez être connecté pour commenter");
      return;
    }

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("comments").insert([
        {
          content: content.trim(),
          post_id: postId,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      setContent("");
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      alert("Une erreur est survenue lors de l'ajout du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center bg-gray-50 rounded-lg">
        <p>Connectez-vous pour ajouter un commentaire</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez votre commentaire..."
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className={`px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer"}
      </button>
    </form>
  );
}
