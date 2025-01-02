import { useEffect, useState } from 'react';
import { createPublicClient, http, formatUnits } from 'viem';
import { base } from 'viem/chains';
import { config } from '../config';

const publicClient = createPublicClient({
  chain: base,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${config.alchemyApiKey}`),
});

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
        const [balance, decimals] = await Promise.all([
          publicClient.readContract({
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [userAddress as `0x${string}`],
          }),
          publicClient.readContract({
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: 'decimals',
          }),
        ]);

        // Format the balance to a decimal number considering token decimals
        const formattedBalance = Number(formatUnits(balance, decimals));
        
        // Compare the formatted balance with required tokens
        setHasAccess(formattedBalance >= requiredTokens);
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