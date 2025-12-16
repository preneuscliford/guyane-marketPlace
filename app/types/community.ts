import type { Database } from "@/types/supabase";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface Post extends PostRow {
  profiles?: ProfileRow;
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
