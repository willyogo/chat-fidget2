import { Shield } from 'lucide-react';
import { useTokenSymbol } from '../../lib/hooks/useTokenSymbol';
import { useTokenGate } from '../../lib/hooks/useTokenGate';
import { useAuth } from '../../components/auth/useAuth';
import { useRoomStore } from '../../lib/store/room';
import { useEffect } from 'react';

type TokenGateInfoProps = {
  tokenAddress: string | null;
  requiredTokens: number;
  isOwner: boolean;
  onManageGate?: () => void;
};

export function TokenGateInfo({ 
  tokenAddress: initialTokenAddress, 
  requiredTokens: initialRequiredTokens, 
  isOwner,
  onManageGate 
}: TokenGateInfoProps) {
  const { address } = useAuth();
  const room = useRoomStore(state => state.room);
  const version = useRoomStore(state => state.version); // Subscribe to version changes

  // Use room store values, falling back to props
  const tokenAddress = room?.token_address ?? initialTokenAddress;
  const requiredTokens = room?.required_tokens ?? initialRequiredTokens;

  const { symbol, isLoading } = useTokenSymbol(tokenAddress);
  const { hasAccess } = useTokenGate(tokenAddress, requiredTokens, address);

  // Debug logging
  useEffect(() => {
    console.log('TokenGateInfo re-render:', {
      version,
      tokenAddress,
      requiredTokens,
      roomState: room
    });
  }, [version, tokenAddress, requiredTokens, room]);

  if (!tokenAddress) {
    if (isOwner && onManageGate) {
      return (
        <button
          onClick={onManageGate}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
        >
          Add token gate
        </button>
      );
    }
    return null;
  }

  const baseScanUrl = `https://basescan.org/token/${tokenAddress}`;
  const tokenDisplay = isLoading ? '...' : symbol || 'tokens';

  return (
    <div className="flex items-center gap-2 text-sm mt-3">
      <Shield 
        size={16} 
        className={hasAccess ? 'text-green-500' : 'text-yellow-500'} 
      />
      <span className="text-gray-600">
        Required: {requiredTokens}{' '}
        <a 
          href={baseScanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-700"
        >
          {tokenDisplay}
        </a>
      </span>
      {isOwner && onManageGate && (
        <button
          onClick={onManageGate}
          className="text-indigo-600 hover:text-indigo-700 font-medium ml-2"
        >
          Edit
        </button>
      )}
    </div>
  );
}