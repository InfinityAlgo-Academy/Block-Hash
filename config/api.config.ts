// ============================================
// Block-Hash Config — API Configuration
// ============================================

export interface ApiConfig {
  port: number;
  host: string;
  prefix: string;
  grpcPort: number;
  wsPort: number;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  rateLimit: {
    ttlSeconds: number;
    maxRequests: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  pagination: {
    defaultLimit: number;
    maxLimit: number;
  };
}

export const apiConfig: ApiConfig = {
  port: parseInt(process.env.API_PORT || '3001', 10),
  host: process.env.API_HOST || '0.0.0.0',
  prefix: process.env.API_PREFIX || '/api/v1',
  grpcPort: parseInt(process.env.GRPC_PORT || '50051', 10),
  wsPort: parseInt(process.env.WS_PORT || '3002', 10),
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  rateLimit: {
    ttlSeconds: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-to-a-secure-random-string',
    expiresIn: process.env.JWT_EXPIRATION || '24h',
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
};
