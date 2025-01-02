import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { config } from '../config';

const erc20Abi = [{
  constant: true,
  inputs: [],
  name: 'symbol',
  outputs: [{ name: '', type: 'string' }],
  type: 'function',
}] as const;

const publicClient = createPublicClient({
  chain: base,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${config.alchemyApiKey}`),
});

export function useTokenSymbol(tokenAddress: string | null) {
  const [symbol, setSymbol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tokenAddress) {
      setSymbol(null);
      return;
    }

    let mounted = true;
    setIsLoading(true);

    async function fetchSymbol() {
      try {
        const result = await publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'symbol',
        });
        
        if (mounted) {
          setSymbol(result);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching token symbol:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch token symbol'));
          setSymbol(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSymbol();
    return () => { mounted = false; };
  }, [tokenAddress]);

  return { symbol, isLoading, error };
}