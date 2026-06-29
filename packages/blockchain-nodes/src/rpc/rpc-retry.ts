import { retryWithBackoff } from '@block-hash/common';

export async function withRpcRetry<T>(
  operation: () => Promise<T>,
  context: string = 'RPC Call'
): Promise<T> {
  return retryWithBackoff(operation, {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    factor: 2
  }).catch((error) => {
    console.error(`[RPC Retry Failed] ${context}:`, error);
    throw error;
  });
}
