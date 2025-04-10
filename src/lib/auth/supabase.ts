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
    // First try to get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email === email) {
      return { session };
    }

    // Try sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: normalizedAddress,
    });

    if (!signInError && signInData.session) {
      return signInData;
    }

    // Only attempt signup if sign in failed due to invalid credentials
    if (signInError?.message === 'Invalid login credentials') {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: normalizedAddress,
        options: {
          data: { wallet_address: normalizedAddress }
        }
      });

      if (!signUpError) {
        return signUpData;
      }

      // If user exists, try signing in one final time
      if (signUpError.message === 'User already registered') {
        return await supabase.auth.signInWithPassword({
          email,
          password: normalizedAddress,
        });
      }

      throw signUpError;
    }

    throw signInError;
  } catch (error) {
    throw error;
  }
}