import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';
import { config } from '../config';
import { getContractCreator } from '../etherscan/client';

const publicClient = createPublicClient({
  chain: base,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${config.alchemyApiKey}`),
});

async function tryDeployer(address: string): Promise<string | null> {
  try {
    const result = await publicClient.readContract({
      address: address as `0x${string}`,
      abi: parseAbi(['function deployer() view returns (address)']),
      functionName: 'deployer',
    });
    return (result as string).toLowerCase();
  } catch {
    return null;
  }
}

async function tryOwner(address: string): Promise<string | null> {
  try {
    const result = await publicClient.readContract({
      address: address as `0x${string}`,
      abi: parseAbi(['function owner() view returns (address)']),
      functionName: 'owner',
    });
    return (result as string).toLowerCase();
  } catch {
    return null;
  }
}

export async function getTokenOwner(tokenAddress: string): Promise<string | null> {
  const address = tokenAddress.toLowerCase();
  
  // Try deployer() first
  const deployer = await tryDeployer(address);
  if (deployer) return deployer;

  // Then try owner()
  const owner = await tryOwner(address);
  if (owner) return owner;

  // Finally try Etherscan API
  const creator = await getContractCreator(address);
  if (creator) return creator;

  return null;
}