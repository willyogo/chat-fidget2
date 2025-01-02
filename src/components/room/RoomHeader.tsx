import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { WalletDropdown } from '../auth/WalletDropdown';
import { Settings } from 'lucide-react';
import { TokenGateInfo } from './TokenGateInfo';
import { RoomName } from './RoomName';
import { TokenGateModal } from './TokenGateModal';
import type { Database } from '../../lib/types/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

type RoomHeaderProps = {
  room: Room;
};

export function RoomHeader({ room }: RoomHeaderProps) {
  const { address } = useAuth();
  const [showTokenGateModal, setShowTokenGateModal] = useState(false);
  const isOwner = address && room.owner_address && 
    address.toLowerCase() === room.owner_address.toLowerCase();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-xl font-bold">
          <RoomName name={room.name} />
        </h1>
        <TokenGateInfo
          tokenAddress={room.token_address}
          requiredTokens={room.required_tokens}
          isOwner={isOwner}
          onManageGate={() => setShowTokenGateModal(true)}
        />
      </div>
      <div className="flex items-center gap-4">
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