import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function signInWithWallet(address: string) {
  const normalizedAddress = address.toLowerCase();
  
  try {
    console.log('Attempting to sign in with address:', normalizedAddress);
    
    // Sign in with custom claims
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${normalizedAddress}@wallet.local`,
      password: normalizedAddress,
    });

    if (error) {
      console.log('Sign in failed, attempting signup');
      
      // If sign in fails, sign up with wallet address in user_metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `${normalizedAddress}@wallet.local`,
        password: normalizedAddress,
        options: {
          data: {
            wallet_address: normalizedAddress
          }
        }
      });

      if (signUpError) throw signUpError;
      
      console.log('Successfully signed up:', {
        user: signUpData.user,
        session: signUpData.session,
        claims: signUpData.session?.user?.user_metadata
      });
      
      return signUpData;
    }

    console.log('Successfully signed in:', {
      user: data.user,
      session: data.session,
      claims: data.session?.user?.user_metadata
    });

    return data;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}