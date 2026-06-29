// ============================================
// Block-Hash Database — ClickHouse Analytics Queries
// ============================================

import { getClickHouseClient } from '../client';
import { Chain } from '@block-hash/common';

const ch = () => getClickHouseClient();

/** Get transaction volume by hour for a chain */
export async function getHourlyVolume(chain: Chain, hours = 24) {
  const result = await ch().query({
    query: `
      SELECT
        toStartOfHour(timestamp) AS hour,
        count() AS tx_count,
        uniqExact(from_address) AS unique_senders,
        uniqExact(to_address) AS unique_receivers
      FROM transactions_analytics
      WHERE chain = {chain:String}
        AND timestamp >= now() - INTERVAL {hours:UInt32} HOUR
      GROUP BY hour
      ORDER BY hour ASC
    `,
    query_params: { chain, hours },
    format: 'JSONEachRow',
  });
  return result.json();
}

/** Get top tokens by transfer count */
export async function getTopTokensByTransfers(chain: Chain, limit = 20) {
  const result = await ch().query({
    query: `
      SELECT
        contract_address,
        count() AS transfer_count,
        uniqExact(from_address) AS unique_senders,
        uniqExact(to_address) AS unique_receivers
      FROM token_transfers_analytics
      WHERE chain = {chain:String}
        AND timestamp >= now() - INTERVAL 24 HOUR
      GROUP BY contract_address
      ORDER BY transfer_count DESC
      LIMIT {limit:UInt32}
    `,
    query_params: { chain, limit },
    format: 'JSONEachRow',
  });
  return result.json();
}

/** Get whale movement summary */
export async function getWhaleMovementSummary(chain: Chain, hours = 24) {
  const result = await ch().query({
    query: `
      SELECT
        alert_type,
        count() AS movement_count,
        sum(amount_usd) AS total_usd,
        avg(amount_usd) AS avg_usd,
        max(amount_usd) AS max_usd
      FROM whale_movements
      WHERE chain = {chain:String}
        AND timestamp >= now() - INTERVAL {hours:UInt32} HOUR
      GROUP BY alert_type
      ORDER BY total_usd DESC
    `,
    query_params: { chain, hours },
    format: 'JSONEachRow',
  });
  return result.json();
}

/** Get address activity heatmap (by hour of day and day of week) */
export async function getActivityHeatmap(chain: Chain, days = 30) {
  const result = await ch().query({
    query: `
      SELECT
        toDayOfWeek(timestamp) AS day_of_week,
        toHour(timestamp) AS hour_of_day,
        count() AS tx_count
      FROM transactions_analytics
      WHERE chain = {chain:String}
        AND timestamp >= now() - INTERVAL {days:UInt32} DAY
      GROUP BY day_of_week, hour_of_day
      ORDER BY day_of_week, hour_of_day
    `,
    query_params: { chain, days },
    format: 'JSONEachRow',
  });
  return result.json();
}

/** Get network stats over time */
export async function getNetworkStatsTimeseries(chain: Chain, hours = 168) {
  const result = await ch().query({
    query: `
      SELECT
        hour,
        tx_count,
        unique_addresses,
        total_value_usd,
        avg_gas_price,
        block_count
      FROM hourly_stats
      WHERE chain = {chain:String}
        AND hour >= now() - INTERVAL {hours:UInt32} HOUR
      ORDER BY hour ASC
    `,
    query_params: { chain, hours },
    format: 'JSONEachRow',
  });
  return result.json();
}

/** Insert transaction analytics batch */
export async function insertTransactionAnalytics(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  await ch().insert({
    table: 'transactions_analytics',
    values: rows,
    format: 'JSONEachRow',
  });
}

/** Insert token transfer analytics batch */
export async function insertTokenTransferAnalytics(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  await ch().insert({
    table: 'token_transfers_analytics',
    values: rows,
    format: 'JSONEachRow',
  });
}

/** Insert whale movement records */
export async function insertWhaleMovements(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  await ch().insert({
    table: 'whale_movements',
    values: rows,
    format: 'JSONEachRow',
  });
}
