# Token-Gated Chat Rooms

Real-time chat app where room owners can gate access using ERC20 tokens on Base. Built with React, Supabase, and Privy to power the Chat Fidget for [nounspace.com](https://nounspace.com), but works anywhere. 100% of the code was written by https://bolt.new with supervision from [@willywonka.eth](https://nounspace.com/s/willywonka.eth) and [@sktbrd.eth](https://www.nounspace.com/s/skateboard).

👾🚀🌈

## Features

- 💬 Real-time chat rooms with automatic message updates
- 🔒 Token-gating with ERC20 tokens on Base
- 👤 Web3 authentication with Privy
- 🎭 Farcaster identity integration
- ⚡ Real-time updates with Supabase
- 🎨 Beautiful UI with Tailwind CSS
- 🏷️ Automatic token name and symbol detection
- 🔍 Smart contract owner detection
- 📝 Manual owner address assignment for non-contract rooms
<<<<<<< HEAD
- 🔐 Case-insensitive address handling
=======
>>>>>>> 8f502ee7f7b83a13a10cc825211e06b819b4187b

## Prerequisites

- Node.js 18+
- A Supabase project
- A Privy account
- An Airstack API key
- An Alchemy API key
- An Etherscan API key

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_AIRSTACK_API_KEY=your_airstack_api_key
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/token-gated-chat.git
   cd token-gated-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── chat/          # Chat-related components
│   └── room/          # Room management components
├── lib/               # Utility functions and hooks
│   ├── airstack/      # Airstack API integration
│   ├── api/           # API functions
│   ├── auth/          # Authentication utilities
│   ├── contracts/     # Smart contract interactions
│   ├── etherscan/     # Etherscan API integration
│   ├── hooks/         # Custom React hooks
│   ├── store/         # State management
│   └── types/         # TypeScript type definitions
└── main.tsx           # Application entry point
```

## Room Creation & Management

<<<<<<< HEAD
=======
### Room Creation
- To create a room, pass the name of the room as a query parameter, like so:
  1. https://chat-fidget.vercel.app/?room=example
  2. https://chat-fidget.vercel.app/?room=0x48C6740BcF807d6C47C864FaEEA15Ed4dA3910Ab

>>>>>>> 8f502ee7f7b83a13a10cc825211e06b819b4187b
### Automatic Owner Detection
- For contract addresses: Automatically detects owner through:
  1. `deployer()` function call
  2. `owner()` function call
  3. Contract creation transaction
  4. Etherscan API fallback

### Manual Owner Assignment
- For non-contract rooms or when automatic detection fails
- Prompts user to input owner address
- Handles addresses case-insensitively

### Token Gating
- Set required token and amount for room access
- Real-time token balance checking
- Automatic token symbol detection
- BaseScan integration for token verification

## Database Schema

### Rooms Table
- `name` (text, primary key): Room identifier
- `owner_address` (text): Ethereum address of room owner
- `token_address` (text, optional): ERC20 token address for gating
- `required_tokens` (numeric): Required token balance
- `created_at` (timestamp): Room creation time

### Messages Table
- `id` (uuid, primary key): Message identifier
- `room_id` (text): Reference to room name
- `user_address` (text): Sender's Ethereum address
- `content` (text): Message content
- `created_at` (timestamp): Message timestamp
- `farcaster_username` (text, optional): Sender's Farcaster username
- `farcaster_avatar` (text, optional): Sender's Farcaster avatar

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

### Development Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use TypeScript for type safety
- Keep components small and focused
- Extract reusable logic into hooks

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- [Privy](https://privy.io/) for Web3 authentication
- [Supabase](https://supabase.io/) for real-time database
- [Airstack](https://airstack.xyz/) for Web3 data
- [Base](https://base.org/) for L2 infrastructure
- [Etherscan](https://etherscan.io/) for contract verification
<<<<<<< HEAD
- [Alchemy](https://www.alchemy.com/) for RPC access
=======
- [Alchemy](https://www.alchemy.com/) for RPC access
>>>>>>> 8f502ee7f7b83a13a10cc825211e06b819b4187b
