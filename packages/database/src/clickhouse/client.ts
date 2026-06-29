// ============================================
// Block-Hash Database — ClickHouse Client
// ============================================

import { createClient, ClickHouseClient } from '@clickhouse/client';

let client: ClickHouseClient | null = null;

/** Get or create a ClickHouse client singleton */
export function getClickHouseClient(): ClickHouseClient {
  if (!client) {
    client = createClient({
      url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
      username: process.env.CLICKHOUSE_USER || 'default',
      password: process.env.CLICKHOUSE_PASSWORD || '',
      database: process.env.CLICKHOUSE_DB || 'blockhash_analytics',
      request_timeout: parseInt(process.env.CLICKHOUSE_REQUEST_TIMEOUT || '30000', 10),
      max_open_connections: parseInt(process.env.CLICKHOUSE_MAX_CONNECTIONS || '10', 10),
      clickhouse_settings: {
        async_insert: 1,
        wait_for_async_insert: 0,
      },
    });
  }
  return client;
}

/** Initialize ClickHouse tables */
export async function initializeClickHouse(): Promise<void> {
  const ch = getClickHouseClient();

  // Analytics table for high-volume time-series data
  await ch.command({
    query: `
      CREATE TABLE IF NOT EXISTS transactions_analytics (
        chain LowCardinality(String),
        block_number UInt64,
        tx_hash String,
        from_address String,
        to_address Nullable(String),
        value String,
        gas_price Nullable(String),
        gas_used Nullable(String),
        tx_type LowCardinality(String),
        status UInt8,
        timestamp DateTime,
        date Date MATERIALIZED toDate(timestamp)
      ) ENGINE = MergeTree()
      PARTITION BY (chain, toYYYYMM(timestamp))
      ORDER BY (chain, timestamp, block_number)
      TTL timestamp + INTERVAL 365 DAY
    `,
  });

  // Token transfer analytics
  await ch.command({
    query: `
      CREATE TABLE IF NOT EXISTS token_transfers_analytics (
        chain LowCardinality(String),
        contract_address String,
        from_address String,
        to_address String,
        value String,
        tx_hash String,
        standard LowCardinality(String),
        timestamp DateTime,
        date Date MATERIALIZED toDate(timestamp)
      ) ENGINE = MergeTree()
      PARTITION BY (chain, toYYYYMM(timestamp))
      ORDER BY (chain, contract_address, timestamp)
      TTL timestamp + INTERVAL 365 DAY
    `,
  });

  // Whale movement analytics
  await ch.command({
    query: `
      CREATE TABLE IF NOT EXISTS whale_movements (
        chain LowCardinality(String),
        from_address String,
        to_address String,
        token String,
        amount String,
        amount_usd Float64,
        alert_type LowCardinality(String),
        tx_hash String,
        timestamp DateTime,
        date Date MATERIALIZED toDate(timestamp)
      ) ENGINE = MergeTree()
      PARTITION BY (chain, toYYYYMM(timestamp))
      ORDER BY (chain, timestamp)
    `,
  });

  // Aggregated statistics (pre-computed)
  await ch.command({
    query: `
      CREATE TABLE IF NOT EXISTS hourly_stats (
        chain LowCardinality(String),
        hour DateTime,
        tx_count UInt64,
        unique_addresses UInt64,
        total_value_usd Float64,
        avg_gas_price Float64,
        block_count UInt32,
        token_transfer_count UInt64
      ) ENGINE = SummingMergeTree()
      PARTITION BY toYYYYMM(hour)
      ORDER BY (chain, hour)
    `,
  });

  console.log('[ClickHouse] Tables initialized successfully');
}

/** Close ClickHouse connection */
export async function closeClickHouse(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
