import { useState, useRef, useEffect } from 'react';
import { useAuth } from './useAuth';
import { UserAvatar } from './UserAvatar';
import { useFarcasterIdentity } from '../../lib/hooks/useFarcasterIdentity';
import { useOnClickOutside } from '../../lib/hooks/useOnClickOutside';

export function WalletDropdown() {
  const { login, logout, isAuthenticated, address } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { identity } = useFarcasterIdentity(address);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  // Position the dropdown when it opens
  useEffect(() => {
    if (!isOpen || !buttonRef.current || !dropdownRef.current) return;

    const positionDropdown = () => {
      const button = buttonRef.current?.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      if (!button || !dropdown) return;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Get dropdown dimensions after it's rendered
      const dropdownRect = dropdown.getBoundingClientRect();
      const dropdownHeight = dropdownRect.height;
      const dropdownWidth = dropdownRect.width;

      // Calculate available space
      const spaceBelow = viewportHeight - button.bottom;
      const spaceRight = viewportWidth - button.left;

      // Position vertically
      if (spaceBelow >= dropdownHeight) {
        dropdown.style.top = `${button.bottom + window.scrollY}px`;
        dropdown.style.bottom = 'auto';
      } else {
        dropdown.style.bottom = `${viewportHeight - button.top + window.scrollY}px`;
        dropdown.style.top = 'auto';
      }

      // Position horizontally
      if (spaceRight >= dropdownWidth) {
        dropdown.style.left = `${button.left}px`;
        dropdown.style.right = 'auto';
      } else {
        dropdown.style.right = `${viewportWidth - button.right}px`;
        dropdown.style.left = 'auto';
      }
    };

    // Initial positioning
    positionDropdown();

    // Update position on scroll or resize
    window.addEventListener('scroll', positionDropdown, true);
    window.addEventListener('resize', positionDropdown);

    return () => {
      window.removeEventListener('scroll', positionDropdown, true);
      window.removeEventListener('resize', positionDropdown);
    };
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
    <div className="relative">
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
          ref={dropdownRef}
          className="fixed w-64 bg-white rounded-lg shadow-lg border py-2 z-50"
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