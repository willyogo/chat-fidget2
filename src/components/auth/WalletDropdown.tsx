import { useState, useRef, useEffect } from 'react';
import { useAuth } from './useAuth';
import { UserAvatar } from './UserAvatar';
import { useFarcasterIdentity } from '../../lib/hooks/useFarcasterIdentity';
import { useOnClickOutside } from '../../lib/hooks/useOnClickOutside';

export function WalletDropdown() {
  const { login, logout, isAuthenticated, address } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const [dropdownAlignment, setDropdownAlignment] = useState<'right' | 'left'>('right');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { identity } = useFarcasterIdentity(address);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  // Calculate dropdown position
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceRight = viewportWidth - buttonRect.right;
    const dropdownHeight = 180; // Approximate height of dropdown
    const dropdownWidth = 256; // w-64 = 16rem = 256px

    setDropdownPosition(spaceBelow < dropdownHeight ? 'top' : 'bottom');
    setDropdownAlignment(spaceRight < dropdownWidth ? 'left' : 'right');
  }, [isOpen]);

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

  const displayName = identity.username || (address && `${address.slice(0, 4)}...${address.slice(-4)}`);
  const fullAddress = address && `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg transition-colors"
      >
        {address && <UserAvatar address={address} size="sm" />}
        <span className="hidden md:inline text-gray-700">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <div 
          className={`absolute ${
            dropdownPosition === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
          } ${
            dropdownAlignment === 'right' ? 'right-0' : 'left-0'
          } w-64 bg-white rounded-lg shadow-lg border py-2 z-50`}
        >
          <div className="px-4 py-2 border-b">
            <div className="flex items-center gap-2">
              {address && <UserAvatar address={address} />}
              <div className="overflow-hidden">
                {identity.username && (
                  <p className="font-medium text-gray-900 truncate">{identity.username}</p>
                )}
                <p className="text-sm text-gray-600">{fullAddress}</p>
              </div>
            </div>
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