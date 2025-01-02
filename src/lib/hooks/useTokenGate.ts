import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { config } from '../config';

const publicClient = createPublicClient({
  chain: base,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${config.alchemyApiKey}`),
});

export function useTokenGate(tokenAddress: string | null, requiredTokens: number, userAddress: string | undefined) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tokenAddress || !userAddress || requiredTokens <= 0) {
      setHasAccess(true);
      setIsLoading(false);
      return;
    }

    async function checkBalance() {
      try {
        const balance = await publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: [{
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
          }],
          functionName: 'balanceOf',
          args: [userAddress as `0x${string}`],
        });

        setHasAccess(Number(balance) >= requiredTokens);
      } catch (error) {
        console.error('Error checking token balance:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkBalance();
  }, [tokenAddress, requiredTokens, userAddress]);

  return { hasAccess, isLoading };
}