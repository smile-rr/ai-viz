export interface MarketItem {
  symbol: string;
  name: string;
  close: number;
  change_pct: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
  history: number[];
}

export interface MarketData {
  date: string;
  generated_at?: string;
  cn_indices: MarketItem[];
  global_indices: MarketItem[];
  fx: MarketItem[];
  commodities: MarketItem[];
  crypto: MarketItem[];
}
