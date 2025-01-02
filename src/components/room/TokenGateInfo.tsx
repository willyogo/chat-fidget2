import { ExternalLink } from 'lucide-react';
import { useTokenSymbol } from '../../lib/hooks/useTokenSymbol';

type TokenGateInfoProps = {
  tokenAddress: string | null;
  requiredTokens: number;
  isOwner: boolean;
  onManageGate?: () => void;
};

export function TokenGateInfo({ 
  tokenAddress, 
  requiredTokens, 
  isOwner,
  onManageGate 
}: TokenGateInfoProps) {
  const { symbol, isLoading } = useTokenSymbol(tokenAddress);

  if (!tokenAddress) {
    if (isOwner && onManageGate) {
      return (
        <button
          onClick={onManageGate}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Add token gate
        </button>
      );
    }
    return null;
  }

  const baseScanUrl = `https://basescan.org/token/${tokenAddress}`;
  const tokenDisplay = isLoading ? 'tokens' : symbol ? `${symbol} tokens` : 'tokens';

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">
        Required: {requiredTokens} {tokenDisplay}
        <a 
          href={baseScanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 ml-1 text-indigo-600 hover:text-indigo-700"
        >
          <ExternalLink size={14} />
          View on BaseScan
        </a>
      </span>
      {isOwner && onManageGate && (
        <button
          onClick={onManageGate}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium ml-2"
        >
          Edit gate
        </button>
      )}
    </div>
  );
}