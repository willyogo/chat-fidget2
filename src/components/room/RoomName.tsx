import { isAddress } from 'viem';
import { useTokenSymbol } from '../../lib/hooks/useTokenSymbol';
import { RoomAvatar } from './RoomAvatar';

type RoomNameProps = {
  name: string;
  className?: string;
};

export function RoomName({ name, className = '' }: RoomNameProps) {
  const isToken = isAddress(name);
  const { symbol, isLoading } = useTokenSymbol(isToken ? name : null);

  return (
    <div className="flex items-center gap-2">
      <RoomAvatar name={name} />
      <span className={className}>
        {isToken ? (isLoading ? 'Loading...' : symbol ? `${symbol} Chat` : name) : name}
      </span>
    </div>
  );
}