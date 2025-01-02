import { useState } from 'react';
import { X } from 'lucide-react';
import { isAddress } from 'viem';

type OwnerAddressModalProps = {
  roomName: string;
  onSubmit: (ownerAddress: string) => void;
  onClose: () => void;
};

export function OwnerAddressModal({ roomName, onSubmit, onClose }: OwnerAddressModalProps) {
  const [ownerAddress, setOwnerAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddress(ownerAddress)) {
      setError('Please enter a valid Ethereum address');
      return;
    }
    onSubmit(ownerAddress);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Set Room Owner</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner Address for "{roomName}"
            </label>
            <input
              type="text"
              value={ownerAddress}
              onChange={(e) => {
                setOwnerAddress(e.target.value);
                setError(null);
              }}
              placeholder="0x..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {error && (
              <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Set Owner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}