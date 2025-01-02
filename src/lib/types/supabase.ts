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
        }
        Insert: {
          name: string
          owner_address: string
          created_at?: string
          token_address?: string | null
          required_tokens?: number
        }
        Update: {
          name?: string
          owner_address?: string
          created_at?: string
          token_address?: string | null
          required_tokens?: number
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