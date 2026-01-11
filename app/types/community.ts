import type { Database } from "@/types/supabase";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

// Type étendu pour les profils avec le statut admin
export interface ProfileWithAdmin extends ProfileRow {
  is_admin?: boolean;
}

export interface Post extends PostRow {
  profiles?: ProfileWithAdmin;
  like_count: number;
  comment_count: number;
  user_liked: boolean;
  likes?: { user_id: string }[];
  comments?: Database["public"]["Tables"]["comments"]["Row"][];
}

export interface CommunityPostProps {
  post: Post;
  level?: number;
  maxLevel?: number;
  onUpdate?: () => void;
}
