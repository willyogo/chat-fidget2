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
    console.log('Attempting to read deployer() for:', address);
    const result = await publicClient.readContract({
      address: address as `0x${string}`,
      abi: parseAbi(['function deployer() view returns (address)']),
      functionName: 'deployer',
    });
    const deployerAddress = (result as string).toLowerCase();
    console.log('Found deployer address:', deployerAddress);
    return deployerAddress;
  } catch (error) {
    console.log('No deployer function found:', error);
    return null;
  }
}

async function tryOwner(address: string): Promise<string | null> {
  try {
    console.log('Attempting to read owner() for:', address);
    const result = await publicClient.readContract({
      address: address as `0x${string}`,
      abi: parseAbi(['function owner() view returns (address)']),
      functionName: 'owner',
    });
    const ownerAddress = (result as string).toLowerCase();
    console.log('Found owner address:', ownerAddress);
    return ownerAddress;
  } catch (error) {
    console.log('No owner function found:', error);
    return null;
  }
}

async function tryCreator(address: string): Promise<string | null> {
  try {
    console.log('Attempting to read creator() for:', address);
    const result = await publicClient.readContract({
      address: address as `0x${string}`,
      abi: parseAbi(['function creator() view returns (address)']),
      functionName: 'creator',
    });
    const creatorAddress = (result as string).toLowerCase();
    console.log('Found creator address:', creatorAddress);
    return creatorAddress;
  } catch (error) {
    console.log('No creator function found:', error);
    return null;
  }
}

export async function getTokenOwner(tokenAddress: string): Promise<string | null> {
  const address = tokenAddress.toLowerCase();
  console.log('Getting token owner for address:', address);
  
  try {
    // 1. Try deployer()
    const deployer = await tryDeployer(address);
    if (deployer) {
      console.log('Using deployer address:', deployer);
      return deployer;
    }

    // 2. Try owner()
    const owner = await tryOwner(address);
    if (owner) {
      console.log('Using owner address:', owner);
      return owner;
    }

    // 3. Try creator()
    const creator = await tryCreator(address);
    if (creator) {
      console.log('Using creator address:', creator);
      return creator;
    }

    // 4. Fallback to Etherscan API
    console.log('Attempting to get creator from Etherscan');
    const etherscanCreator = await getContractCreator(address);
    if (etherscanCreator) {
      console.log('Using Etherscan creator address:', etherscanCreator);
      return etherscanCreator;
    }

    console.log('No owner found for token:', address);
    return null;
  } catch (error) {
    console.error('Error getting token owner:', error);
    throw new Error(`Failed to determine token owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}