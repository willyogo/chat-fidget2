import { createPublicClient, http } from 'viem';
import { SUPPORTED_NETWORKS, config } from '../config';

// Create a public client for each supported network
export const publicClients = Object.entries(SUPPORTED_NETWORKS).reduce((acc, [network, chain]) => {
  acc[network] = createPublicClient({
    chain,
    transport: http(config.rpcEndpoints[network]),
  });
  return acc;
}, {} as Record<keyof typeof SUPPORTED_NETWORKS, ReturnType<typeof createPublicClient>>);

// Get the appropriate client for a given token address and network
export function getClientForToken(tokenAddress: string, network?: keyof typeof SUPPORTED_NETWORKS) {
  // If network is specified, use that client
  if (network && network in publicClients) {
    return publicClients[network];
  }

  // Default to Base network if not specified
  return publicClients.base;
}