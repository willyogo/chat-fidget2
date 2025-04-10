import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { type SupportedNetwork } from '../config';
import { publicClients } from '../contracts/client';

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;

export function useTokenGate(
  tokenAddress: string | null, 
  requiredTokens: number, 
  userAddress: string | undefined,
  network: SupportedNetwork = 'base'
) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tokenAddress || !userAddress || requiredTokens <= 0) {
      setHasAccess(true);
      setIsLoading(false);
      setError(null);
      return;
    }

    let mounted = true;

    async function checkBalance() {
      try {
        setIsLoading(true);
        setError(null);

        const client = publicClients[network];
        const [balance, decimals] = await Promise.all([
          client.readContract({
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [userAddress as `0x${string}`],
          }),
          client.readContract({
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: 'decimals',
          }),
        ]);

        if (!mounted) return;

        // Format the balance to a decimal number considering token decimals
        const formattedBalance = Number(formatUnits(balance, decimals));
        
        // Compare the formatted balance with required tokens
        const hasEnoughTokens = formattedBalance >= requiredTokens;

        setHasAccess(hasEnoughTokens);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check token balance'));
        setHasAccess(false);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    checkBalance();
    return () => { mounted = false; };
  }, [tokenAddress, requiredTokens, userAddress, network]);

  return { hasAccess, isLoading, error };
}