import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { config } from '../config';

const imageAbi = [{
  constant: true,
  inputs: [],
  name: 'image',
  outputs: [{ name: '', type: 'string' }],
  type: 'function',
}] as const;

const publicClient = createPublicClient({
  chain: base,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${config.alchemyApiKey}`),
});

export function useContractImage(contractAddress: string | null) {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!contractAddress) {
      setImage(null);
      return;
    }

    let mounted = true;
    setIsLoading(true);

    async function fetchImage() {
      try {
        const result = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: imageAbi,
          functionName: 'image',
        });
        
        if (mounted) {
          setImage(result);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching contract image:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch contract image'));
          setImage(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchImage();
    return () => { mounted = false; };
  }, [contractAddress]);

  return { image, isLoading, error };
}