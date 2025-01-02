import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { withRetry, sleep, MIN_AUTH_INTERVAL } from './utils';
import { useAuthStore } from './authStore';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function signInWithWallet(address: string) {
  const normalizedAddress = address.toLowerCase();
  const email = `${normalizedAddress}@wallet.local`;
  
  // Check if we've attempted auth too recently
  const now = Date.now();
  const lastAttempt = useAuthStore.getState().lastAuthAttempt;
  const timeSinceLastAttempt = now - lastAttempt;
  
  if (timeSinceLastAttempt < MIN_AUTH_INTERVAL) {
    await sleep(MIN_AUTH_INTERVAL - timeSinceLastAttempt);
  }
  
  useAuthStore.getState().setLastAuthAttempt(Date.now());

  try {
    // Attempt sign in with retry logic
    const signInResult = await withRetry(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: normalizedAddress,
      });
      
      if (!error) return data;
      if (error.message !== 'Invalid login credentials') throw error;
      return null;
    });

    if (signInResult) return signInResult;

    // Only attempt signup if sign in failed due to invalid credentials
    const signUpResult = await withRetry(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: normalizedAddress,
        options: {
          data: { wallet_address: normalizedAddress }
        }
      });

      if (!error) return data;
      
      // If user exists, try signing in one final time
      if (error.message === 'User already registered') {
        const { data: finalSignIn } = await supabase.auth.signInWithPassword({
          email,
          password: normalizedAddress,
        });
        return finalSignIn;
      }
      
      throw error;
    });

    return signUpResult;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}