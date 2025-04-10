import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { isAddress } from 'viem';
import { supabase } from '../../lib/auth/supabase';
import { useAuth } from '../../components/auth/useAuth';
import { useRoomStore } from '../../lib/store/room';
import { type SupportedNetwork, SUPPORTED_NETWORKS } from '../../lib/config';

type TokenGateModalProps = {
  roomName: string;
  currentTokenAddress: string | null;
  currentRequiredTokens: number;
  onClose: () => void;
};

export function TokenGateModal({
  roomName,
  currentTokenAddress,
  currentRequiredTokens,
  onClose
}: TokenGateModalProps) {
  const { address } = useAuth();
  const [tokenAddress, setTokenAddress] = useState(currentTokenAddress || '');
  const [requiredTokens, setRequiredTokens] = useState(currentRequiredTokens);
  const [network, setNetwork] = useState<SupportedNetwork>('base');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setRoom = useRoomStore(state => state.setRoom);

  // Add debug logging for authentication state
  useEffect(() => {
    async function checkAuthState() {
      const { data: { session } } = await supabase.auth.getSession();
      // console.log('TokenGateModal auth state:', {
      //   userAddress: address,
      //   roomName,
      //   sessionStatus: session ? 'active' : 'none',
      //   sessionUser: session?.user?.id
      // });
    }
    checkAuthState();
  }, [address, roomName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address) {
      setError('Must be authenticated to update room');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Validate token address if provided
      if (tokenAddress && !isAddress(tokenAddress)) {
        throw new Error('Invalid token address format');
      }

      const normalizedAddress = address.toLowerCase();
      const normalizedRoomName = roomName.toLowerCase();

      // Get current auth status
      const { data: { session } } = await supabase.auth.getSession();
      
      // console.log('Update attempt:', {
      //   authenticated: !!session,
      //   userAddress: normalizedAddress,
      //   roomName: normalizedRoomName,
      //   tokenAddress: tokenAddress || null,
      //   requiredTokens: tokenAddress ? requiredTokens : 0,
      //   network
      // });

      // First verify the room exists and user owns it
      const { data: roomCheck, error: checkError } = await supabase
        .from('rooms')
        .select('name, owner_address')
        .eq('name', normalizedRoomName)
        .ilike('owner_address', normalizedAddress) // Use case-insensitive comparison
        .single();

      if (checkError) {
        // console.error('Room check error:', checkError);
        throw new Error(`Failed to verify room ownership: ${checkError.message}`);
      }

      if (!roomCheck) {
        throw new Error('Room not found or you do not have permission to edit it');
      }

      // Attempt update
      const { data, error: updateError } = await supabase
        .from('rooms')
        .update({
          token_address: tokenAddress || null,
          required_tokens: tokenAddress ? requiredTokens : 0,
          token_network: tokenAddress ? network : null,
        })
        .eq('name', normalizedRoomName)
        .ilike('owner_address', normalizedAddress) // Use case-insensitive comparison
        .select('*')
        .single();

      if (updateError) {
        // console.error('Update error:', updateError);
        throw new Error(`Failed to update room: ${updateError.message}`);
      }

      // console.log('Update success:', {
      //   success: true,
      //   updated_data: data
      // });

      // Immediately update the room state to ensure UI updates
      if (data) {
        // console.log('Updating room state with:', data);
        setRoom(data);
      }

      onClose();
    } catch (err) {
      const error = err as Error;
      // console.error('Update failed:', error);
      setError(error.message || 'Failed to update token gate');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Token Gate Settings</h2>
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
              Token Address
            </label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {tokenAddress && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as SupportedNetwork)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Object.entries(SUPPORTED_NETWORKS).map(([key, chain]) => (
                    <option key={key} value={key}>
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Tokens
                </label>
                <input
                  type="number"
                  value={requiredTokens}
                  onChange={(e) => setRequiredTokens(Number(e.target.value))}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle size={16} />
              <p>{error}</p>
            </div>
          )}

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
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}