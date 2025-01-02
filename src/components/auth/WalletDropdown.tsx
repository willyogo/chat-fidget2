import { Menu } from 'lucide-react';
import { useAuth } from './useAuth';
import { UserIdentity } from '../chat/UserIdentity';

export function WalletDropdown() {
  const { login, logout, isAuthenticated, address } = useAuth();

  if (!isAuthenticated) {
    return (
      <button
        onClick={login}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
        {address && <UserIdentity address={address} />}
        <Menu size={20} />
      </button>
      <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <button
          onClick={logout}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}