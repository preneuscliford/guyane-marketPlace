export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      announcements: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          price?: number;
          location?: string;
          category?: string;
          user_id: string;
          images?: string[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          price?: number;
          location?: string;
          category?: string;
          user_id: string;
          images?: string[];
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          price?: number;
          location?: string;
          category?: string;
          user_id?: string;
          images?: string[];
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name?: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
