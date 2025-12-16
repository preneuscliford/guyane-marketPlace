import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  profiles: {
    username: string;
  };
}

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const client = supabase;

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await client
        .from("comments")
        .select(
          `
          *,
          profiles (
            username
          )
        `
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des commentaires:", error);
        return;
      }

      setComments(data || []);
      setLoading(false);
    };

    fetchComments();

    // Souscription aux changements en temps réel
    const channel = client
      .channel("comments-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((prev) => [payload.new as Comment, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setComments((prev) =>
              prev.filter((comment) => comment.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [postId]);

  if (loading) {
    return (
      <div className="animate-pulse p-4">Chargement des commentaires...</div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Aucun commentaire pour le moment
        </p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">
                {comment.profiles?.username || "Utilisateur anonyme"}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-gray-600">{comment.content}</p>
          </div>
        ))
      )}
    </div>
  );
}
