/**
 * Gère le like/unlike d'un post
 */
const handleLike = async () => {
  if (!user) {
    toast.error("Vous devez être connecté pour aimer un post");
    return;
  }

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
          toast.error("Vous avez déjà aimé ce post");
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
  }
};
