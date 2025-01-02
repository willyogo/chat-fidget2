import { useAuth } from '../auth/useAuth';
import { WalletDropdown } from '../auth/WalletDropdown';
import { Settings } from 'lucide-react';
import type { Database } from '../../lib/types/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

type RoomHeaderProps = {
  room: Room;
  onOpenSettings?: () => void;
};

export function RoomHeader({ room, onOpenSettings }: RoomHeaderProps) {
  const { address } = useAuth();
  const isOwner = address?.toLowerCase() === room.owner_address.toLowerCase();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-xl font-bold">{room.name}</h1>
        {room.token_address && (
          <p className="text-sm text-gray-600">
            Required: {room.required_tokens} tokens
          </p>
        )}
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