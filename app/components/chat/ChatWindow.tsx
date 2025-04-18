"use client";

import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { supabase } from "@/lib/supabase";

interface ChatWindowProps {
  messages: Array<{
    id: string;
    content: string;
    created_at: string;
    sender: {
      id: string;
      username: string;
      avatar_url?: string;
    };
  }>;
  currentUserId: string;
  conversationId: string;
  onSendMessage: (message: string) => void;
  onNewMessage?: (message: any) => void;
  isLoading?: boolean;
}

export function ChatWindow({ 
  messages, 
  currentUserId, 
  conversationId,
  recipientId,
  onSendMessage, 
  onNewMessage,
  isLoading 
}: ChatWindowProps) {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.new.sender_id !== currentUserId && onNewMessage) {
            onNewMessage(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, currentUserId, onNewMessage]);

  useEffect(() => {
    // Mark messages as read when they become visible
    const markMessagesAsRead = async () => {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('sender_id', recipientId)
        .eq('read', false);
    };

    if (messages.length > 0) {
      markMessagesAsRead();
    }
  }, [messages, conversationId, recipientId]);

  useEffect(() => {
    const channel = supabase.channel(`typing:${conversationId}`);

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== currentUserId) {
          setIsTyping(true);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, currentUserId]);

  const handleTyping = () => {
    supabase.channel(`typing:${conversationId}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: currentUserId },
    });
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Commencez la conversation...
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.sender.id === currentUserId}
              />
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="flex space-x-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
                <span>En train d'écrire</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput 
        onSend={onSendMessage} 
        onTyping={handleTyping}
        disabled={isLoading} 
      />
    </div>
  );
}