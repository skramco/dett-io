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
        Relationships: []
      }
      loanknow_leads: {
        Row: {
          id: string
          created_at: string
          email: string
          consent: boolean
          consent_text: string | null
          calculator_slug: string
          calculator_name: string | null
          cta_label: string | null
          inputs: Json
          results: Json
          source_path: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          consent: boolean
          consent_text?: string | null
          calculator_slug: string
          calculator_name?: string | null
          cta_label?: string | null
          inputs?: Json
          results?: Json
          source_path?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          consent?: boolean
          consent_text?: string | null
          calculator_slug?: string
          calculator_name?: string | null
          cta_label?: string | null
          inputs?: Json
          results?: Json
          source_path?: string | null
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'scenarios_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'calculator_sessions'
            referencedColumns: ['id']
          }
        ]
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
