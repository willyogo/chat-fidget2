import { useEffect, useState } from 'react';
import { type SupportedNetwork } from '../config';
import { publicClients } from '../contracts/client';

const erc20Abi = [{
  constant: true,
  inputs: [],
  name: 'symbol',
  type: 'function',
  outputs: [{ name: '', type: 'string' }],
  type: 'function',
}] as const;

export function useTokenSymbol(
  tokenAddress: string | null,
  network: SupportedNetwork = 'base'
) {
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
        const client = publicClients[network];
        const result = await client.readContract({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'symbol',
        });
        
        if (mounted) {
          setSymbol(result);
          setError(null);
        }
      } catch (err) {
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
  }, [tokenAddress, network]);

  return { symbol, isLoading, error };
}