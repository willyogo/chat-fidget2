import { useState, useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useTokenSymbol } from '../../lib/hooks/useTokenSymbol';
import { useTokenGate } from '../../lib/hooks/useTokenGate';
import { useAuth } from '../../components/auth/useAuth';
import { useRoomStore } from '../../lib/store/room';
import { SUPPORTED_NETWORKS, type SupportedNetwork } from '../../lib/config';

type TokenGateTooltipProps = {
  tokenAddress: string | null;
  requiredTokens: number;
  network?: SupportedNetwork;
  isOwner: boolean;
  onManageGate?: () => void;
};

export function TokenGateTooltip({ 
  tokenAddress: initialTokenAddress, 
  requiredTokens: initialRequiredTokens,
  network: initialNetwork = 'base',
  isOwner,
  onManageGate 
}: TokenGateTooltipProps) {
  const { address } = useAuth();
  const room = useRoomStore(state => state.room);
  const version = useRoomStore(state => state.version);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

  // Use room store values, falling back to props
  const tokenAddress = room?.token_address ?? initialTokenAddress;
  const requiredTokens = room?.required_tokens ?? initialRequiredTokens;
  const network = (room?.token_network ?? initialNetwork) as SupportedNetwork;

  const { symbol, isLoading } = useTokenSymbol(tokenAddress, network);
  const { hasAccess } = useTokenGate(tokenAddress, requiredTokens, address, network);

  // Debug logging
  useEffect(() => {
    // console.log('TokenGateTooltip re-render:', {
    //   version,
    //   tokenAddress,
    //   requiredTokens,
    //   network,
    //   roomState: room
    // });
  }, [version, tokenAddress, requiredTokens, network, room]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const tooltipEl = tooltipRef.current;
    const relatedTarget = e.relatedTarget as HTMLElement;
    
    if (tooltipEl?.contains(relatedTarget)) {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setShowTooltip(false);
    }, 100);
  };

  if (!tokenAddress) {
    if (isOwner && onManageGate) {
      return (
        <button
          onClick={onManageGate}
          className="ml-2 text-indigo-600 hover:text-indigo-700"
        >
          <Shield size={16} />
        </button>
      );
    }
    return null;
  }

  const explorerUrl = network === 'polygon' 
    ? `https://polygonscan.com/token/${tokenAddress}`
    : `https://basescan.org/token/${tokenAddress}`;
  
  const tokenDisplay = isLoading ? '...' : symbol || 'tokens';
  const networkDisplay = SUPPORTED_NETWORKS[network].name;

  return (
    <div 
      className="relative ml-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Shield 
          size={16} 
          className={hasAccess ? 'text-green-500' : 'text-yellow-500'} 
        />
      </button>

      {showTooltip && (
        <div 
          ref={tooltipRef}
          className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-50 bg-white rounded-lg shadow-lg border p-3 whitespace-nowrap min-w-48"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="text-sm text-gray-600">
            Required: {requiredTokens}{' '}
            <a 
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700"
            >
              {tokenDisplay}
            </a>
            {' '}on{' '}
            <span className="font-medium">{networkDisplay}</span>
          </div>
          {isOwner && onManageGate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onManageGate();
              }}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Edit Token Gate
            </button>
          )}
        </div>
      )}
    </div>
  );
}