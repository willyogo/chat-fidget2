import { useState } from 'react';
import { X } from 'lucide-react';
import { isAddress } from 'viem';
import { supabase } from '../../lib/auth/supabase';
import { useAuth } from '../auth/useAuth';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Get current auth status
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('Auth status:', {
        authenticated: !!session,
        jwt_claims: session?.user?.user_metadata
      });

      // Attempt update
      const { data, error: updateError } = await supabase
        .from('rooms')
        .update({
          token_address: tokenAddress || null,
          required_tokens: tokenAddress ? requiredTokens : 0,
        })
        .eq('name', roomName)
        .eq('owner_address', normalizedAddress)
        .select();

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log('Update response:', {
        success: true,
        affected_rows: data?.length || 0,
        updated_data: data
      });

      onClose();
    } catch (err) {
      const error = err as Error;
      console.error('Update failed:', error);
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
          )}

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
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