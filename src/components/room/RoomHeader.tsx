import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { WalletDropdown } from '../auth/WalletDropdown';
import { TokenGateTooltip } from './TokenGateTooltip';
import { RoomName } from './RoomName';
import { TokenGateModal } from './TokenGateModal';
import { RoomSettings } from './RoomSettings';
import type { Room } from '../../lib/types/supabase';

type RoomHeaderProps = {
  room: Room;
};

export function RoomHeader({ room }: RoomHeaderProps) {
  const { address } = useAuth();
  const [showTokenGateModal, setShowTokenGateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isOwner = address && room.owner_address && 
    address.toLowerCase() === room.owner_address.toLowerCase();

  return (
    <div className="flex items-center justify-between p-3 md:p-4 border-b bg-white shadow-sm">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-xl font-bold truncate">
            <RoomName room={room} />
          </h1>
          <TokenGateTooltip
            tokenAddress={room.token_address}
            requiredTokens={room.required_tokens}
            isOwner={isOwner}
            onManageGate={() => setShowTokenGateModal(true)}
          />
          {isOwner && (
            <RoomSettings
              roomName={room.name}
              onError={(err) => setError(err.message)}
              onSuccess={() => setError(null)}
            />
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
      <div className="ml-4 flex-shrink-0">
        <WalletDropdown />
      </div>

      {showTokenGateModal && (
        <TokenGateModal
          roomName={room.name}
          currentTokenAddress={room.token_address}
          currentRequiredTokens={room.required_tokens}
          onClose={() => setShowTokenGateModal(false)}
        />
      )}
    </div>
  );
}