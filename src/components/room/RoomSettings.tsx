import { Settings } from 'lucide-react';
import { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address } = useAuth();

  useOnClickOutside(menuRef, () => setIsOpen(false));

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
    <div className="relative" ref={menuRef}>
      <button
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
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
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