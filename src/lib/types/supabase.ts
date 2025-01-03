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
      rooms: {
        Row: {
          name: string
          owner_address: string
          created_at: string
          token_address: string | null
          required_tokens: number
          avatar_url: string | null
          avatar_updated_at: string | null
          use_contract_avatar: boolean
        }
        Insert: {
          name: string
          owner_address: string
          created_at?: string
          token_address?: string | null
          required_tokens?: number
          avatar_url?: string | null
          avatar_updated_at?: string | null
          use_contract_avatar?: boolean
        }
        Update: {
          name?: string
          owner_address?: string
          created_at?: string
          token_address?: string | null
          required_tokens?: number
          avatar_url?: string | null
          avatar_updated_at?: string | null
          use_contract_avatar?: boolean
        }
      }
      messages: {
        Row: {
          id: string
          room_id: string
          user_address: string
          content: string
          created_at: string
          farcaster_username: string | null
          farcaster_avatar: string | null
        }
        Insert: {
          id?: string
          room_id: string
          user_address: string
          content: string
          created_at?: string
          farcaster_username?: string | null
          farcaster_avatar?: string | null
        }
        Update: {
          id?: string
          room_id?: string
          user_address?: string
          content?: string
          created_at?: string
          farcaster_username?: string | null
          farcaster_avatar?: string | null
        }
      }
    }
  }
}

export type Room = Database['public']['Tables']['rooms']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];