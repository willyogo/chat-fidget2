import { useState } from 'react';
import { useAuth } from './useAuth';
import { UserIdentity } from '../chat/UserIdentity';
import { UserAvatar } from './UserAvatar';

export function WalletDropdown() {
  const { login, logout, isAuthenticated, address } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <button
        onClick={login}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
      >
        Connect
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg transition-colors"
      >
        {address && <UserAvatar address={address} size="sm" />}
        <span className="hidden md:inline">
          {address && <UserIdentity address={address} hideAvatar />}
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg border"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-4 py-2 border-b md:hidden">
            {address && <UserIdentity address={address} />}
          </div>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}