export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          }
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
          hidden_at: string | null
          hidden_by: string | null
          hidden_reason: string | null
          id: string
          images: string[] | null
          is_hidden: boolean | null
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
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          images?: string[] | null
          is_hidden?: boolean | null
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
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          images?: string[] | null
          is_hidden?: boolean | null
          location?: string
          price?: number | null
          read?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_hidden_by_fkey"
            columns: ["hidden_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          hidden_at: string | null
          hidden_by: string | null
          hidden_reason: string | null
          id: string
          is_hidden: boolean | null
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean | null
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean | null
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_hidden_by_fkey"
            columns: ["hidden_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
          }
        ]
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
          }
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
          }
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          hidden_at: string | null
          hidden_by: string | null
          hidden_reason: string | null
          id: string
          image_url: string | null
          is_hidden: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          image_url?: string | null
          is_hidden?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          image_url?: string | null
          is_hidden?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_hidden_by_fkey"
            columns: ["hidden_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
          description: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          role: string | null
          skills: string[] | null
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          description?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          role?: string | null
          skills?: string[] | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          description?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          role?: string | null
          skills?: string[] | null
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          moderator_id: string | null
          moderator_notes: string | null
          reason: string
          reported_content_id: string
          reported_content_type: string
          reported_user_id: string | null
          reporter_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          moderator_id?: string | null
          moderator_notes?: string | null
          reason: string
          reported_content_id: string
          reported_content_type: string
          reported_user_id?: string | null
          reporter_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          moderator_id?: string | null
          moderator_notes?: string | null
          reason?: string
          reported_content_id?: string
          reported_content_type?: string
          reported_user_id?: string | null
          reporter_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_moderator_id_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          announcement_id: string | null
          comment: string | null
          created_at: string
          id: string
          rating: number
          service_id: string | null
          target_user_id: string
          user_id: string
        }
        Insert: {
          announcement_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          service_id?: string | null
          target_user_id: string
          user_id: string
        }
        Update: {
          announcement_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          service_id?: string | null
          target_user_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      service_views: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          service_id: string
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          service_id: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          service_id?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_views_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          availability: Json | null
          category: string
          contact_info: Json | null
          created_at: string
          description: string
          hidden_at: string | null
          hidden_by: string | null
          hidden_reason: string | null
          id: string
          images: string[] | null
          is_hidden: boolean | null
          location: string
          price: number | null
          price_type: string | null
          rating: number | null
          reviews_count: number | null
          status: string | null
          tags: string[] | null
          title: string
          total_views: number | null
          unique_views: number | null
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
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          images?: string[] | null
          is_hidden?: boolean | null
          location: string
          price?: number | null
          price_type?: string | null
          rating?: number | null
          reviews_count?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          total_views?: number | null
          unique_views?: number | null
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
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          images?: string[] | null
          is_hidden?: boolean | null
          location?: string
          price?: number | null
          price_type?: string | null
          rating?: number | null
          reviews_count?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          total_views?: number | null
          unique_views?: number | null
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_hidden_by_fkey"
            columns: ["hidden_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      reports_with_users: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          moderator_full_name: string | null
          moderator_id: string | null
          moderator_notes: string | null
          moderator_username: string | null
          reason: string | null
          reported_content_id: string | null
          reported_content_type: string | null
          reported_user_id: string | null
          reporter_full_name: string | null
          reporter_id: string | null
          reporter_username: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      users_with_moderation_info: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          description: string | null
          full_name: string | null
          id: string | null
          location: string | null
          phone: string | null
          role: string | null
          skills: string[] | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Relationships: []
      }
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

type PublicSchema = Database[keyof Database]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
