import { usePrivy } from '@privy-io/react-auth';

export function useAuth() {
  const { 
    login, 
    logout, 
    authenticated, 
    user, 
    ready 
  } = usePrivy();

  return {
    login,
    logout,
    isAuthenticated: authenticated,
    user,
    isReady: ready,
    address: user?.wallet?.address
  };
}