# Architecture Notes

The platform is designed to handle thousands of transactions per second across multiple chains.

## Data Flow
1. **Blockchain Nodes**: Configured in `config/chain.config.ts`. The `NodeManager` handles fallback RPCs and reconnect logic.
2. **Data Collector**: Subscribes to new blocks (via polling or WS) and pending transactions. Decodes raw data using ABI registries.
3. **Message Bus (Redis Pub/Sub)**: Collectors publish normalized data (`bh:events:new_transaction`, etc.) to Redis.
4. **Processing Pipeline**: Subscribes to Redis events. Runs heuristic engines (Whale Tracker, Smart Money) and AI models (`TransactionRanker`) asynchronously. Generates insights and saves to DB.
5. **Database**: 
   - Write-heavy analytics go to ClickHouse (`insertTransactionAnalytics`).
   - Relational profiles go to PostgreSQL (`walletRepository.upsert`).
6. **API Server**: Exposes REST endpoints (fetching from ClickHouse/Postgres) and WebSocket gateways (bridging Redis Pub/Sub to clients).
7. **Frontend**: Subscribes to the API Server's WebSocket to display real-time feeds and queries REST for historical charts.
