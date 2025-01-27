import { config, type SupportedNetwork } from '../config';

const EXPLORER_URLS = {
  base: 'https://api.basescan.org/api',
  polygon: 'https://api.polygonscan.com/api',
} as const;

const API_KEYS = {
  base: config.etherscanApiKey,
  polygon: config.polygonscanApiKey,
} as const;

type ExplorerResponse = {
  status: string;
  message: string;
  result: Array<{
    contractCreator: string;
    txHash: string;
  }>;
};

export async function getContractCreator(
  contractAddress: string,
  network: SupportedNetwork = 'base'
): Promise<string | null> {
  try {
    console.log(`Fetching contract creator from ${network} explorer for:`, contractAddress);
    
    const response = await fetch(
      `${EXPLORER_URLS[network]}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${API_KEYS[network]}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${network} explorer API error:`, errorText);
      throw new Error(`${network} explorer API request failed: ${response.status} ${response.statusText}`);
    }

    const data: ExplorerResponse = await response.json();
    console.log(`${network} explorer API response:`, data);
    
    if (data.status === '1' && data.result.length > 0) {
      const creatorAddress = data.result[0].contractCreator.toLowerCase();
      console.log('Found contract creator:', creatorAddress);
      return creatorAddress;
    }

    if (data.status === '0') {
      console.warn(`${network} explorer API returned error:`, data.message);
    }

    console.log('No contract creator found');
    return null;
  } catch (error) {
    console.error(`Error fetching contract creator from ${network} explorer:`, error);
    return null;
  }
}