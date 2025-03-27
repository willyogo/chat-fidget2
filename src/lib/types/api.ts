// API Types for Request/Response
import type { Room, Message } from './supabase';

export type ApiKey = {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used_at: string | null;
};

// Request Types
export type CreateRoomRequest = {
  name: string;
  ownerAddress: string;
  tokenAddress?: string;
  requiredTokens?: number;
  tokenNetwork?: 'base' | 'polygon';
};

export type UpdateRoomRequest = {
  tokenAddress?: string | null;
  requiredTokens?: number;
  tokenNetwork?: 'base' | 'polygon' | null;
};

export type SendMessageRequest = {
  content: string;
  userAddress: string;
};

// Response Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type RoomResponse = ApiResponse<Room>;
export type MessageResponse = ApiResponse<Message>;
export type MessagesResponse = ApiResponse<{
  messages: Message[];
  hasMore: boolean;
}>;
export type ApiKeyResponse = ApiResponse<ApiKey>;