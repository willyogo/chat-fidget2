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
- 😎 Emoji and GIPHY pickers
- 🖼️ Chat room avatar management system
- 🏆 Chat room leaderboard
- 🏷️ Automatic token name and symbol detection
- 🔍 Smart contract owner detection
- 📝 Manual owner address assignment for non-contract rooms

## Prerequisites

- Node.js 18+
- A Supabase project
- A Privy account
- An Airstack API key
- An Alchemy API key
- An Etherscan API key
- A GIPHY API key

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

### Room Creation
- Create or load rooms directly from the homepage by a name. If a room with that name already exists, it will be loaded instead of created.
- To create a room with query parameters, pass the room name (or contract address) like so:
  1. https://chat-fidget.vercel.app/?room=example
  2. https://chat-fidget.vercel.app/?room=0x48C6740BcF807d6C47C864FaEEA15Ed4dA3910Ab

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
- Room owner can set required token and amount for room access
- Real-time token balance checking
- Automatic token symbol detection
- BaseScan integration for token verification

### Room Avatar
- For contract rooms, app queries 'image' for the default avatar
- Room owners can upload any image <2mb as the avatar

## Database Schema

### Rooms Table
- `name` (text, primary key): Room identifier
- `owner_address` (text): Ethereum address of room owner
- `token_address` (text, optional): ERC20 token address for gating
- `required_tokens` (numeric): Required token balance
- `created_at` (timestamp): Room creation time
- `avatar_url` (text): URL of room avatar
- `avatar_updated_at` (timestamp): Avatar upload time
- `use_contract_avatar` (boolean): True to use the 'image' returned from the contract, False for custom avatar

### Messages Table
- `id` (uuid, primary key): Message identifier
- `room_id` (text): Reference to room name
- `user_address` (text): Sender's Ethereum address
- `content` (text): Message content
- `created_at` (timestamp): Message timestamp
- `farcaster_username` (text, optional): Sender's Farcaster username
- `farcaster_avatar` (text, optional): Sender's Farcaster avatar

### Room Stats Table
- `room_name` (text): Reference to room name
- `message_count` (int8): Number of messages sent in a room
- `unique_users` (int8): Number of unique users that have sent at least 1 message in a room
- `last_message_at` (timestamp): Last message timestamp

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
- [Alchemy](https://www.alchemy.com/) for RPC access
- [GIPHY](https://giphy.com) for GIFs
- [Bolt](https://bolt.net) for writing 100% of the code (and most of this readme 😄)
