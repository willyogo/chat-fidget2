import { GiphyFetch } from '@giphy/js-fetch-api';
import { type Chain, base, polygon } from 'viem/chains';

export const SUPPORTED_NETWORKS = {
  base,
  polygon
} as const;

export type SupportedNetwork = keyof typeof SUPPORTED_NETWORKS;

export const config = {
  privyAppId: import.meta.env.VITE_PRIVY_APP_ID,
  airstackApiKey: import.meta.env.VITE_AIRSTACK_API_KEY,
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  etherscanApiKey: import.meta.env.VITE_ETHERSCAN_API_KEY,
  giphyApiKey: import.meta.env.VITE_GIPHY_API_KEY || 'your-api-key',
  polygonscanApiKey: import.meta.env.VITE_POLYGONSCAN_API_KEY,
  rpcEndpoints: {
    base: `https://base-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
    polygon: `https://polygon-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
  },
} as const;

// Validate required environment variables
const requiredEnvVars = {
  VITE_PRIVY_APP_ID: config.privyAppId,
  VITE_AIRSTACK_API_KEY: config.airstackApiKey,
  VITE_ALCHEMY_API_KEY: config.alchemyApiKey,
  VITE_SUPABASE_URL: config.supabaseUrl,
  VITE_SUPABASE_ANON_KEY: config.supabaseAnonKey,
  VITE_ETHERSCAN_API_KEY: config.etherscanApiKey,
  VITE_GIPHY_API_KEY: config.giphyApiKey,
  VITE_POLYGONSCAN_API_KEY: config.polygonscanApiKey,
} as const;

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// Initialize Giphy client
export const giphyClient = new GiphyFetch(config.giphyApiKey);