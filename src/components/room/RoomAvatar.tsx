import { isAddress } from 'viem';
import { useContractImage } from '../../lib/hooks/useContractImage';

type RoomAvatarProps = {
  name: string;
  className?: string;
};

export function RoomAvatar({ name, className = '' }: RoomAvatarProps) {
  const isContract = isAddress(name);
  const { image, isLoading } = useContractImage(isContract ? name : null);

  if (!isContract || isLoading || !image) {
    return null;
  }

  return (
    <img 
      src={image} 
      alt={`${name} avatar`}
      className={`w-8 h-8 rounded-full object-cover ${className}`}
    />
  );
}