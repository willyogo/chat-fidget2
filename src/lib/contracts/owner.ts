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

async function tryCreator(address: string): Promise<string | null> {
  try {
    const result = await publicClient.readContract({
      address: address as `0x${string}`,
      abi: parseAbi(['function creator() view returns (address)']),
      functionName: 'creator',
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
  if (deployer) {
    console.log('Found deployer:', deployer);
    return deployer;
  }

  // Then try owner()
  const owner = await tryOwner(address);
  if (owner) {
    console.log('Found owner:', owner);
    return owner;
  }

  // Then try creator()
  const creator = await tryCreator(address);
  if (creator) {
    console.log('Found creator:', creator);
    return creator;
  }

  // Finally try Etherscan API as fallback
  const etherscanCreator = await getContractCreator(address);
  if (etherscanCreator) {
    console.log('Found creator from Etherscan:', etherscanCreator);
    return etherscanCreator;
  }

  console.log('No owner found for token:', address);
  return null;
}