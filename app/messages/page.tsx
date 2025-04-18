"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import Link from "next/link";

type Conversation = {
  id: string;
  created_at: string;
  updated_at: string | null;
  user1_id: string;
  user2_id: string;
  last_message_id: string | null;
  other_user: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  last_message: {
    content: string;
    created_at: string;
  } | null;
  unread_count: number;
};

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchConversations();
      subscribeToConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Récupérer les conversations où l'utilisateur est impliqué
      const { data: conversationsData, error } = await supabase
        .from("conversations")
        .select(`
          *,
          user1:profiles!conversations_user1_id_fkey(id, username, avatar_url),
          user2:profiles!conversations_user2_id_fkey(id, username, avatar_url),
          messages!messages_conversation_id_fkey(id, content, created_at, sender_id, read)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Formater les données pour l'affichage
      const formattedConversations = conversationsData.map((conv) => {
        const otherUser = conv.user1_id === user.id ? conv.user2 : conv.user1;
        const messages = conv.messages || [];
        const lastMessage = messages.length > 0 
          ? messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
          : null;
        
        // Compter les messages non lus
        const unreadCount = messages.filter(
          (msg) => !msg.read && msg.sender_id !== user.id
        ).length;

        return {
          id: conv.id,
          created_at: conv.created_at,
          updated_at: conv.updated_at,
          user1_id: conv.user1_id,
          user2_id: conv.user2_id,
          last_message_id: conv.last_message_id,
          other_user: {
            id: otherUser.id,
            username: otherUser.username,
            avatar_url: otherUser.avatar_url,
          },
          last_message: lastMessage ? {
            content: lastMessage.content,
            created_at: lastMessage.created_at,
          } : null,
          unread_count: unreadCount,
        };
      });

      setConversations(formattedConversations);
    } catch (error) {
      console.error("Erreur lors du chargement des conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToConversations = () => {
    if (!user) return;

    const channel = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `user1_id=eq.${user.id}`,
        },
        () => fetchConversations()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `user2_id=eq.${user.id}`,
        },
        () => fetchConversations()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return "Hier";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <ProtectedLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Aucune conversation</h2>
            <p className="text-gray-500 mb-4">
              Vous n'avez pas encore de conversations. Commencez à discuter avec d'autres utilisateurs!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <Link 
                    href={`/messages/${conversation.id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-6 py-5 flex items-center">
                      <div className="flex-shrink-0">
                        {conversation.other_user.avatar_url ? (
                          <img
                            src={conversation.other_user.avatar_url}
                            alt={conversation.other_user.username}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-800 font-medium text-lg">
                              {conversation.other_user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {conversation.other_user.username}
                          </p>
                          {conversation.last_message && (
                            <p className="text-xs text-gray-500">
                              {formatDate(conversation.last_message.created_at)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {conversation.last_message
                              ? conversation.last_message.content
                              : "Aucun message"}
                          </p>
                          {conversation.unread_count > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                              {conversation.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}