/**
 * Hook TanStack Query pour la gestion des messages et conversations
 * Fournit des fonctionnalités de chat temps réel avec optimistic updates,
 * gestion des conversations et notifications
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { getCacheConfig } from './cacheConfig';
import { Database } from '@/app/types/supabase';

// ============================================================================
// TYPES ET INTERFACES (Basés sur le code existant)
// ============================================================================

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface Conversation {
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
}

export interface ConversationWithDetails extends Conversation {
  messages?: Message[];
  participants?: ProfileRow[];
}

export interface CreateMessageData {
  conversation_id: string;
  content: string;
}

export interface CreateConversationData {
  other_user_id: string;
  initial_message?: string;
}

export interface MessageFilters {
  conversation_id?: string;
  sender_id?: string;
  unread_only?: boolean;
  limit?: number;
}

export interface ConversationFilters {
  user_id?: string;
  unread_only?: boolean;
}

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const messageKeys = {
  all: ['messages'] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...messageKeys.conversations(), id] as const,
  conversationMessages: (id: string) => [...messageKeys.conversation(id), 'messages'] as const,
  userConversations: (userId: string) => [...messageKeys.conversations(), 'user', userId] as const,
  unreadCount: (userId: string) => [...messageKeys.all, 'unread', userId] as const,
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Récupère les conversations d'un utilisateur
 */
export const fetchUserConversationsAPI = async (userId: string): Promise<Conversation[]> => {
  try {
    const { data: conversationsData, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:profiles!conversations_user1_id_fkey(id, username, avatar_url),
        user2:profiles!conversations_user2_id_fkey(id, username, avatar_url),
        messages!messages_conversation_id_fkey(id, content, created_at, sender_id, read)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération des conversations: ${error.message}`);
    }

    if (!conversationsData) {
      return [];
    }

    // Formater les données pour l'affichage
    const formattedConversations = conversationsData.map((conv: any) => {
      const otherUser = conv.user1_id === userId ? conv.user2 : conv.user1;
      const messages = conv.messages || [];
      const lastMessage = messages.length > 0 
        ? messages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null;
      
      // Compter les messages non lus
      const unreadCount = messages.filter(
        (msg: any) => !msg.read && msg.sender_id !== userId
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

    return formattedConversations;
  } catch (error) {
    console.error('Erreur dans fetchUserConversationsAPI:', error);
    throw error;
  }
};

/**
 * Récupère une conversation spécifique avec ses messages
 */
export const fetchConversationAPI = async (conversationId: string, userId: string): Promise<ConversationWithDetails> => {
  try {
    const { data: conversationData, error: conversationError } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:profiles!conversations_user1_id_fkey(id, username, avatar_url),
        user2:profiles!conversations_user2_id_fkey(id, username, avatar_url)
      `)
      .eq('id', conversationId)
      .single();

    if (conversationError) {
      throw new Error(`Conversation non trouvée: ${conversationError.message}`);
    }

    // Récupérer les messages de la conversation
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      throw new Error(`Erreur lors de la récupération des messages: ${messagesError.message}`);
    }

    // Formater les messages
    const formattedMessages: Message[] = (messagesData || []).map((msg: any) => ({
      id: msg.id,
      conversation_id: msg.conversation_id,
      sender_id: msg.sender_id,
      content: msg.content,
      created_at: msg.created_at,
      read: msg.read,
      sender: {
        id: msg.sender.id,
        username: msg.sender.username,
        avatar_url: msg.sender.avatar_url,
      },
    }));

    // Déterminer l'autre utilisateur
    const otherUser = conversationData.user1_id === userId ? conversationData.user2 : conversationData.user1;
    const lastMessage = formattedMessages.length > 0 
      ? formattedMessages[formattedMessages.length - 1] 
      : null;

    const unreadCount = formattedMessages.filter(
      msg => !msg.read && msg.sender_id !== userId
    ).length;

    return {
      id: conversationData.id,
      created_at: conversationData.created_at,
      updated_at: conversationData.updated_at,
      user1_id: conversationData.user1_id,
      user2_id: conversationData.user2_id,
      last_message_id: conversationData.last_message_id,
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
      messages: formattedMessages,
    };
  } catch (error) {
    console.error('Erreur dans fetchConversationAPI:', error);
    throw error;
  }
};

/**
 * Récupère les messages d'une conversation
 */
export const fetchConversationMessagesAPI = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data: messagesData, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Erreur lors de la récupération des messages: ${error.message}`);
    }

    return (messagesData || []).map((msg: any) => ({
      id: msg.id,
      conversation_id: msg.conversation_id,
      sender_id: msg.sender_id,
      content: msg.content,
      created_at: msg.created_at,
      read: msg.read,
      sender: {
        id: msg.sender.id,
        username: msg.sender.username,
        avatar_url: msg.sender.avatar_url,
      },
    }));
  } catch (error) {
    console.error('Erreur dans fetchConversationMessagesAPI:', error);
    throw error;
  }
};

/**
 * Compte les messages non lus pour un utilisateur
 */
export const fetchUnreadCountAPI = async (userId: string): Promise<number> => {
  try {
    // Récupérer toutes les conversations de l'utilisateur
    const { data: conversations, error: conversationError } = await supabase
      .from('conversations')
      .select('id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (conversationError) {
      throw new Error(`Erreur lors de la récupération des conversations: ${conversationError.message}`);
    }

    if (!conversations || conversations.length === 0) {
      return 0;
    }

    const conversationIds = conversations.map(c => c.id);

    // Compter les messages non lus dans toutes les conversations
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .in('conversation_id', conversationIds)
      .neq('sender_id', userId)
      .eq('read', false);

    if (error) {
      throw new Error(`Erreur lors du comptage des messages: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error('Erreur dans fetchUnreadCountAPI:', error);
    return 0;
  }
};

/**
 * Crée ou récupère une conversation entre deux utilisateurs
 */
export const getOrCreateConversationAPI = async (userId: string, otherUserId: string): Promise<string> => {
  try {
    // Vérifier s'il existe déjà une conversation entre ces deux utilisateurs
    const { data: existingConversation, error: searchError } = await supabase
      .from('conversations')
      .select('id')
      .or(
        `and(user1_id.eq.${userId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${userId})`
      )
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      throw searchError;
    }

    if (existingConversation) {
      return existingConversation.id;
    }

    // Créer une nouvelle conversation
    const { data: newConversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        user1_id: userId,
        user2_id: otherUserId,
      })
      .select('id')
      .single();

    if (conversationError || !newConversation) {
      throw new Error('Erreur lors de la création de la conversation');
    }

    return newConversation.id;
  } catch (error) {
    console.error('Erreur dans getOrCreateConversationAPI:', error);
    throw error;
  }
};

/**
 * Envoie un nouveau message
 */
export const sendMessageAPI = async (messageData: CreateMessageData, senderId: string): Promise<Message> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: messageData.conversation_id,
        sender_id: senderId,
        content: messageData.content,
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(id, username, avatar_url)
      `)
      .single();

    if (error) {
      throw new Error(`Erreur lors de l'envoi du message: ${error.message}`);
    }

    // Mettre à jour la date de dernière activité de la conversation
    await supabase
      .from('conversations')
      .update({
        updated_at: new Date().toISOString(),
        last_message_id: data.id,
      })
      .eq('id', messageData.conversation_id);

    return {
      id: data.id,
      conversation_id: data.conversation_id,
      sender_id: data.sender_id,
      content: data.content,
      created_at: data.created_at,
      read: false,
      sender: {
        id: (data as any).sender.id,
        username: (data as any).sender.username,
        avatar_url: (data as any).sender.avatar_url,
      },
    };
  } catch (error) {
    console.error('Erreur dans sendMessageAPI:', error);
    throw error;
  }
};

/**
 * Marque les messages comme lus
 */
export const markMessagesAsReadAPI = async (conversationId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('read', false);

    if (error) {
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  } catch (error) {
    console.error('Erreur dans markMessagesAsReadAPI:', error);
    throw error;
  }
};

// ============================================================================
// HOOKS TANSTACK QUERY
// ============================================================================

/**
 * Hook pour récupérer les conversations d'un utilisateur
 */
export const useUserConversationsQuery = (userId?: string) => {
  const cacheConfig = getCacheConfig('user_conversations');
  
  return useQuery({
    queryKey: messageKeys.userConversations(userId || ''),
    queryFn: () => fetchUserConversationsAPI(userId!),
    ...cacheConfig,
    enabled: !!userId,
    refetchInterval: 30 * 1000, // Mise à jour toutes les 30 secondes
  });
};

/**
 * Hook pour récupérer une conversation spécifique avec ses messages
 */
export const useConversationQuery = (conversationId: string, userId?: string) => {
  const cacheConfig = getCacheConfig('conversation_details');
  
  return useQuery({
    queryKey: messageKeys.conversation(conversationId),
    queryFn: () => fetchConversationAPI(conversationId, userId!),
    ...cacheConfig,
    enabled: !!(conversationId && userId),
    refetchInterval: 10 * 1000, // Mise à jour toutes les 10 secondes pour les messages
  });
};

/**
 * Hook pour récupérer les messages d'une conversation
 */
export const useConversationMessagesQuery = (conversationId: string) => {
  const cacheConfig = getCacheConfig('conversation_messages');
  
  return useQuery({
    queryKey: messageKeys.conversationMessages(conversationId),
    queryFn: () => fetchConversationMessagesAPI(conversationId),
    ...cacheConfig,
    enabled: !!conversationId,
    refetchInterval: 5 * 1000, // Mise à jour toutes les 5 secondes
  });
};

/**
 * Hook pour récupérer le nombre de messages non lus
 */
export const useUnreadCountQuery = (userId?: string) => {
  const cacheConfig = getCacheConfig('notification_data');
  
  return useQuery({
    queryKey: messageKeys.unreadCount(userId || ''),
    queryFn: () => fetchUnreadCountAPI(userId!),
    ...cacheConfig,
    enabled: !!userId,
    refetchInterval: 15 * 1000, // Mise à jour toutes les 15 secondes
  });
};

/**
 * Hook de mutation pour envoyer un message
 */
export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (messageData: CreateMessageData) => {
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié');
      }
      return sendMessageAPI(messageData, user.id);
    },
    onMutate: async (newMessageData) => {
      if (!user) return;

      const { conversation_id } = newMessageData;

      // Annuler les requêtes en cours
      await Promise.all([
        queryClient.cancelQueries({ queryKey: messageKeys.conversationMessages(conversation_id) }),
        queryClient.cancelQueries({ queryKey: messageKeys.conversation(conversation_id) }),
        queryClient.cancelQueries({ queryKey: messageKeys.userConversations(user.id) }),
      ]);

      // Créer un message optimiste
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: newMessageData.conversation_id,
        sender_id: user.id,
        content: newMessageData.content,
        created_at: new Date().toISOString(),
        read: false,
        sender: {
          id: user.id,
          username: user.email?.split('@')[0] || 'Vous',
          avatar_url: undefined,
        },
      };

      // Sauvegarder l'état précédent
      const previousMessages = queryClient.getQueryData(
        messageKeys.conversationMessages(conversation_id)
      );
      const previousConversation = queryClient.getQueryData(
        messageKeys.conversation(conversation_id)
      );
      const previousConversations = queryClient.getQueryData(
        messageKeys.userConversations(user.id)
      );

      // Mise à jour optimiste des messages
      queryClient.setQueryData<Message[]>(
        messageKeys.conversationMessages(conversation_id),
        (oldData) => oldData ? [...oldData, optimisticMessage] : [optimisticMessage]
      );

      // Mise à jour optimiste de la conversation
      queryClient.setQueryData<ConversationWithDetails>(
        messageKeys.conversation(conversation_id),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            messages: [...(oldData.messages || []), optimisticMessage],
            last_message: {
              content: optimisticMessage.content,
              created_at: optimisticMessage.created_at,
            },
          };
        }
      );

      // Mise à jour optimiste de la liste des conversations
      queryClient.setQueryData<Conversation[]>(
        messageKeys.userConversations(user.id),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(conv => {
            if (conv.id === conversation_id) {
              return {
                ...conv,
                last_message: {
                  content: optimisticMessage.content,
                  created_at: optimisticMessage.created_at,
                },
                updated_at: optimisticMessage.created_at,
              };
            }
            return conv;
          });
        }
      );

      return {
        previousMessages,
        previousConversation,
        previousConversations,
        optimisticMessage,
        conversation_id,
      };
    },
    onSuccess: (newMessage, variables, context) => {
      const { conversation_id } = variables;

      // Remplacer le message optimiste par le vrai message
      queryClient.setQueryData<Message[]>(
        messageKeys.conversationMessages(conversation_id),
        (oldData) => 
          oldData 
            ? oldData.map(message => 
                message.id === context?.optimisticMessage.id ? newMessage : message
              )
            : [newMessage]
      );

      // Invalider et refetch les données
      queryClient.invalidateQueries({ queryKey: messageKeys.conversationMessages(conversation_id) });
      queryClient.invalidateQueries({ queryKey: messageKeys.conversation(conversation_id) });
      
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: messageKeys.userConversations(user.id) });
      }
    },
    onError: (error, variables, context) => {
      const { conversation_id } = variables;

      // Rollback en cas d'erreur
      if (context && user?.id) {
        if (context.previousMessages !== undefined) {
          queryClient.setQueryData(
            messageKeys.conversationMessages(conversation_id),
            context.previousMessages
          );
        }
        if (context.previousConversation !== undefined) {
          queryClient.setQueryData(
            messageKeys.conversation(conversation_id),
            context.previousConversation
          );
        }
        if (context.previousConversations !== undefined) {
          queryClient.setQueryData(
            messageKeys.userConversations(user.id),
            context.previousConversations
          );
        }
      }

      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error(`Erreur lors de l'envoi: ${error.message}`);
    },
    onSettled: (newMessage, error, variables) => {
      const { conversation_id } = variables;
      
      // S'assurer que les données sont à jour
      queryClient.invalidateQueries({ queryKey: messageKeys.conversationMessages(conversation_id) });
    },
  });
};

/**
 * Hook de mutation pour marquer les messages comme lus
 */
export const useMarkMessagesAsReadMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ conversationId }: { conversationId: string }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié');
      }
      return markMessagesAsReadAPI(conversationId, user.id);
    },
    onSuccess: (_, { conversationId }) => {
      // Invalider les requêtes liées aux messages non lus
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount(user.id) });
        queryClient.invalidateQueries({ queryKey: messageKeys.userConversations(user.id) });
        queryClient.invalidateQueries({ queryKey: messageKeys.conversationMessages(conversationId) });
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour des messages:', error);
    },
  });
};

/**
 * Hook de mutation pour créer ou récupérer une conversation
 */
export const useGetOrCreateConversationMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ({ otherUserId }: { otherUserId: string }) => {
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié');
      }
      return getOrCreateConversationAPI(user.id, otherUserId);
    },
    onSuccess: () => {
      // Rafraîchir la liste des conversations
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: messageKeys.userConversations(user.id) });
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la création/récupération de la conversation:', error);
      toast.error(`Erreur lors de l'ouverture de la conversation: ${error.message}`);
    },
  });
};

/**
 * Hook personnalisé pour simplifier l'utilisation des messages
 */
export const useConversationChat = (conversationId: string) => {
  const { user } = useAuth();
  const messagesQuery = useConversationMessagesQuery(conversationId);
  const sendMutation = useSendMessageMutation();
  const markAsReadMutation = useMarkMessagesAsReadMutation();

  // Fonction helper pour envoyer un message
  const sendMessage = (content: string) => {
    if (!content.trim()) {
      toast.error('Le message ne peut pas être vide');
      return;
    }

    sendMutation.mutate({
      conversation_id: conversationId,
      content: content.trim(),
    });
  };

  // Fonction helper pour marquer comme lu
  const markAsRead = () => {
    markAsReadMutation.mutate({ conversationId });
  };

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    sendMessage,
    isSending: sendMutation.isPending,
    markAsRead,
    isMarkingAsRead: markAsReadMutation.isPending,
    error: messagesQuery.error || sendMutation.error || markAsReadMutation.error,
    refetch: messagesQuery.refetch,
  };
};