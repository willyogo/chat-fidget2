import { getContract } from 'viem';
import { publicClient } from './client';
import { DEPLOYER_ABI, OWNER_ABI } from './abi';

async function tryDeployer(address: string): Promise<string | null> {
  try {
    const contract = getContract({
      address: address as `0x${string}`,
      abi: DEPLOYER_ABI,
      publicClient,
    });

    const deployer = await contract.read.deployer();
    return deployer.toLowerCase();
  } catch (error) {
    console.log('No deployer function:', error);
    return null;
  }
}

async function tryOwner(address: string): Promise<string | null> {
  try {
    const contract = getContract({
      address: address as `0x${string}`,
      abi: OWNER_ABI,
      publicClient,
    });

    const owner = await contract.read.owner();
    return owner.toLowerCase();
  } catch (error) {
    console.log('No owner function:', error);
    return null;
  }
}

async function getCreator(address: string): Promise<string | null> {
  try {
    const bytecode = await publicClient.getBytecode({ address: address as `0x${string}` });
    if (!bytecode) return null;

    const txs = await publicClient.getContractCreationTx({ address: address as `0x${string}` });
    if (!txs?.data) return null;

    const receipt = await publicClient.getTransactionReceipt({ hash: txs.data });
    return receipt.from.toLowerCase();
  } catch (error) {
    console.log('Error getting creator:', error);
    return null;
  }
}

export async function getTokenOwner(tokenAddress: string): Promise<string | null> {
  const address = tokenAddress.toLowerCase();
  
  try {
    // First try deployer()
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

    // Finally try to get creator
    const creator = await getCreator(address);
    if (creator) {
      console.log('Found creator:', creator);
      return creator;
    }

    console.log('No owner found for token:', address);
    return null;
  } catch (error) {
    console.error('Error getting token owner:', error);
    return null;
  }
}