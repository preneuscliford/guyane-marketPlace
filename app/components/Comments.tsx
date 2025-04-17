"use client";

import { useAuth } from "@/hooks/useAuth";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {user && <CommentForm postId={postId} />}
      <CommentList postId={postId} currentUser={user} />
    </div>
  );
}
