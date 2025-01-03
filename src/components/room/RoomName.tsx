import { isAddress } from 'viem';
import { useTokenSymbol } from '../../lib/hooks/useTokenSymbol';
import { RoomAvatar } from './RoomAvatar';
import type { Room } from '../../lib/types/supabase';

type RoomNameProps = {
  room: Room;
  className?: string;
};

export function RoomName({ room, className = '' }: RoomNameProps) {
  const isToken = isAddress(room.name);
  const { symbol, isLoading } = useTokenSymbol(isToken ? room.name : null);

  return (
    <div className="flex items-center gap-2">
      <RoomAvatar room={room} />
      <span className={className}>
        {isToken ? (isLoading ? 'Loading...' : symbol ? `${symbol} Chat` : room.name) : room.name}
      </span>
    </div>
  );
}