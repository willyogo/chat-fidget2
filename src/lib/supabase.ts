import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase';
import { SignJWT } from 'jose';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the base Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Sign in with a wallet address using JWT
export async function signInWithAddress(address: string) {
  try {
    // Create a JWT token with the wallet address as the subject
    const token = await supabase.auth.signInWithPassword({
      email: address.toLowerCase(),
      password: address.toLowerCase(),
    });

    return token;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}