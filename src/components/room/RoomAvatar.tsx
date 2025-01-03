import { isAddress } from 'viem';
import { useContractImage } from '../../lib/hooks/useContractImage';
import type { Room } from '../../lib/types/supabase';

type RoomAvatarProps = {
  room: Room;
  className?: string;
};

export function RoomAvatar({ room, className = '' }: RoomAvatarProps) {
  const isContract = isAddress(room.name);
  const { image: contractImage } = useContractImage(
    room.use_contract_avatar && isContract ? room.name : null
  );

  const avatarUrl = room.use_contract_avatar ? contractImage : room.avatar_url;

  if (!avatarUrl) {
    return null;
  }

  return (
    <img 
      src={avatarUrl} 
      alt={`${room.name} avatar`}
      className={`w-8 h-8 rounded-full object-cover ${className}`}
    />
  );
}