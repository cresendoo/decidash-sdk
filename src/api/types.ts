/**
 * @description Market trade history
 * @example
  {
    "account": "0x47182c30c91a9d43bd6e528b25af98d032f1494b8c5c19c869a997f056d19ec5",
    "market": "0xe6de4f6ec47f1bc2ab73920e9f202953e60482e1c1a90e7eef3ee45c8aafee36",
    "action": "OpenShort",
    "size": 1.0,
    "price": 4.34392243,
    "is_profit": true,
    "realized_pnl_amount": 0.0,
    "is_funding_positive": true,
    "realized_funding_amount": 0.0,
    "is_rebate": false,
    "fee_amount": 13031,
    "transaction_unix_ms": 1757306191838,
    "transaction_version": 58168818
  }
*/
export type MarketTradeHistory = {
  account: string;
  market: string;
  action: string;
  size: number;
  price: number;
  is_profit: boolean;
  realized_pnl_amount: number;
  is_funding_positive: boolean;
  realized_funding_amount: number;
  is_rebate: boolean;
  fee_amount: number;
  transaction_unix_ms: number;
  transaction_version: number;
};

/**
 * @description Market price
 * @example
  {
    "market": "0x6a39745aaa7af8258060566f6501d84581de815128694f8ee013cae28e3357e7",
    "oracle_px": 110983.614149,
    "mark_px": 110984.51889936,
    "mid_px": 110984.51889936,
    "funding_index": 170141183460469231731846901462696564566,
    "funding_rate_bps": 12,
    "is_funding_positive": true,
    "transaction_unix_ms": 1757310980804,
    "open_interest": 6.785860303
  }
]
*/
export type MarketPrice = {
  market: string;
  oracle_px: number;
  mark_px: number;
  mid_px: number;
  funding_index: number;
  funding_rate_bps: number;
  is_funding_positive: boolean;
  transaction_unix_ms: number;
  open_interest: number;
};

export type MarketCandlesticksInterval = "1m" | "15m" | "1h" | "4h" | "1d";

/** 
 * @description Market Candlesticks
 * @example
  {
      "t": 1757224680000,
      "T": 1757224739999,
      "o": 4294.89845674,
      "h": 4297.0467653,
      "l": 4294.48418914,
      "c": 4295.81487816,
      "v": 0.1629714,
      "i": "1m"
  } 
*/
export type MarketCandlesticks = {
  t: number; // Start time
  T: number; // End time
  o: number; // Open price
  h: number; // High price
  l: number; // Low price
  c: number; // Close price
  v: number; // Volume
  i: MarketCandlesticksInterval; // Interval
};

/**
 * @description Market Depth
 * @example
  {"Subscribe":{"topic":"market_depth:0xe6de4f6ec47f1bc2ab73920e9f202953e60482e1c1a90e7eef3ee45c8aafee36"}}
  {"Unsubscribe":{"topic":"market_depth:0x6a39745aaa7af8258060566f6501d84581de815128694f8ee013cae28e3357e7"}}
*/
export type WebsocketSubscribeMessage = {
  Subscribe?: { topic: string };
  Unsubscribe?: { topic: string };
};

export type WebsocketSubscribeResponse = {
  SubscribeResponse?: {
    success: boolean;
    message: string;
  };
};

export type WebsocketResponse<T = Record<string, never>> = {
  topic: string;
} & T;

/**
 * @description Market Depth
 * @example
  {
    "topic": "market_depth:0xe6de4f6ec47f1bc2ab73920e9f202953e60482e1c1a90e7eef3ee45c8aafee36",
    "bids": [
      {
        "price": 4.32204129,
        "size": 7712.4051
      },
      {
        "price": 3.0,
        "size": 10.0
      }
    ],
    "asks": [
      {
        "price": 4.32290578,
        "size": 7710.86277
      },
      {
        "price": 4.32333803,
        "size": 6168.07347
      }
    ]
  }
*/
export type WebsocketResponseMarketDepth = WebsocketResponse<{
  bids: { price: number; size: number }[];
  asks: { price: number; size: number }[];
}>;

/**
 * @description Market Price
 * @example
{
  "topic": "market_price:0xe6de4f6ec47f1bc2ab73920e9f202953e60482e1c1a90e7eef3ee45c8aafee36",
  "price": {
    "market": "0xe6de4f6ec47f1bc2ab73920e9f202953e60482e1c1a90e7eef3ee45c8aafee36",
    "oracle_px": 4.32250672,
    "mark_px": 4.31850427,
    "mid_px": 4.32247353,
    "funding_index": 170141183460469231731686915903960058764,
    "funding_rate_bps": 12,
    "is_funding_positive": true,
    "transaction_unix_ms": 1757313688077,
    "open_interest": 0.0
  }
}*/
export type WebsocketResponseMarketPrice = WebsocketResponse<{
  price: {
    market: string;
    oracle_px: number;
    mark_px: number;
    mid_px: number;
    funding_index: number;
    funding_rate_bps: number;
    is_funding_positive: boolean;
    transaction_unix_ms: number;
    open_interest: number;
  };
}>;
