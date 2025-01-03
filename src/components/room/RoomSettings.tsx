import { Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { isAddress } from 'viem';
import { useOnClickOutside } from '../../lib/hooks/useOnClickOutside';
import { uploadRoomAvatar, resetToContractAvatar } from '../../lib/api/avatars';
import { useAuth } from '../auth/useAuth';

type RoomSettingsProps = {
  roomName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function RoomSettings({ roomName, onSuccess, onError }: RoomSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address } = useAuth();

  useOnClickOutside(menuRef, () => setIsOpen(false));

  // Position the dropdown when it opens
  useEffect(() => {
    if (!isOpen || !buttonRef.current || !menuRef.current) return;

    const positionDropdown = () => {
      const button = buttonRef.current?.getBoundingClientRect();
      const dropdown = menuRef.current;
      if (!button || !dropdown) return;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Reset any existing styles
      dropdown.style.top = '';
      dropdown.style.bottom = '';
      dropdown.style.left = '';
      dropdown.style.right = '';

      // Calculate available space
      const spaceBelow = viewportHeight - button.bottom;
      const spaceAbove = button.top;
      const spaceRight = viewportWidth - button.right;

      // Position vertically
      if (spaceBelow >= dropdown.offsetHeight || spaceBelow >= spaceAbove) {
        dropdown.style.top = `${button.bottom + window.scrollY}px`;
      } else {
        dropdown.style.bottom = `${viewportHeight - button.top + window.scrollY}px`;
      }

      // Position horizontally
      if (spaceRight >= dropdown.offsetWidth) {
        dropdown.style.left = `${button.left}px`;
      } else {
        dropdown.style.right = `${viewportWidth - button.right}px`;
      }
    };

    positionDropdown();

    // Update position on scroll or resize
    window.addEventListener('scroll', positionDropdown, true);
    window.addEventListener('resize', positionDropdown);

    return () => {
      window.removeEventListener('scroll', positionDropdown, true);
      window.removeEventListener('resize', positionDropdown);
    };
  }, [isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !address) return;

    setIsUploading(true);
    try {
      await uploadRoomAvatar(roomName, file, address);
      onSuccess?.();
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Upload failed'));
    } finally {
      setIsUploading(false);
      setIsOpen(false);
    }
  };

  const handleReset = async () => {
    if (!address) return;
    
    setIsUploading(true);
    try {
      await resetToContractAvatar(roomName, address);
      onSuccess?.();
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Reset failed'));
    } finally {
      setIsUploading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        disabled={isUploading}
      >
        <Settings size={16} className="text-gray-600" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".png,.jpg,.jpeg,.svg"
        className="hidden"
      />

      {isOpen && (
        <div 
          ref={menuRef}
          className="fixed w-48 bg-white rounded-lg shadow-lg border py-1 z-50"
          style={{ position: 'fixed' }}
        >
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            disabled={isUploading}
          >
            Upload Avatar
          </button>
          
          {isAddress(roomName) && (
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              disabled={isUploading}
            >
              Reset to Contract Avatar
            </button>
          )}
          
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}