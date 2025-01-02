import { isAddress } from 'viem';
import { useTokenSymbol } from '../../lib/hooks/useTokenSymbol';

type RoomNameProps = {
  name: string;
  className?: string;
};

export function RoomName({ name, className = '' }: RoomNameProps) {
  const isToken = isAddress(name);
  const { symbol, isLoading } = useTokenSymbol(isToken ? name : null);

  if (!isToken) {
    return <span className={className}>{name}</span>;
  }

  if (isLoading) {
    return <span className={className}>Loading...</span>;
  }

  return (
    <span className={className}>
      {symbol ? `${symbol} Chat` : name}
    </span>
  );
}