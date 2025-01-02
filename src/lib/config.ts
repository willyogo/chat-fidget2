export const config = {
  privyAppId: import.meta.env.VITE_PRIVY_APP_ID,
  airstackApiKey: import.meta.env.VITE_AIRSTACK_API_KEY,
  alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;

// Validate required environment variables
const requiredEnvVars = {
  VITE_PRIVY_APP_ID: config.privyAppId,
  VITE_AIRSTACK_API_KEY: config.airstackApiKey,
  VITE_ALCHEMY_API_KEY: config.alchemyApiKey,
  VITE_SUPABASE_URL: config.supabaseUrl,
  VITE_SUPABASE_ANON_KEY: config.supabaseAnonKey,
} as const;

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});