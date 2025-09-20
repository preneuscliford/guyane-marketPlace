"use client";

import { useState } from "react";
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
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

// Import des nouveaux hooks TanStack Query
import { usePostLike, useToggleLikeMutation } from "@/hooks/useLikes.query";
import {
  usePostCommentsQuery,
  useCreateCommentMutation,
} from "@/hooks/useComments.query";
import {
  useUpdatePostMutation,
  useDeletePostMutation,
} from "@/hooks/usePosts.query";

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  full_name?: string;
  bio?: string;
}

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
 * Composant CommunityPost refactorisé avec TanStack Query
 * Utilise les nouveaux hooks pour les likes, commentaires et édition de posts
 */
export default function CommunityPost({
  post,
  level = 0,
  maxLevel = 3,
  onUpdate,
}: CommunityPostProps) {
  const { user } = useAuth();

  // États locaux
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  // Variables calculées
  const isAuthor = user?.id === post.user_id;
  const canReply = level < maxLevel;

  // ============================================================================
  // HOOKS TANSTACK QUERY
  // ============================================================================

  // Hook pour les likes avec optimistic updates
  const { data: likeData } = usePostLike(post.id, user?.id);

  const toggleLikeMutation = useToggleLikeMutation();

  // Hook pour les commentaires avec cache intelligent
  const {
    data: comments = [],
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = usePostCommentsQuery(post.id, {
    enabled: repliesVisible || level < maxLevel,
  });

  // Mutations pour les commentaires
  const createCommentMutation = useCreateCommentMutation();

  // Mutations pour les posts
  const updatePostMutation = useUpdatePostMutation();
  const deletePostMutation = useDeletePostMutation();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Gère le toggle du like avec optimistic update
   */
  const handleLike = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour liker un post");
      return;
    }

    try {
      await toggleLikeMutation.mutateAsync({
        postId: post.id,
        userId: user.id,
        currentlyLiked: likeData?.isLiked || false,
      });
    } catch (error) {
      console.error("Erreur lors du toggle like:", error);
    }
  };

  /**
   * Gère la soumission d'un nouveau commentaire
   */
  const handleSubmitReply = async () => {
    if (!user || !replyContent.trim()) {
      toast.error("Veuillez saisir un commentaire");
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        postId: post.id,
        content: replyContent.trim(),
        userId: user.id,
      });

      // Réinitialiser le formulaire
      setReplyContent("");
      setShowReplyForm(false);

      // S'assurer que les commentaires sont visibles après ajout
      setRepliesVisible(true);

      toast.success("Commentaire ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  /**
   * Gère l'édition du post
   */
  const handleEditPost = async () => {
    if (!isAuthor || !editContent.trim()) {
      toast.error("Contenu invalide");
      return;
    }

    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        content: editContent.trim(),
      });

      setIsEditing(false);
      toast.success("Post mis à jour avec succès");
      onUpdate?.();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du post:", error);
      toast.error("Erreur lors de la mise à jour du post");
    }
  };

  /**
   * Gère la suppression du post
   */
  const handleDeletePost = async () => {
    if (!isAuthor) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      try {
        await deletePostMutation.mutateAsync(post.id);
        toast.success("Post supprimé avec succès");
        onUpdate?.();
      } catch (error) {
        console.error("Erreur lors de la suppression du post:", error);
        toast.error("Erreur lors de la suppression du post");
      }
    }
  };

  /**
   * Gère le partage du post
   */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post de ${post.profiles.username}`,
          text: post.content.substring(0, 100),
          url: window.location.href,
        });
      } catch (error) {
        console.log("Erreur de partage:", error);
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API de partage
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  /**
   * Toggle de la visibilité des réponses
   */
  const toggleRepliesVisibility = () => {
    setRepliesVisible(!repliesVisible);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  // Calculs pour l'affichage
  const currentLikeCount = likeData?.likeCount ?? post.like_count;
  const isCurrentlyLiked = likeData?.isLiked ?? post.user_liked ?? false;
  const currentCommentCount = comments.length || post.comment_count;

  return (
    <Card
      className={`mb-4 ${
        level > 0 ? `ml-${level * 4} border-l-2 border-l-blue-200` : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.profiles.avatar_url}
              alt={post.profiles.username}
              fallback={post.profiles.username?.charAt(0)?.toUpperCase() || "U"}
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm">
                  {post.profiles.full_name || post.profiles.username}
                </h4>
                {post.profiles.username && post.profiles.full_name && (
                  <span className="text-xs text-muted-foreground">
                    @{post.profiles.username}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: fr,
                })}
                {post.updated_at !== post.created_at && " (modifié)"}
              </p>
            </div>
          </div>

          {/* Menu d'actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthor && (
                <>
                  <DropdownMenuItem
                    onClick={() => setIsEditing(true)}
                    disabled={updatePostMutation.isPending}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeletePost}
                    disabled={deletePostMutation.isPending}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </DropdownMenuItem>
              {!isAuthor && (
                <ReportButton
                  contentType="post"
                  contentId={post.id}
                  authorId={post.user_id}
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {/* Contenu du post */}
        {isEditing ? (
          <div className="space-y-3 mb-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Modifiez votre post..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleEditPost}
                disabled={updatePostMutation.isPending || !editContent.trim()}
                size="sm"
              >
                {updatePostMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Sauvegarder"
                )}
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
          <div className="mb-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {post.content}
            </p>
          </div>
        )}

        {/* Actions du post */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4">
            {/* Bouton Like avec optimistic update */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!user || toggleLikeMutation.isPending}
              className={`flex items-center gap-2 ${
                isCurrentlyLiked ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {toggleLikeMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart
                  className={`h-4 w-4 ${
                    isCurrentlyLiked ? "fill-current" : ""
                  }`}
                />
              )}
              <span className="text-xs">{currentLikeCount}</span>
            </Button>

            {/* Bouton Commentaires */}
            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Reply className="h-4 w-4" />
                <span className="text-xs">
                  {showReplyForm ? "Annuler" : "Répondre"}
                </span>
              </Button>
            )}

            {/* Toggle commentaires si il y en a */}
            {currentCommentCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRepliesVisibility}
                className="flex items-center gap-2 text-muted-foreground"
                disabled={isLoadingComments}
              >
                {isLoadingComments ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : repliesVisible ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="text-xs">
                  {currentCommentCount} commentaire
                  {currentCommentCount > 1 ? "s" : ""}
                </span>
              </Button>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Formulaire de réponse */}
        {showReplyForm && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Écrivez votre commentaire..."
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReply}
                disabled={
                  createCommentMutation.isPending || !replyContent.trim()
                }
                size="sm"
              >
                {createCommentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publication...
                  </>
                ) : (
                  "Publier"
                )}
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

        {/* Commentaires imbriqués */}
        {repliesVisible && (
          <div className="mt-4 space-y-3">
            {isLoadingComments ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Chargement des commentaires...
                </span>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="border-l-2 border-l-gray-100 pl-4"
                >
                  <CommunityPost
                    post={comment}
                    level={level + 1}
                    maxLevel={maxLevel}
                    onUpdate={refetchComments}
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-2">
                Aucun commentaire pour le moment
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
