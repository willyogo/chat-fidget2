import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/types/supabase';
import { isAddress } from 'viem';

type Room = Database['public']['Tables']['rooms']['Row'];

type RoomSettingsProps = {
  room: Room;
  onClose: () => void;
};

export function RoomSettings({ room, onClose }: RoomSettingsProps) {
  const [tokenAddress, setTokenAddress] = useState(room.token_address || '');
  const [requiredTokens, setRequiredTokens] = useState(room.required_tokens);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (tokenAddress && !isAddress(tokenAddress)) {
        throw new Error('Invalid token address');
      }

      const { error: updateError } = await supabase
        .from('rooms')
        .update({
          token_address: tokenAddress || null,
          required_tokens: tokenAddress ? requiredTokens : 0,
        })
        .eq('id', room.id);

      if (updateError) throw updateError;
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update room');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Room Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Token Address
              </label>
              <input
                type="text"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="0x..."
              />
            </div>
            {tokenAddress && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Required Tokens
                </label>
                <input
                  type="number"
                  value={requiredTokens}
                  onChange={(e) => setRequiredTokens(Number(e.target.value))}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            )}
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}