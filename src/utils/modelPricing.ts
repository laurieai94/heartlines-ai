// Model pricing constants for cost calculation
export const MODEL_PRICING = {
  'claude-3-5-sonnet-20241022': {
    input: 0.000003,   // $3 per 1M input tokens
    output: 0.000015,  // $15 per 1M output tokens
  },
  'claude-3-5-haiku-20241022': {
    input: 0.0000008,  // $0.80 per 1M input tokens
    output: 0.000004,  // $4 per 1M output tokens
  },
  'claude-3-opus-20240229': {
    input: 0.000015,   // $15 per 1M input tokens
    output: 0.000075,  // $75 per 1M output tokens
  },
  'claude-opus-4-1-20250805': {
    input: 0.000015,   // $15 per 1M input tokens
    output: 0.000075,  // $75 per 1M output tokens
  },
  'claude-sonnet-4-20250514': {
    input: 0.000003,   // $3 per 1M input tokens
    output: 0.000015,  // $15 per 1M output tokens
  },
  'claude-3-7-sonnet-20250219': {
    input: 0.000003,   // $3 per 1M input tokens
    output: 0.000015,  // $15 per 1M output tokens
  },
  'claude-sonnet-4-5-20250929': {
    input: 0.000003,   // $3 per 1M input tokens
    output: 0.000015,  // $15 per 1M output tokens
  },
  'claude-sonnet-4-5': {
    input: 0.000003,   // $3 per 1M input tokens
    output: 0.000015,  // $15 per 1M output tokens
  }
} as const;

export type ModelName = keyof typeof MODEL_PRICING;

export const calculateTokenCost = (
  model: ModelName,
  inputTokens: number,
  outputTokens: number
): number => {
  const pricing = MODEL_PRICING[model];
  if (!pricing) return 0;
  
  return (inputTokens * pricing.input) + (outputTokens * pricing.output);
};

export const formatCost = (cost: number): string => {
  if (cost < 0.01) {
    return `$${(cost * 1000).toFixed(2)}k`; // Show in thousandths for very small amounts
  }
  return `$${cost.toFixed(4)}`;
};