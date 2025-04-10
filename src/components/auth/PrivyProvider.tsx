import { PrivyProvider as Provider } from '@privy-io/react-auth';
import { config } from '../../lib/config';

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider
      appId={config.privyAppId}
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#4F46E5',
        },
        // Disable console logging from Privy
        logger: {
          debug: () => {},
          info: () => {},
          warn: console.warn,
          error: console.error
        }
      }}>
      {children}
    </Provider>
  );
}