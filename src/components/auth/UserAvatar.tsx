import { Wallet } from 'lucide-react';
import { useFarcasterIdentity } from '../../lib/hooks/useFarcasterIdentity';

type UserAvatarProps = {
  address: string;
  size?: 'sm' | 'md';
};

export function UserAvatar({ address, size = 'md' }: UserAvatarProps) {
  const { identity } = useFarcasterIdentity(address);
  const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  if (identity.avatar) {
    return (
      <img 
        src={identity.avatar}
        alt={identity.username || address}
        className={`${sizeClass} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-indigo-100 flex items-center justify-center`}>
      <Wallet className="w-4 h-4 text-indigo-600" />
    </div>
  );
}