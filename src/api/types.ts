/**
 * @description Market
 * @example
  {
      "market_addr": "0x030ab74e43dec09f38143df8d7d2aa0b639e1b43a862625a1bcf0a899f836914",
      "market_name": "Equity.US.GLD/USD",
      "sz_decimals": 6,
      "px_decimals": 8,
      "max_leverage": 10,
      "max_open_interest": 100000.0
  }
*/
export type Market = {
  market_addr: string;
  market_name: string;
  sz_decimals: number;
  px_decimals: number;
  max_leverage: number;
  max_open_interest: number;
};

/**
 * @description Account overviews
 * @example
  {
      "perp_equity_balance": 0.0,
      "unrealized_pnl": 0.0,
      "unrealized_funding_cost": -0.0,
      "cross_margin_ratio": 0.0,
      "maintenance_margin": -0.0,
      "cross_account_leverage_ratio": null,
      "volume_30d": null,
      "total_margin": 0.0
  }
*/
export type AccountOverviews = {
  perp_equity_balance: number;
  unrealized_pnl: number;
  unrealized_funding_cost: number;
  cross_margin_ratio: number;
  maintenance_margin: number;
  cross_account_leverage_ratio: number | null;
  volume_30d: number | null;
  total_margin: number;
};

/**
 * @description User position
 * @example
  {
    "market": "0xe6de4f6ec47f1bc2ab73920e9f202953e60482e1c1a90e7eef3ee45c8aafee36",
    "user": "0x60cd94295f7dcc5ca1134542d317909ace5023bc891de280a011166b08964483",
    "size": 10.0,
    "user_leverage": 10,
    "max_allowed_leverage": 10,
    "entry_price": 4.65955151,
    "is_isolated": false,
    "is_deleted": false,
    "unrealized_funding": 0.0,
    "event_uid": 537831222624483505155866631,
    "estimated_liquidation_price": 0.0,
    "transaction_version": 29155889,
    "tp_order_id": null,
    "tp_trigger_price": null,
    "tp_limit_price": null,
    "sl_order_id": null,
    "sl_trigger_price": null,
    "sl_limit_price": null,
    "has_fixed_sized_tpsls": true
  }
*/
export type UserPosition = {
  market: string;
  user: string;
  size: number;
  user_leverage: number;
  max_allowed_leverage: number;
  entry_price: number;
  is_isolated: boolean;
  is_deleted: boolean;
  unrealized_funding: number;
  event_uid: number;
  estimated_liquidation_price: number;
  transaction_version: number;
  tp_order_id: string | null;
  tp_trigger_price: number | null;
  tp_limit_price: number | null;
  sl_order_id: string | null;
  sl_trigger_price: number | null;
  sl_limit_price: number | null;
  has_fixed_sized_tpsls: boolean;
};

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
