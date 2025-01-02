import { useAuth } from '../auth/useAuth';
import { WalletDropdown } from '../auth/WalletDropdown';
import { Settings } from 'lucide-react';
import { TokenGateInfo } from './TokenGateInfo';
import { RoomName } from './RoomName';
import type { Database } from '../../lib/types/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

type RoomHeaderProps = {
  room: Room;
  onOpenSettings?: () => void;
  onManageTokenGate?: () => void;
};

export function RoomHeader({ room, onOpenSettings, onManageTokenGate }: RoomHeaderProps) {
  const { address } = useAuth();
  const isOwner = !!address && room.owner_address &&
    address.toLowerCase() === room.owner_address.toLowerCase());

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
          onManageGate={onManageTokenGate}
        />
      </div>
      <div className="flex items-center gap-4">
        {isOwner && onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Room Settings"
          >
            <Settings size={20} />
          </button>
        )}
        <WalletDropdown />
      </div>
    </div>
  );
}