import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { uploadRoomAvatar, resetToContractAvatar } from '../../lib/api/avatars';
import { useAuth } from '../auth/useAuth';

type RoomAvatarUploadProps = {
  roomName: string;
  onSuccess: (url: string) => void;
  onError: (error: Error) => void;
};

export function RoomAvatarUpload({ roomName, onSuccess, onError }: RoomAvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !address) return;

    setIsUploading(true);
    try {
      const url = await uploadRoomAvatar(roomName, file, address);
      onSuccess(url);
    } catch (err) {
      onError(err instanceof Error ? err : new Error('Upload failed'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = async () => {
    if (!address) return;
    
    setIsUploading(true);
    try {
      await resetToContractAvatar(roomName, address);
      onSuccess('');
    } catch (err) {
      onError(err instanceof Error ? err : new Error('Reset failed'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".png,.jpg,.jpeg,.svg"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        Upload Avatar
      </button>
      <button
        onClick={handleReset}
        disabled={isUploading}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Reset to Contract Avatar
      </button>
    </div>
  );
}