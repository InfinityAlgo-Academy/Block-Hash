# Block-Hash Intelligence

A highly scalable, multi-chain data indexing and AI-driven analytics platform.

## Supported Chains
- Ethereum
- BNB Chain
- Polygon
- Arbitrum
- Base
- Avalanche
- Solana
- Bitcoin
- Tron

## Architecture Overview
Block-Hash uses a monorepo structure with the following packages:
- `common`: Shared types, constants, and utilities.
- `database`: Repositories and clients for PostgreSQL, Redis, and ClickHouse.
- `blockchain-nodes`: Connection managers, RPC load balancers, and WebSocket handlers.
- `data-collector`: High-speed data ingestors for blocks, transactions, logs, and mempool.
- `processing-pipeline`: AI and heuristic-based analytics engines (Whale tracking, Smart Money).
- `api-server`: NestJS REST/WebSocket server for querying analytics.
- `frontend`: Next.js dashboard for visualizing data and alerts.

## Infrastructure
- **PostgreSQL**: Stores stateful data (Users, Wallets, Tokens, Smart Money Profiles).
- **ClickHouse**: Stores time-series data (Transaction volume, Token transfers, High-speed analytics).
- **Redis**: Used for high-speed caching and real-time Pub/Sub event broadcasting between microservices.

## Getting Started

1. Copy `.env.example` to `.env` and fill in your RPC URLs and OpenAI API Key.
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Run the setup script to install dependencies, start infrastructure, and migrate databases.
   \`\`\`bash
   chmod +x ./scripts/setup.sh
   ./scripts/setup.sh
   \`\`\`

3. Start the services (API and Frontend).
   \`\`\`bash
   chmod +x ./scripts/start-all.sh
   ./scripts/start-all.sh
   \`\`\`
