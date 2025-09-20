"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/AvatarComponent";
import ReportButton from "@/components/ui/ReportButton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Heart,
  Share2,
  MoreHorizontal,
  Edit,
  Trash2,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  full_name?: string; // Utilise full_name au lieu de business_name
  bio?: string; // Ajout du champ bio qui existe dans la DB
}

// Permet d'accepter une Profile ou un objet qui contient au moins les champs requis d'une Profile
type ProfileLike =
  | Profile
  | {
      id: string;
      username: string;
      [key: string]: any;
    };

interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_hidden: boolean;
  like_count: number;
  comment_count: number;
  profiles: ProfileLike;
  user_liked?: boolean;
}

interface CommunityPostProps {
  post: Post;
  level?: number;
  maxLevel?: number;
  onUpdate?: () => void;
}

/**
 * Composant pour afficher un post de la communauté avec système de likes,
 * commentaires imbriqués et modération
 */
export default function CommunityPost({
  post,
  level = 0,
  maxLevel = 3,
  onUpdate,
}: CommunityPostProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.user_liked || false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [commentCount, setCommentCount] = useState(post.comment_count);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replies, setReplies] = useState<Post[]>([]);
  // Les réponses sont masquées par défaut, l'utilisateur doit cliquer pour les voir
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);

  const isAuthor = user?.id === post.user_id;
  const canReply = level < maxLevel;

  /**
   * Charge les commentaires du post
   */
  // Fonction pour obtenir le nombre réel de commentaires depuis la base de données
  const fetchCommentCount = useCallback(async () => {
    try {
      console.log(
        "Vérification du nombre réel de commentaires pour le post:",
        post.id
      );
      const { count, error } = await supabase
        .from("comments" as any)
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)
        .eq("is_hidden", false);

      if (error) {
        console.error("Erreur lors du comptage des commentaires:", error);
        return;
      }

      if (count !== undefined && count !== null && count !== commentCount) {
        console.log(
          `Correction du nombre de commentaires: ${count} (affichait ${commentCount})`
        );
        setCommentCount(count);
        // Forcer la mise à jour si nécessaire
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (error) {
      console.error("Erreur lors du comptage des commentaires:", error);
    }
  }, [post.id, commentCount, onUpdate]);

  const fetchReplies = useCallback(async () => {
    // On ne bloque plus le chargement des commentaires même quand ils ne sont pas visibles
    // Cela permet de précharger les commentaires sans attendre que l'utilisateur clique
    if (level >= maxLevel) return;

    setLoadingReplies(true);
    try {
      // Récupération des commentaires - utiliser uniquement les champs qui existent dans la table
      console.log("Récupération des commentaires pour le post:", post.id);
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments" as any)
        .select("id, content, user_id, post_id, created_at, is_hidden")
        .eq("post_id", post.id)
        .eq("is_hidden", false)
        .order("created_at", { ascending: true })
        .limit(20); // Augmenté à 20 pour voir plus de commentaires

      console.log("Commentaires récupérés:", commentsData);

      if (commentsError) {
        console.error(
          "Erreur lors de la récupération des commentaires:",
          commentsError
        );
        return;
      }

      if (!commentsData || commentsData.length === 0) {
        setReplies([]);
        setCommentCount(0);
        return;
      }

      // Récupération des profils des utilisateurs associés aux commentaires
      const userIds = [
        ...new Set(commentsData.map((comment: any) => comment.user_id)),
      ];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, full_name")
        .in("id", userIds);

      if (profilesError) {
        console.error(
          "Erreur lors de la récupération des profils:",
          profilesError
        );
        // Continuer sans profils si nécessaire
      }

      // Créer un mapping des profils par ID utilisateur pour un accès rapide
      const profilesMap = (profilesData || []).reduce(
        (acc: any, profile: any) => {
          acc[profile.id] = profile;
          return acc;
        },
        {}
      );

      // Créer des objets Post à partir des commentaires récupérés
      const commentsAsReplies: Post[] = commentsData.map((c: any) => ({
        id: c.id,
        content: c.content,
        user_id: c.user_id,
        created_at: c.created_at,
        updated_at: c.created_at, // Les commentaires n'ont pas updated_at, on utilise created_at
        is_hidden: c.is_hidden || false,
        like_count: 0, // Les commentaires n'ont pas de like_count, on initialise à 0
        comment_count: 0, // Les commentaires n'ont pas de sous-commentaires
        profiles: profilesMap[c.user_id] || {
          id: c.user_id,
          username: "Utilisateur",
        },
        user_liked: false, // Par défaut, on suppose que l'utilisateur n'a pas aimé le commentaire
      }));

      // Afficher le nombre de commentaires récupérés pour debug
      console.log(
        `${commentsAsReplies.length} commentaires prêts à être affichés`
      );

      // Mettre à jour l'état avec les commentaires récupérés
      setReplies(commentsAsReplies);

      // Mettre à jour le compteur de commentaires avec le nombre réel
      setCommentCount(commentsAsReplies.length);
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
      toast.error("Impossible de charger les commentaires");
      setReplies([]);
    } finally {
      setLoadingReplies(false);
    }
  }, [post.id, level, maxLevel]);

  /**
   * Gère le like/unlike d'un post avec une meilleure gestion des erreurs
   */
  const handleLike = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour aimer un post");
      return;
    }

    // Éviter les clics multiples pendant le traitement
    if (isProcessingLike) return;

    setIsProcessingLike(true);

    try {
      if (isLiked) {
        // Retirer le like
        console.log("Suppression du like pour le post", post.id);

        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);

        if (error) {
          console.error("Erreur lors de la suppression du like:", {
            message: error.message,
            details: error.details,
            code: error.code,
          });
          toast.error(
            `Erreur: ${error.message || "Impossible de retirer le like"}`
          );
          return;
        }

        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        toast.success("Like retiré");
      } else {
        // Ajouter le like
        console.log(
          "Ajout du like pour le post",
          post.id,
          "par l'utilisateur",
          user.id
        );

        const { error } = await supabase.from("likes").insert({
          post_id: post.id,
          user_id: user.id,
        });

        if (error) {
          console.error("Erreur lors de l'ajout du like:", {
            message: error.message,
            details: error.details,
            code: error.code,
          });

          // Afficher un message plus convivial selon le type d'erreur
          if (error.code === "23505") {
            // Si le like existe déjà, essayons de le supprimer au lieu d'afficher une erreur
            console.log("Like déjà existant, tentative de suppression...");
            const { error: deleteError } = await supabase
              .from("likes")
              .delete()
              .eq("post_id", post.id)
              .eq("user_id", user.id);

            if (deleteError) {
              console.error(
                "Erreur lors de la suppression du like:",
                deleteError
              );
              toast.error("Impossible de modifier le statut du like");
              return;
            }

            // Si la suppression réussit, mettre à jour l'interface
            setIsLiked(false);
            setLikeCount((prev) => prev - 1);
            toast.success("Like retiré");
            return;
          } else if (error.code === "23503") {
            toast.error(
              "Référence invalide, le post ou l'utilisateur n'existe pas"
            );
          } else {
            toast.error(
              `Erreur: ${error.message || "Impossible d'ajouter le like"}`
            );
          }
          return;
        }

        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        toast.success("Post aimé");
      }
    } catch (error) {
      console.error("Erreur lors du like:", error);
      toast.error("Une erreur est survenue, veuillez réessayer");
    } finally {
      setIsProcessingLike(false);
    }
  };

  /**
   * Soumet une réponse en utilisant la table comments
   */
  const submitReply = async () => {
    if (!user || !replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      // Étape 1: Insérer le commentaire sans récupérer les données immédiatement
      const { error: insertError } = await supabase
        .from("comments" as any) // Utilisation d'un cast temporaire pour éviter l'erreur de type
        .insert({
          content: replyContent.trim(),
          user_id: user.id,
          post_id: post.id, // Utiliser post_id au lieu de parent_id
        });

      if (insertError) {
        console.error(
          "Erreur lors de l'insertion du commentaire:",
          insertError
        );
        toast.error(
          `Erreur: ${
            insertError.message || "Impossible de publier le commentaire"
          }`
        );
        return;
      }

      // Étape 2: Récupérer le profil utilisateur pour créer le commentaire dans l'interface
      let userProfile: ProfileLike = {
        id: user.id,
        username: "Utilisateur",
      };

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, avatar_url, full_name")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          userProfile = {
            id: data.id,
            username: data.username || "Utilisateur",
            avatar_url: data.avatar_url,
            full_name: data.full_name,
          };
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du profil:", err);
        // Continuer avec des données minimales, ne pas empêcher l'ajout du commentaire
      }

      // Créer un nouveau commentaire formaté comme un Post pour l'affichage
      const newReply: Post = {
        id: crypto.randomUUID(), // Générer un ID temporaire pour l'affichage
        content: replyContent.trim(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_hidden: false,
        like_count: 0,
        comment_count: 0,
        profiles: userProfile,
        user_liked: false,
      };

      // Mettre à jour l'interface utilisateur avec le nouveau commentaire
      setReplies((prev) => [...prev, newReply]);
      setReplyContent("");
      setShowReplyForm(false);

      // S'assurer que les réponses sont visibles après avoir ajouté un commentaire
      setRepliesVisible(true);

      // Mettre à jour le compteur de commentaires dans le post parent (une seule fois)
      setCommentCount((prev) => (prev || 0) + 1);

      // Rafraîchir la liste complète des commentaires pour s'assurer que tout est synchronisé
      console.log("Commentaire ajouté, actualisation dans 1 seconde...");

      // Attendre un peu plus longtemps pour s'assurer que le commentaire est enregistré côté serveur
      setTimeout(() => {
        console.log(
          "Rechargement des commentaires et mise à jour du compteur..."
        );
        fetchCommentCount(); // Récupérer le nombre exact de commentaires depuis la base de données
        fetchReplies(); // Recharger les commentaires pour avoir les données les plus récentes

        if (onUpdate) {
          onUpdate(); // Mettre à jour le post parent si nécessaire
        }
      }, 1000); // Délai plus long pour s'assurer que le commentaire est bien enregistré

      toast.success("Réponse publiée!");
    } catch (err) {
      console.error("Erreur lors de la publication:", err);
      toast.error(
        "Une erreur est survenue lors de la publication du commentaire"
      );
    } finally {
      setIsSubmittingReply(false);
    }
  };

  /**
   * Modifie le post
   */
  const submitEdit = async () => {
    if (!editContent.trim()) return;

    setIsSubmittingEdit(true);
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          content: editContent.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (error) throw error;

      setIsEditing(false);
      if (onUpdate) onUpdate();
      toast.success("Post modifié!");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  /**
   * Supprime le post
   */
  const deletePost = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;

    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) throw error;

      if (onUpdate) onUpdate();
      toast.success("Post supprimé!");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  /**
   * Partage le post
   */
  const sharePost = async () => {
    const url = `${window.location.origin}/communaute/post/${post.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Post de la communauté",
          text: post.content.substring(0, 100) + "...",
          url: url,
        });
      } catch {
        // L'utilisateur a annulé le partage
      }
    } else {
      // Fallback: copier dans le presse-papiers
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Lien copié dans le presse-papiers!");
      } catch {
        toast.error("Impossible de copier le lien");
      }
    }
  };

  // Chargement initial des commentaires au montage du composant
  useEffect(() => {
    console.log("Chargement initial des commentaires pour le post:", post.id);
    fetchReplies(); // Charger les commentaires une seule fois
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]); // Se déclenche une seule fois par post

  const marginLeft = level * 24;

  return (
    <div
      className="space-y-3"
      style={{ marginLeft: level > 0 ? `${marginLeft}px` : 0 }}
    >
      <Card className={`${level > 0 ? "border-l-2 border-l-teal-200" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {post.profiles && post.profiles.avatar_url ? (
                  <Image
                    src={post.profiles.avatar_url}
                    alt={post.profiles.username || "Utilisateur"}
                    className="h-full w-full object-cover"
                    fill
                    sizes="40px"
                  />
                ) : (
                  <div className="h-full w-full bg-teal-100 flex items-center justify-center text-teal-600 font-medium">
                    {post.profiles
                      ? (
                          post.profiles.full_name ||
                          post.profiles.username ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()
                      : "U"}
                  </div>
                )}
              </Avatar>

              <div>
                <div className="font-medium">
                  {(post.profiles &&
                    (post.profiles.full_name || post.profiles.username)) ||
                    "Utilisateur"}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                  {post.updated_at !== post.created_at && (
                    <span className="ml-1">(modifié)</span>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthor && (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={deletePost}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </>
                )}
                <ReportButton
                  contentType="post"
                  contentId={post.id}
                  reportedUserId={post.user_id}
                  variant="ghost"
                  size="sm"
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button
                  onClick={submitEdit}
                  disabled={isSubmittingEdit || !editContent.trim()}
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {isSubmittingEdit ? "Modification..." : "Modifier"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(post.content);
                  }}
                  size="sm"
                >
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="whitespace-pre-wrap">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={isProcessingLike}
                  className={`flex items-center gap-2 ${
                    isLiked ? "text-red-500" : "text-gray-500"
                  } ${isProcessingLike ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""} ${
                      isProcessingLike ? "animate-pulse" : ""
                    }`}
                  />
                  {likeCount > 0 && <span>{likeCount}</span>}
                </Button>

                {canReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="flex items-center gap-2 text-gray-500"
                  >
                    <Reply className="h-4 w-4" />
                    Répondre
                  </Button>
                )}

                {/* Indicateur du nombre de commentaires */}
                <div className="flex items-center gap-1 px-2">
                  <Reply className="h-4 w-4 text-gray-500" />
                  <span
                    className={`inline-flex items-center justify-center text-sm ${
                      commentCount > 0
                        ? "bg-teal-100 text-teal-700 font-medium px-2 py-0.5 rounded-full"
                        : "text-gray-500"
                    }`}
                  >
                    {commentCount}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={sharePost}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!repliesVisible) {
                      // Si on ouvre les réponses, forcer le chargement des commentaires
                      console.log(
                        "Chargement forcé des commentaires pour le post:",
                        post.id
                      );
                      fetchReplies();
                    }
                    setRepliesVisible(!repliesVisible);
                  }}
                  className={`flex items-center gap-2 ml-auto ${
                    commentCount > 0
                      ? "text-teal-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {repliesVisible ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {commentCount > 0
                    ? `${commentCount} réponse${commentCount > 1 ? "s" : ""}`
                    : "Voir les réponses"}
                </Button>
              </div>

              {/* Formulaire de réponse */}
              {showReplyForm && (
                <div className="space-y-3 pt-3 border-t">
                  <Textarea
                    placeholder="Écrivez votre réponse..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={submitReply}
                      disabled={isSubmittingReply || !replyContent.trim()}
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      {isSubmittingReply ? "Publication..." : "Répondre"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyContent("");
                      }}
                      size="sm"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>

        {/* Réponses intégrées dans la Card */}
        {repliesVisible && (
          <div className="mt-6 px-4 pb-4">
            {loadingReplies ? (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
                  <span className="text-sm text-gray-500">
                    Chargement des commentaires...
                  </span>
                </div>
              </div>
            ) : replies.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <Reply className="h-4 w-4 text-teal-600" />
                    Commentaires
                  </h4>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                    {replies.length} commentaire{replies.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-4">
                  {replies.map((reply, index) => (
                    <div
                      key={reply.id}
                      className="group relative bg-gray-50/50 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {/* Ligne décorative */}
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-teal-400 to-teal-600 rounded-l-lg opacity-60"></div>

                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                          {reply.profiles && reply.profiles.avatar_url ? (
                            <Image
                              src={reply.profiles.avatar_url}
                              alt={reply.profiles.username || "Utilisateur"}
                              className="h-full w-full object-cover"
                              fill
                              sizes="32px"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-xs">
                              {reply.profiles
                                ? (
                                    reply.profiles.full_name ||
                                    reply.profiles.username ||
                                    "U"
                                  )
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}
                            </div>
                          )}
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-semibold text-sm text-gray-900 truncate">
                              {(reply.profiles &&
                                (reply.profiles.full_name ||
                                  reply.profiles.username)) ||
                                "Utilisateur"}
                            </h5>
                            <time className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                              {formatDistanceToNow(new Date(reply.created_at), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </time>
                          </div>

                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                          </p>
                        </div>
                      </div>

                      {/* Numéro du commentaire */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded-full shadow-sm">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : commentCount > 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                  <Reply className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  Chargement des commentaires...
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-50 to-teal-100 rounded-full mb-4">
                  <Reply className="h-6 w-6 text-teal-500" />
                </div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Aucun commentaire pour le moment
                </h5>
                <p className="text-sm text-gray-500 mb-4">
                  {commentCount > 0
                    ? `Les ${commentCount} commentaires ne se sont pas chargés correctement`
                    : "Soyez le premier à partager votre avis"}
                </p>
                {commentCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchReplies()}
                    className="text-xs hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-colors"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Recharger les commentaires
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
