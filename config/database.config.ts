// ============================================
// Block-Hash Config — Database Configuration
// ============================================

export interface DatabaseConfig {
  postgres: {
    url: string;
    maxConnections: number;
    connectionTimeout: number;
    idleTimeout: number;
  };
  clickhouse: {
    url: string;
    user: string;
    password: string;
    database: string;
    requestTimeout: number;
    maxOpenConnections: number;
  };
}

export const databaseConfig: DatabaseConfig = {
  postgres: {
    url: process.env.DATABASE_URL || 'postgresql://blockhash:blockhash_secret@localhost:5432/blockhash',
    maxConnections: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '20', 10),
    connectionTimeout: parseInt(process.env.POSTGRES_CONNECTION_TIMEOUT || '10000', 10),
    idleTimeout: parseInt(process.env.POSTGRES_IDLE_TIMEOUT || '30000', 10),
  },
  clickhouse: {
    url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
    user: process.env.CLICKHOUSE_USER || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    database: process.env.CLICKHOUSE_DB || 'blockhash_analytics',
    requestTimeout: parseInt(process.env.CLICKHOUSE_REQUEST_TIMEOUT || '30000', 10),
    maxOpenConnections: parseInt(process.env.CLICKHOUSE_MAX_CONNECTIONS || '10', 10),
  },
};
