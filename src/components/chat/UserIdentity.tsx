import { useFarcasterIdentity } from '../../lib/hooks/useFarcasterIdentity';

type UserIdentityProps = {
  address: string;
  className?: string;
};

export function UserIdentity({ address, className = '' }: UserIdentityProps) {
  const { identity, isLoading } = useFarcasterIdentity(address);
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (isLoading) {
    return <span className={className}>Loading...</span>;
  }

  if (identity.username) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {identity.avatar && (
          <img 
            src={identity.avatar} 
            alt={identity.username}
            className="w-5 h-5 rounded-full"
          />
        )}
        <span>{identity.username}</span>
      </div>
    );
  }

  return <span className={className}>{truncatedAddress}</span>;
}