import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string | null;
  post_id: string | null;
  profiles?: {
    username: string;
    is_admin?: boolean;
  } | null;
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
        .select(`*`)
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des commentaires:", error);
        return;
      }

      setComments((data as Comment[]) || []);
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-700">
                  {comment.profiles?.username || "Utilisateur anonyme"}
                </span>
                {comment.profiles?.is_admin && (
                  <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                    <Crown className="h-3 w-3" />
                    Admin
                  </span>
                )}
              </div>
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
