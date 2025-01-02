import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';
import { config } from '../config';

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

async function getCreator(address: string): Promise<string | null> {
  try {
    const bytecode = await publicClient.getBytecode({ 
      address: address as `0x${string}` 
    });
    if (!bytecode) return null;

    const txs = await publicClient.getContractCreationTx({ 
      address: address as `0x${string}` 
    });
    if (!txs?.data) return null;

    const receipt = await publicClient.getTransactionReceipt({ 
      hash: txs.data 
    });
    return receipt.from.toLowerCase();
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

  // Finally try to get creator
  const creator = await getCreator(address);
  if (creator) return creator;

  return null;
}