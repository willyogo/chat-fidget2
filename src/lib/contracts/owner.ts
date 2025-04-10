import { createPublicClient, http, parseAbi } from 'viem';
import { config, SUPPORTED_NETWORKS, type SupportedNetwork } from '../config';
import { getContractCreator } from '../etherscan/client';
import { publicClients } from './client';

async function tryDeployer(address: string, network: SupportedNetwork): Promise<string | null> {
  try {
    // console.log(`[${network.toUpperCase()}] Attempting to read deployer() for: ${address}`);
    const client = publicClients[network];
    const result = await client.readContract({
      address: address as `0x${string}`,
      abi: parseAbi(['function deployer() view returns (address)']),
      functionName: 'deployer',
    });
    const deployerAddress = (result as string).toLowerCase();
    // console.log(`[${network.toUpperCase()}] Found deployer address:`, deployerAddress);
    return deployerAddress;
  } catch (error) {
    // console.log(`[${network.toUpperCase()}] No deployer function found:`, error);
    return null;
  }
}

async function tryOwner(address: string, network: SupportedNetwork): Promise<string | null> {
  try {
    // console.log(`[${network.toUpperCase()}] Attempting to read owner() for: ${address}`);
    const client = publicClients[network];
    const result = await client.readContract({
      address: address as `0x${string}`,
      abi: parseAbi(['function owner() view returns (address)']),
      functionName: 'owner',
    });
    const ownerAddress = (result as string).toLowerCase();
    // console.log(`[${network.toUpperCase()}] Found owner address:`, ownerAddress);
    return ownerAddress;
  } catch (error) {
    // console.log(`[${network.toUpperCase()}] No owner function found:`, error);
    return null;
  }
}

async function tryCreator(address: string, network: SupportedNetwork): Promise<string | null> {
  try {
    // console.log(`[${network.toUpperCase()}] Attempting to read creator() for: ${address}`);
    const client = publicClients[network];
    const result = await client.readContract({
      address: address as `0x${string}`,
      abi: parseAbi(['function creator() view returns (address)']),
      functionName: 'creator',
    });
    const creatorAddress = (result as string).toLowerCase();
    // console.log(`[${network.toUpperCase()}] Found creator address:`, creatorAddress);
    return creatorAddress;
  } catch (error) {
    // console.log(`[${network.toUpperCase()}] No creator function found:`, error);
    return null;
  }
}

export async function getTokenOwner(
  tokenAddress: string, 
  network: SupportedNetwork = 'base'
): Promise<string | null> {
  const address = tokenAddress.toLowerCase();
  // console.log(`[${network.toUpperCase()}] Getting token owner for address: ${address}`);
  
  try {
    // Try each method on the specified network
    const deployer = await tryDeployer(address, network);
    if (deployer) {
      // console.log(`[${network.toUpperCase()}] Using deployer address:`, deployer);
      return deployer;
    }

    const owner = await tryOwner(address, network);
    if (owner) {
      // console.log(`[${network.toUpperCase()}] Using owner address:`, owner);
      return owner;
    }

    const creator = await tryCreator(address, network);
    if (creator) {
      // console.log(`[${network.toUpperCase()}] Using creator address:`, creator);
      return creator;
    }

    // Fallback to explorer API
    // console.log(`[${network.toUpperCase()}] Attempting to get creator from explorer`);
    const explorerCreator = await getContractCreator(address, network);
    if (explorerCreator) {
      // console.log(`[${network.toUpperCase()}] Using explorer creator address:`, explorerCreator);
      return explorerCreator;
    }

    // console.log(`[${network.toUpperCase()}] No owner found for token:`, address);
    return null;
  } catch (error) {
    // console.error(`[${network.toUpperCase()}] Error getting token owner:`, error);
    throw new Error(`Failed to determine token owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}