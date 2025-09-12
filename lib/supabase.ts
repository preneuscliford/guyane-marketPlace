import { createClient } from '@supabase/supabase-js'

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
          {
            foreignKeyName: "advertisement_clicks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_with_moderation_info"
            referencedColumns: ["id"]
          },
        ]
      }
      banned_users: {
        Row: {
          banned_at: string | null
          banned_until: string | null
          created_at: string | null
          id: string
          is_permanent: boolean | null
          moderator_id: string | null
          reason: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          banned_at?: string | null
          banned_until?: string | null
          created_at?: string | null
          id?: string
          is_permanent?: boolean | null
          moderator_id?: string | null
          reason: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          banned_at?: string | null
          banned_until?: string | null
          created_at?: string | null
          id?: string
          is_permanent?: boolean | null
          moderator_id?: string | null
          reason?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banned_users_banned_by_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banned_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_moderation_actions: {
        Row: {
          id: string
          user_id: string
          moderator_id: string
          action_type: string
          reason: string
          details: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          moderator_id: string
          action_type: string
          reason: string
          details?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          moderator_id?: string
          action_type?: string
          reason?: string
          details?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_moderation_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_moderation_actions_moderator_id_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_warnings: {
        Row: {
          id: string
          user_id: string
          moderator_id: string
          warning_type: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          moderator_id: string
          warning_type?: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          moderator_id?: string
          warning_type?: string
          message?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_warnings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_warnings_moderator_id_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          id: string
          reporter_id: string | null
          reported_content_type: string
          reported_content_id: string
          reported_user_id: string | null
          reason: string
          description: string | null
          status: string
          moderator_id: string | null
          moderator_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id?: string | null
          reported_content_type: string
          reported_content_id: string
          reported_user_id?: string | null
          reason: string
          description?: string | null
          status?: string
          moderator_id?: string | null
          moderator_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string | null
          reported_content_type?: string
          reported_content_id?: string
          reported_user_id?: string | null
          reason?: string
          description?: string | null
          status?: string
          moderator_id?: string | null
          moderator_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
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
            foreignKeyName: "reports_moderator_id_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          description: string | null
          created_at: string
          updated_at: string
          bio: string | null
          location: string | null
          skills: string[] | null
          phone: string | null
          website: string | null
          role: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
          bio?: string | null
          location?: string | null
          skills?: string[] | null
          phone?: string | null
          website?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
          bio?: string | null
          location?: string | null
          skills?: string[] | null
          phone?: string | null
          website?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      reports_with_users: {
        Row: {
          id: string | null
          reporter_id: string | null
          reported_content_type: string | null
          reported_content_id: string | null
          reported_user_id: string | null
          reason: string | null
          description: string | null
          status: string | null
          moderator_id: string | null
          moderator_notes: string | null
          created_at: string | null
          updated_at: string | null
          reporter_username: string | null
          reported_user_username: string | null
          moderator_username: string | null
        }
        Relationships: []
      }
      users_with_moderation_info: {
        Row: {
          id: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          role: string | null
          created_at: string | null
          updated_at: string | null
          phone: string | null
          location: string | null
          is_banned: boolean | null
          ban_reason: string | null
          banned_until: string | null
          is_permanent_ban: boolean | null
          warning_count: number | null
          moderation_action_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_moderation_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_reports: number
          pending_reports: number
          resolved_reports: number
          banned_users: number
          hidden_content: number
          actions_today: number
        }[]
      }
      ban_user: {
        Args: {
          p_user_id: string
          p_moderator_id: string
          p_reason: string
          p_duration_hours?: number
        }
        Returns: boolean
      }
      unban_user: {
        Args: {
          p_user_id: string
          p_moderator_id: string
        }
        Returns: boolean
      }
      send_warning: {
        Args: {
          p_user_id: string
          p_moderator_id: string
          p_warning_type: string
          p_message: string
        }
        Returns: boolean
      }
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
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
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
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
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
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
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
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)