"use client";

import { formatDate } from "@/lib/utils";
import { Avatar } from "@/components/ui/AvatarComponent";

interface ChatMessageProps {
  message: {
    content: string;
    created_at: string;
    sender: {
      id: string;
      username: string;
      avatar_url?: string;
    };
  };
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
        <Avatar
          className="h-8 w-8"
        >
          {message.sender.username[0]}
        </Avatar>
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          <div className={`rounded-lg px-4 py-2 ${
            isOwn ? 'bg-primary text-white' : 'bg-muted'
          }`}>
            <p className="text-sm">{message.content}</p>
          </div>
          <span className="text-xs text-muted-foreground mt-1">
            {formatDate(message.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}