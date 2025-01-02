# Token-Gated Chat Rooms

A decentralized chat application where room owners can gate access using ERC20 tokens on Base. Built with React, Supabase, and Privy.

![Token-Gated Chat](https://images.unsplash.com/photo-1611462985358-60d3498e0364?auto=format&fit=crop&q=80&w=2000)

## Features

- 💬 Real-time chat rooms
- 🔒 Token-gating with ERC20 tokens on Base
- 👤 Web3 authentication with Privy
- 🎭 Farcaster identity integration
- ⚡ Real-time updates with Supabase
- 🎨 Beautiful UI with Tailwind CSS

## Prerequisites

- Node.js 18+
- A Supabase project
- A Privy account
- An Airstack API key
- An Alchemy API key

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_AIRSTACK_API_KEY=your_airstack_api_key
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
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
│   ├── contracts/     # Smart contract interactions
│   ├── hooks/         # Custom React hooks
│   └── types/         # TypeScript type definitions
└── main.tsx           # Application entry point
```

## Database Schema

The application uses two main tables in Supabase:

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