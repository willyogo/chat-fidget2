import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { signInWithWallet } from '../../lib/auth/supabase';

export function useAuth() {
  const { 
    login, 
    logout: privyLogout, 
    authenticated, 
    user, 
    ready 
  } = usePrivy();

  // Sign in to Supabase when wallet is connected
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      signInWithWallet(user.wallet.address)
        .catch(console.error);
    }
  }, [authenticated, user?.wallet?.address]);

  const logout = async () => {
    await privyLogout();
  };

  return {
    login,
    logout,
    isAuthenticated: authenticated,
    user,
    isReady: ready,
    address: user?.wallet?.address
  };
}