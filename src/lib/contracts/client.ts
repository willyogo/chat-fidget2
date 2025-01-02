import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { config } from '../config';

export const publicClient = createPublicClient({
  chain: base,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${config.alchemyApiKey}`),
});