import { useFarcasterIdentity } from '../../lib/hooks/useFarcasterIdentity';
import { UserTooltip } from './UserTooltip';

type UserIdentityProps = {
  address: string;
  className?: string;
  hideAvatar?: boolean;
  showTooltip?: boolean;
};

export function UserIdentity({ 
  address, 
  className = '', 
  hideAvatar = false,
  showTooltip = false 
}: UserIdentityProps) {
  const { identity, isLoading } = useFarcasterIdentity(address);
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (isLoading) {
    return <span className={className}>Loading...</span>;
  }

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      {!hideAvatar && identity.avatar && (
        <img 
          src={identity.avatar} 
          alt={identity.username || truncatedAddress}
          className="w-5 h-5 rounded-full"
        />
      )}
      <span>{identity.username || truncatedAddress}</span>
    </div>
  );

  if (!showTooltip) {
    return content;
  }

  return (
    <UserTooltip 
      address={address}
      farcasterUsername={identity.username}
    >
      {content}
    </UserTooltip>
  );
}