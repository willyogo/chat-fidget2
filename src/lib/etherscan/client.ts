import { config } from '../config';

const ETHERSCAN_API_URL = 'https://api.basescan.org/api';

type EtherscanResponse = {
  status: string;
  message: string;
  result: Array<{
    contractCreator: string;
    txHash: string;
  }>;
};

export async function getContractCreator(contractAddress: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${ETHERSCAN_API_URL}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${config.etherscanApiKey}`
    );

    if (!response.ok) {
      throw new Error(`Etherscan API request failed: ${response.statusText}`);
    }

    const data: EtherscanResponse = await response.json();
    
    if (data.status === '1' && data.result.length > 0) {
      return data.result[0].contractCreator.toLowerCase();
    }

    return null;
  } catch (error) {
    console.error('Error fetching contract creator from Etherscan:', error);
    return null;
  }
}