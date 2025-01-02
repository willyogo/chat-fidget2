import { useAuth } from '../auth/useAuth';
import { LogIn } from 'lucide-react';

export function LoginPrompt() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Chat</h1>
        <p className="text-gray-600 mb-6">Connect your wallet to start chatting</p>
        <button
          onClick={login}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <LogIn size={20} />
          Connect Wallet
        </button>
      </div>
    </div>
  );
}