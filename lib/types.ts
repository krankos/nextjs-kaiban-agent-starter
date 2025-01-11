export interface TeamOutput {
  status: 'FINISHED' | 'BLOCKED' | string;
  result?: string;
  stats?: {
    costDetails: {
      totalCost: number;
    };
    llmUsageStats: {
      inputTokens: number;
      outputTokens: number;
    };
    duration: number;
  };
} 