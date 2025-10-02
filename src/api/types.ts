export type PostFeePayerResponse = {
  hash: string;
  sender: string;
  sequence_number: string;
  max_gas_amount: string;
  gas_unit_price: string;
  expiration_timestamp_secs: string;
  payload: {
    type: string;
    function: string;
    type_arguments: any[];
    arguments: any[];
  };
  signature: {
    type: string;
    sender: {
      type: string;
      public_key: string;
      signature: string;
    };
    secondary_signer_addresses: string[];
    secondary_signers: any[];
    fee_payer_address: string;
    fee_payer_signer: {
      type: string;
      public_key: string;
      signature: string;
    };
  };
  replay_protection_: string;
};

/**
 * @description Market sentiment
 * @example
 * {
 *   "long_percentage": 62.0,
 *   "short_percentage": 38.0,
 *   "description": "Based on total position value"
 * }
 */
export type MarketSentiment = {
  long_percentage: number;
  short_percentage: number;
};

/**
 * @description Top performer main position
 * @example
 * {
 *   "asset": "BTC",
 *   "roi": "Infinity%",
 *   "description": "Highest 24h return on investment"
 * }
 */
export type TopPerformerMainPosition = {
  asset: string;
  roi: string;
};

/**
 * @description Asset concentration
 * @example
 * {
 *   "highest_oi": {
 *     "asset": "BTC",
 *     "amount": 906700000
 *   },
 * }
 */
export type AssetConcentration = {
  highest_oi: {
    asset: string;
    amount: number;
  };
  most_traded: {
    asset: string;
    traders: number;
  };
  total_monitored: number;
};

/**
 * @description Trader profitability
 * @example
 * {
 *   "profitable_percentage": 27.4,
 *   "profitable_count": 274,
 *   "total_traders": 1000,
 *   "avg_daily_pnl": 4800
 * }
 */
export type TraderProfitability = {
  profitable_percentage: number;
  profitable_count: number;
  total_traders: number;
  avg_daily_pnl: number;
};

/**
 * @description Dashboard summary
 * @example
 * {
 *   "market_sentiment": {
 *     "long_percentage": 62.0,
 *     "short_percentage": 38.0,
 *     "description": "Based on total position value"
 *   },
 *   "top_performer_main_position": {
 *     "asset": "BTC",
 *     "roi": "Infinity%",
 *     "description": "Highest 24h return on investment"
 *   },
 *   "asset_concentration": {
 *     "highest_oi": {
 *       "asset": "BTC",
 *       "amount": 906700000
 *     },
 *     "most_traded": {
 *       "asset": "ETH",
 *       "traders": 89
 *     },
 *     "total_monitored": 2250000000
 *   },
 *   "trader_profitability": {
 *     "profitable_percentage": 27.4,
 *     "profitable_count": 274,
 *     "total_traders": 1000,
 *     "avg_daily_pnl": 4800
 *   }
 * }
 */
export type DashboardSummary = {
  market_sentiment: MarketSentiment;
  top_performer_main_position: TopPerformerMainPosition;
  asset_concentration: AssetConcentration;
  trader_profitability: TraderProfitability;
};

/**
 * @description PnL data
 * @example
 * {
 *   "amount": 1000,
 *   "percentage": 10
 * }
 */
export type PnLData = {
  amount: number;
  percentage: number;
};

/**
 * @description Direction bias
 * @example
 * {
 *   "long_percentage": 62.0,
 *   "short_percentage": 38.0
 * }
 */
export type DirectionBias = {
  long_percentage: number;
  short_percentage: number;
};

/**
 * @description Main position
 * @example
 * {
 *   "type": "LONG",
 *   "asset": "BTC",
 *   "amount": 1000
 * }
 */
export type MainPosition = {
  type: "LONG" | "SHORT";
  asset: string;
  amount: number;
};

/**
 * @description Trader
 * @example
 * {
 *   "address": "0x1234567890",
 *   "avatar": "https://example.com/avatar.png",
 *   "is_starred": true,
 *   "perp_equity": 1000,
 *   "main_position": {
 *     "type": "LONG",
 *     "asset": "BTC",
 *     "amount": 1000
 *   },
 *   "direction_bias": {
 *     "long_percentage": 62.0,
 *     "short_percentage": 38.0
 *   },
 *   "daily_pnl": {
 *     "amount": 1000,
 *     "percentage": 10
 *   }
 *   "weekly_pnl": {
 *     "amount": 1000,
 *     "percentage": 10
 *   },
 *   "monthly_pnl": {
 *     "amount": 1000,
 *     "percentage": 10
 *   },
 *   "all_time_pnl": {
 *     "amount": 1000,
 *     "percentage": 10
 *   }
 * }
 */
export type Trader = {
  address: string;
  avatar: string;
  is_starred: boolean;
  perp_equity: number;
  main_position: MainPosition | null;
  direction_bias: DirectionBias;
  daily_pnl: PnLData;
  weekly_pnl: PnLData;
  monthly_pnl: PnLData;
  all_time_pnl: PnLData;
};

/**
 * @description Traders response
 * @example
 * {
 *   "traders": [
 *     {
 *       "address": "0x1234567890",
 *       "avatar": "https://example.com/avatar.png",
 *     }
 *   ]
 * }
 */
export type TradersResponse = {
  traders: Trader[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

/**
 * @description Trader stats
 * @example
 * {
 *   "total_traders": 1000,
 *   "total_equity": 1000000,
 *   "profitable_count": 274,
 *   "profitable_percentage": 27.4,
 *   "avg_daily_pnl": 4800,
 *   "total_daily_pnl": 4800000
 * }
 */
export type TraderStats = {
  total_traders: number;
  total_equity: number;
  profitable_count: number;
  profitable_percentage: number;
  avg_daily_pnl: number;
  total_daily_pnl: number;
};

/**
 * @description Asset stats entry
 * @example
 * {
 *   "asset": "BTC",
 *   "total_traders": 1000,
 *   "total_oi": 1000000,
 *   "avg_position": 1000,
 *   "long_count": 274,
 *   "short_count": 38
 * }
 */
export type AssetStatsEntry = {
  asset: string;
  total_traders: number;
  total_oi: number;
  avg_position: number;
  long_count: number;
  short_count: number;
};

export type AssetStats = Record<string, AssetStatsEntry>;

export type ApiResponse<T> = {
  data: T;
  success?: boolean;
};

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
 * @description Open order entry
 * @example
  {
    "parent": "0x123...",
    "market": "0x456...",
    "order_id": "order_789",
    "client_order_id": "maker_1",
    "status": "Open",
    "orig_size": 100.5,
    "remaining_size": 50.25,
    "size_delta": 50.25,
    "price": 1500.75,
    "is_buy": true,
    "is_reduce_only": false,
    "details": "order_details_string",
    "trigger_condition": "",
    "tp_order_id": "order_tp_123",
    "tp_trigger_price": 1600000000,
    "tp_limit_price": 1599000000,
    "sl_order_id": "order_sl_456",
    "sl_trigger_price": 1400000000,
    "sl_limit_price": 1401000000,
    "transaction_version": 12345,
    "unix_ms": 1678886400000
  }
*/
export type OpenOrder = {
  parent: string;
  market: string;
  order_id: string;
  client_order_id?: string | null;
  status: string;
  orig_size: number;
  remaining_size: number;
  size_delta: number;
  price: number;
  is_buy: boolean;
  is_reduce_only: boolean;
  details: string;
  trigger_condition: string;
  tp_order_id: string | null;
  tp_trigger_price: number | null;
  tp_limit_price: number | null;
  sl_order_id: string | null;
  sl_trigger_price: number | null;
  sl_limit_price: number | null;
  transaction_version: number;
  unix_ms: number;
};

/**
 * @description Order detail response
 * @example
  {
    "parent": "0x123...",
    "market": "0x456...",
    "order_id": "order_789",
    "status": "Open",
    "orig_size": 100.5,
    "remaining_size": 50.25,
    "size_delta": 50.25,
    "price": 1500.75,
    "is_buy": true,
    "is_reduce_only": false,
    "details": "order_details_string",
    "trigger_condition": "Price above 1600.00",
    "tp_order_id": "order_tp_123",
    "tp_trigger_price": 1600000000,
    "tp_limit_price": 1599000000,
    "sl_order_id": "order_sl_456",
    "sl_trigger_price": 1400000000,
    "sl_limit_price": 1401000000,
    "transaction_version": 12345,
    "unix_ms": 1678886400000
  }
*/
export type OrderDetail = OpenOrder;

/**
 * @description Trade history entry
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
 * @description Funding rate history entry
 * @example
  {
    "market": "0x123...",
    "action": "CloseLong",
    "size": 100.5,
    "is_funding_positive": false,
    "realized_funding_amount": -10.25,
    "is_rebate": false,
    "fee_amount": 2.5,
    "transaction_unix_ms": 1678886400000
  }
*/
export type FundingRateHistoryEntry = {
  market: string;
  action: string;
  size: number;
  is_funding_positive: boolean;
  realized_funding_amount: number;
  is_rebate: boolean;
  fee_amount: number;
  transaction_unix_ms: number;
};

/**
 * @description Portfolio chart point
 * @example
  {
    "timestamp": 1678886400000,
    "data_points": 10250.75
  }
*/
export type PortfolioChartRange =
  | "1d"
  | "7d"
  | "30d"
  | "90d"
  | "180d"
  | "365d"
  | "all";

export type PortfolioChartDataType = "pnl" | "account_value";

export type PortfolioChartPoint = {
  timestamp: number;
  data_points: number;
};

/**
 * @description Leaderboard item
 * @example
  {
    "rank": 1,
    "account": "0xabc...",
    "account_value": 100000.5,
    "realized_pnl": 5000.25,
    "roi": 0.0525,
    "volume": 1000000
  }
*/
export type LeaderboardItem = {
  rank: number;
  account: string;
  account_value: number;
  realized_pnl: number;
  roi: number;
  volume: number;
};

export type LeaderboardResponse = {
  items: LeaderboardItem[];
  total_count: number;
};

export type LeaderboardSortKey =
  | "account_value"
  | "realized_pnl"
  | "roi"
  | "volume";

export type SortDirection = "ASC" | "DESC";

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

/**
 * @description Asset context snapshot
 * @example
 * {
 *   "market": "APT-USD",
 *   "volume_24h": 10000.5,
 *   "funding_index": 1000000000000000000,
 *   "open_interest": 5000.25,
 *   "mark_price": 1500.75,
 *   "mid_price": 1500.5,
 *   "oracle_price": 1500.25,
 *   "previous_day_price": 1480.0,
 *   "price_change_pct_24h": 1.39,
 *   "price_history": [1480.0, 1485.5, 1490.75]
 * }
 */
export type AssetContext = {
  market: string;
  volume_24h: number;
  funding_index: number;
  open_interest: number;
  mark_price: number;
  mid_price: number;
  oracle_price: number;
  previous_day_price: number;
  price_change_pct_24h: number;
  price_history: number[];
};

/**
 * @description DEX registration info
 * @example
 * {
 *   "dex_addr": "0x789...",
 *   "collateral_name": "USDC",
 *   "collateral_address": "0xdef...",
 *   "collateral_balance_decimals": 6
 * }
 */
export type DexRegistration = {
  dex_addr: string;
  collateral_name: string;
  collateral_address: string;
  collateral_balance_decimals: number;
};

export type MarketCandlesticksInterval =
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "8h"
  | "1d";

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
 * @description Order book depth snapshot
 * @example
 * {
 *   "bids": [
 *     { price: 1500000, size: 1000 },
 *     { price: 1499000, size: 2000 }
 *   ],
 *   "asks": [
 *     { price: 1501000, size: 1500 },
 *     { price: 1502000, size: 3000 }
 *   ]
 * }
 */
export type MarketDepth = {
  bids: { price: number; size: number }[];
  asks: { price: number; size: number }[];
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

export type WebsocketResponseAllMarketPrices = WebsocketResponse<{
  prices: MarketPrice[];
}>;

export type WebsocketResponseMarketCandlestick = WebsocketResponse<{
  candle: MarketCandlesticks;
}>;

export type WebsocketResponseUserOpenOrders = WebsocketResponse<{
  orders: OpenOrder[];
}>;

export type WebsocketResponseUserOrderHistory = WebsocketResponseUserOpenOrders;

export type WebsocketResponseUserPositions = WebsocketResponse<{
  positions: UserPosition[];
}>;

export type WebsocketResponseUsersWithPositions = WebsocketResponse<{
  users: string[];
}>;

export type WebsocketResponseUserTradeHistory = WebsocketResponse<{
  trades: MarketTradeHistory[];
}>;

export type WebsocketResponseMarketTradeHistory =
  WebsocketResponseUserTradeHistory;

export type WebsocketResponseUserFundingRateHistory = WebsocketResponse<{
  funding_rates: FundingRateHistoryEntry[];
}>;

export type WebsocketResponseAccountOverview = WebsocketResponse<{
  account_overview: AccountOverviews;
}>;
