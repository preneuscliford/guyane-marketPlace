export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      advertisement_clicks: {
        Row: {
          advertisement_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_clicks_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_clicks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_impressions: {
        Row: {
          advertisement_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          advertisement_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_impressions_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_impressions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisement_stats: {
        Row: {
          advertisement_id: string | null
          clicks: number | null
          cost_per_click: number | null
          created_at: string | null
          date: string | null
          id: string
          impressions: number | null
        }
        Insert: {
          advertisement_id?: string | null
          clicks?: number | null
          cost_per_click?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          impressions?: number | null
        }
        Update: {
          advertisement_id?: string | null
          clicks?: number | null
          cost_per_click?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          impressions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_stats_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisements: {
        Row: {
          budget: number | null
          category: string | null
          clicks: number | null
          created_at: string | null
          daily_budget: number | null
          description: string
          end_date: string | null
          id: string
          image_url: string | null
          impressions: number | null
          location: string | null
          start_date: string | null
          status: string | null
          target_url: string | null
          title: string
          total_spent: number | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          budget?: number | null
          category?: string | null
          clicks?: number | null
          created_at?: string | null
          daily_budget?: number | null
          description: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          impressions?: number | null
          location?: string | null
          start_date?: string | null
          status?: string | null
          target_url?: string | null
          title: string
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          budget?: number | null
          category?: string | null
          clicks?: number | null
          created_at?: string | null
          daily_budget?: number | null
          description?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          impressions?: number | null
          location?: string | null
          start_date?: string | null
          status?: string | null
          target_url?: string | null
          title?: string
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          images: string[] | null
          location: string
          price: number | null
          read: boolean | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          images?: string[] | null
          location: string
          price?: number | null
          read?: boolean | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          images?: string[] | null
          location?: string
          price?: number | null
          read?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          product_id: string | null
          product_title: string | null
          receiver_id: string | null
          sender_email: string
          sender_name: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          product_id?: string | null
          product_title?: string | null
          receiver_id?: string | null
          sender_email: string
          sender_name: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          product_id?: string | null
          product_title?: string | null
          receiver_id?: string | null
          sender_email?: string
          sender_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          announcement_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          reference_id: string | null
          reference_type: string | null
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_likes: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_likes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          featured: boolean | null
          id: string
          images: string[] | null
          location: string
          price: number
          status: string | null
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
          views: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          featured?: boolean | null
          id?: string
          images?: string[] | null
          location: string
          price: number
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
          views?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          featured?: boolean | null
          id?: string
          images?: string[] | null
          location?: string
          price?: number
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
          views?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          location: string | null
          phone_number: string | null
          preferences: Json | null
          social_links: Json | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          location?: string | null
          phone_number?: string | null
          preferences?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone_number?: string | null
          preferences?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          announcement_id: string | null
          comment: string | null
          created_at: string
          id: string
          rating: number
          target_user_id: string
          user_id: string
        }
        Insert: {
          announcement_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          target_user_id: string
          user_id: string
        }
        Update: {
          announcement_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          target_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          availability: Json | null
          category: string
          contact_info: Json | null
          created_at: string
          description: string
          id: string
          images: string[] | null
          location: string
          price: number | null
          price_type: string | null
          rating: number | null
          reviews_count: number | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          availability?: Json | null
          category: string
          contact_info?: Json | null
          created_at?: string
          description: string
          id?: string
          images?: string[] | null
          location: string
          price?: number | null
          price_type?: string | null
          rating?: number | null
          reviews_count?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          availability?: Json | null
          category?: string
          contact_info?: Json | null
          created_at?: string
          description?: string
          id?: string
          images?: string[] | null
          location?: string
          price?: number | null
          price_type?: string | null
          rating?: number | null
          reviews_count?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database['public']

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']] extends { Tables: any; Views: any }
        ? Database[PublicTableNameOrOptions['schema']]['Tables'] & Database[PublicTableNameOrOptions['schema']]['Views']
        : never)
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']] extends { Tables: any; Views: any }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
        Row: infer R
      }
      ? R
      : never
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']] extends { Tables: any }
        ? Database[PublicTableNameOrOptions['schema']]['Tables']
        : never)
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']] extends { Tables: any }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Insert: infer I
      }
      ? I
      : never
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']] extends { Tables: any }
        ? Database[PublicTableNameOrOptions['schema']]['Tables']
        : never)
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']] extends { Tables: any }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Update: infer U
      }
      ? U
      : never
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions['schema']] extends { Enums: any }
        ? Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never)
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']] extends { Enums: any }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : never
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
