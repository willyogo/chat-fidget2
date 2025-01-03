import { useState, useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useTokenSymbol } from '../../lib/hooks/useTokenSymbol';
import { useTokenGate } from '../../lib/hooks/useTokenGate';
import { useAuth } from '../auth/useAuth';

type TokenGateTooltipProps = {
  tokenAddress: string | null;
  requiredTokens: number;
  isOwner: boolean;
  onManageGate?: () => void;
};

export function TokenGateTooltip({ 
  tokenAddress, 
  requiredTokens, 
  isOwner,
  onManageGate 
}: TokenGateTooltipProps) {
  const { address } = useAuth();
  const { symbol, isLoading } = useTokenSymbol(tokenAddress);
  const { hasAccess } = useTokenGate(tokenAddress, requiredTokens, address);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number>();

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
    
    // Don't hide if moving to the tooltip content
    if (tooltipEl?.contains(relatedTarget)) {
      return;
    }

    // Add a small delay before hiding
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

  const baseScanUrl = `https://basescan.org/token/${tokenAddress}`;
  const tokenDisplay = isLoading ? '...' : symbol || 'tokens';

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
              href={baseScanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700"
            >
              {tokenDisplay}
            </a>
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