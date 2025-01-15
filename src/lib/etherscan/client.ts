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
    console.log('Fetching contract creator from Etherscan for:', contractAddress);
    
    const response = await fetch(
      `${ETHERSCAN_API_URL}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${config.etherscanApiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Etherscan API error:', errorText);
      throw new Error(`Etherscan API request failed: ${response.status} ${response.statusText}`);
    }

    const data: EtherscanResponse = await response.json();
    console.log('Etherscan API response:', data);
    
    if (data.status === '1' && data.result.length > 0) {
      const creatorAddress = data.result[0].contractCreator.toLowerCase();
      console.log('Found contract creator:', creatorAddress);
      return creatorAddress;
    }

    if (data.status === '0') {
      console.warn('Etherscan API returned error:', data.message);
    }

    console.log('No contract creator found');
    return null;
  } catch (error) {
    console.error('Error fetching contract creator from Etherscan:', error);
    // Don't throw, return null to allow the calling code to handle the failure
    return null;
  }
}