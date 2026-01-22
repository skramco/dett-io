export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      calculator_sessions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          calculator_type: string
          session_data: Json
          anonymous_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          calculator_type: string
          session_data: Json
          anonymous_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          calculator_type?: string
          session_data?: Json
          anonymous_id?: string | null
          user_id?: string | null
        }
      }
      scenarios: {
        Row: {
          id: string
          created_at: string
          session_id: string
          name: string
          inputs: Json
          results: Json
        }
        Insert: {
          id?: string
          created_at?: string
          session_id: string
          name: string
          inputs: Json
          results: Json
        }
        Update: {
          id?: string
          created_at?: string
          session_id?: string
          name?: string
          inputs?: Json
          results?: Json
        }
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
  }
}
