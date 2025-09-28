# DeciDash SDK REST & WebSocket APIs (Non-Contract)

---

## Traders API (DeciDash)

### 1. GET `/api/v1/traders/dashboard`

트레이더 대시보드 요약

#### Query Parameters
- 없음

#### Response Example
```json
{
  "data": {
    "market_sentiment": {
      "long_percentage": 62.0,
      "short_percentage": 38.0,
      "description": "Based on total position value"
    },
    "top_performer_main_position": {
      "asset": "BTC",
      "roi": "Infinity%",
      "description": "Highest 24h return on investment"
    },
    "asset_concentration": {
      "highest_oi": { "asset": "BTC", "amount": 906700000 },
      "most_traded": { "asset": "ETH", "traders": 89 },
      "total_monitored": 2250000000
    },
    "trader_profitability": {
      "profitable_percentage": 27.4,
      "profitable_count": 274,
      "total_traders": 1000,
      "avg_daily_pnl": 4800
    }
  }
}
```
> 실제 응답은 `ApiResponse<DashboardSummary>` 구조이며 description 필드는 백엔드 구현에 따라 생략될 수 있습니다.

---

### 2. GET `/api/v1/traders`

트레이더 목록 조회

#### Query Parameters
- `page` (optional, default 1)
- `per_page` (optional, default 20)
- `search` (optional)
- `sort_by` (optional: `account_value` | `realized_pnl` | `roi` | `volume`)
- `sort_desc` (optional, `true`/`false`, default `false`)

#### Response Example
```json
{
  "data": {
    "traders": [
      {
        "address": "0x1234567890",
        "avatar": "https://example.com/avatar.png",
        "is_starred": true,
        "perp_equity": 1000,
        "main_position": { "type": "LONG", "asset": "BTC", "amount": 2.5 },
        "direction_bias": { "long_percentage": 62.0, "short_percentage": 38.0 },
        "daily_pnl": { "amount": 120.5, "percentage": 0.12 },
        "weekly_pnl": { "amount": 540.2, "percentage": 0.56 },
        "monthly_pnl": { "amount": 1620.1, "percentage": 1.7 },
        "all_time_pnl": { "amount": 5400.0, "percentage": 4.8 }
      }
    ],
    "total": 240,
    "page": 1,
    "per_page": 20,
    "total_pages": 12
  }
}
```

---

### 3. GET `/api/v1/traders/{address}`

트레이더 상세 조회

#### Query Parameters
- 없음 (주소는 path 변수)

#### Response Example
```json
{
  "data": {
    "address": "0x1234567890",
    "avatar": "https://example.com/avatar.png",
    "is_starred": false,
    "perp_equity": 860.5,
    "main_position": null,
    "direction_bias": { "long_percentage": 45.0, "short_percentage": 55.0 },
    "daily_pnl": { "amount": -12.3, "percentage": -0.014 },
    "weekly_pnl": { "amount": 48.1, "percentage": 0.056 },
    "monthly_pnl": { "amount": 120.0, "percentage": 0.14 },
    "all_time_pnl": { "amount": 900.0, "percentage": 1.05 }
  }
}
```

---

### 4. GET `/api/v1/traders/stats`

트레이더 통계 조회

#### Query Parameters
- 없음

#### Response Example
```json
{
  "data": {
    "total_traders": 1000,
    "total_equity": 1000000,
    "profitable_count": 274,
    "profitable_percentage": 27.4,
    "avg_daily_pnl": 4800,
    "total_daily_pnl": 4800000
  }
}
```

---

### 5. GET `/api/v1/traders/assets/stats`

자산별 트레이더 통계

#### Query Parameters
- 없음

#### Response Example
```json
{
  "data": {
    "BTC": {
      "asset": "BTC",
      "total_traders": 1000,
      "total_oi": 1000000,
      "avg_position": 1000,
      "long_count": 274,
      "short_count": 38
    },
    "ETH": {
      "asset": "ETH",
      "total_traders": 820,
      "total_oi": 640000,
      "avg_position": 780,
      "long_count": 410,
      "short_count": 30
    }
  }
}
```

---

## Account API (Trading VM)

### 6. GET `/api/v1/account_overviews`

계좌 개요 조회

#### Query Parameters
- `user` (required)

#### Response Example
```json
{
  "perp_equity_balance": 0.0,
  "unrealized_pnl": 0.0,
  "unrealized_funding_cost": 0.0,
  "cross_margin_ratio": 0.0,
  "maintenance_margin": 0.0,
  "cross_account_leverage_ratio": null,
  "volume_30d": null,
  "total_margin": 0.0
}
```

---

### 7. GET `/api/v1/user_positions`

계좌 포지션 조회

#### Query Parameters
- `user` (required)
- `include_deleted` (required, `true`/`false`)
- `limit` (required)
- `market_address` (optional)

#### Response Example
```json
[
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
]
```

---

### 8. GET `/api/v1/open_orders`

미체결 주문 조회

#### Query Parameters
- `user` (required)

#### Response Example
```json
[
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
]
```

---

### 9. GET `/api/v1/orders`

주문 상세 조회

#### Query Parameters
- `order_id` (required)
- `market_address` (required)

#### Response Example
```json
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
```

---

### 10. GET `/api/v1/trade_history`

사용자 체결 이력

#### Query Parameters
- `user` (required)
- `limit` (optional, default 10)

#### Response Example
```json
[
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
]
```

---

### 11. GET `/api/v1/funding_rate_history`

펀딩 이력

#### Query Parameters
- `user` (required)
- `limit` (optional, default 10)

#### Response Example
```json
[
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
]
```

---

### 12. GET `/api/v1/portfolio_chart`

포트폴리오 차트 데이터

#### Query Parameters
- `user` (required)
- `range` (required: `1d` | `7d` | `30d` | `90d` | `180d` | `365d` | `all`)
- `data_type` (required: `pnl` | `account_value`)

#### Response Example
```json
[
  { "timestamp": 1678886400000, "data_points": 10250.75 },
  { "timestamp": 1678890000000, "data_points": 10320.12 }
]
```

---

## Market API (Trading VM)

### 13. GET `/api/v1/markets`

마켓 목록

#### Query Parameters
- 없음

#### Response Example
```json
[
  {
    "market_addr": "0x030ab74e43dec09f38143df8d7d2aa0b639e1b43a862625a1bcf0a899f836914",
    "market_name": "Equity.US.GLD/USD",
    "sz_decimals": 6,
    "px_decimals": 8,
    "max_leverage": 10,
    "max_open_interest": 100000.0
  }
]
```

---

### 14. GET `/api/v1/market_trade_history`

마켓 체결 이력

#### Query Parameters
- `market` (required)
- `limit` (optional, default 10)

#### Response Example
```json
[
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
]
```

---

### 15. GET `/api/v1/prices`

마켓 가격

#### Query Parameters
- `market` (optional)

#### Response Example
```json
[
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
```

---

### 16. GET `/api/v1/depths`

마켓 오더북 깊이

#### Query Parameters
- `market` (required)
- `limit` (optional)

#### Response Example
```json
{
  "bids": [
    { "price": 1500000, "size": 1000 },
    { "price": 1499000, "size": 2000 }
  ],
  "asks": [
    { "price": 1501000, "size": 1500 },
    { "price": 1502000, "size": 3000 }
  ]
}
```

---

### 17. GET `/api/v1/candlesticks`

마켓 캔들 데이터

#### Query Parameters
- `market` (required)
- `interval` (required: `1m` | `5m` | `15m` | `30m` | `1h` | `2h` | `4h` | `8h` | `1d`)
- `startTime` (required, ms)
- `endTime` (required, ms)

#### Response Example
```json
[
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
]
```

---

### 18. GET `/api/v1/asset_contexts`

자산 컨텍스트

#### Query Parameters
- `market` (optional)

#### Response Example
```json
[
  {
    "market": "APT-USD",
    "volume_24h": 10000.5,
    "funding_index": 1000000000000000000,
    "open_interest": 5000.25,
    "mark_price": 1500.75,
    "mid_price": 1500.5,
    "oracle_price": 1500.25,
    "previous_day_price": 1480.0,
    "price_change_pct_24h": 1.39,
    "price_history": [1480.0, 1485.5, 1490.75]
  }
]
```

---

### 19. GET `/api/v1/dex`

DEX 등록 정보

#### Query Parameters
- 없음

#### Response Example
```json
{
  "dex_addr": "0x789...",
  "collateral_name": "USDC",
  "collateral_address": "0xdef...",
  "collateral_balance_decimals": 6
}
```

---

### 20. GET `/api/v1/leaderboard`

리더보드

#### Query Parameters
- `sort_key` (optional: `account_value` | `realized_pnl` | `roi` | `volume`)
- `sort_dir` (optional: `ASC` | `DESC`)
- `limit` (optional)
- `offset` (optional)

#### Response Example
```json
{
  "items": [
    {
      "rank": 1,
      "account": "0xabc...",
      "account_value": 100000.5,
      "realized_pnl": 5000.25,
      "roi": 0.0525,
      "volume": 1000000
    }
  ],
  "total_count": 120
}
```

---

## Fee Payer API

### 21. POST `/transactions`

수수료 대납 트랜잭션 제출 (`tradingVM.FeePayerURL` 호스트)

#### Request Body Example
```json
{
  "signature": [12, 34, 56, 78],
  "transaction": [1, 0, 255, 18]
}
```

#### Response Notes
- SDK는 Fee Payer 서비스의 응답을 그대로 반환합니다. 성공 시 200 OK JSON, 실패 시 상태 코드에 맞는 에러가 전달됩니다.

---

## WebSocket Topics (Trading WS)

연결: `wss://trading-api-ws-dev-netna-us-central1-410192433417.us-central1.run.app/`

- Subscribe 예시: `{"Subscribe":{"topic":"market_price:MARKET_ADDR"}}`
- Unsubscribe 예시: `{"Unsubscribe":{"topic":"market_price:MARKET_ADDR"}}`

### Topic 목록 및 샘플 이벤트

#### 1. `market_depth:{market}`
```json
{
  "topic": "market_depth:0xe6de4f6ec47f1bc2ab73920e9f202953e60482e1c1a90e7eef3ee45c8aafee36",
  "bids": [
    { "price": 4.32204129, "size": 7712.4051 },
    { "price": 3.0, "size": 10.0 }
  ],
  "asks": [
    { "price": 4.32290578, "size": 7710.86277 },
    { "price": 4.32333803, "size": 6168.07347 }
  ]
}
```

#### 2. `market_price:{market}`
```json
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
}
```

#### 3. `all_market_prices`
```json
{
  "topic": "all_market_prices",
  "prices": [
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
}
```

#### 4. `market_candlestick:{market}:{interval}`
```json
{
  "topic": "market_candlestick:0xe6de4f6ec47f1bc2ab73920e9f202953e60482e1c1a90e7eef3ee45c8aafee36:1m",
  "candle": {
    "t": 1757224680000,
    "T": 1757224739999,
    "o": 4294.89845674,
    "h": 4297.0467653,
    "l": 4294.48418914,
    "c": 4295.81487816,
    "v": 0.1629714,
    "i": "1m"
  }
}
```

#### 5. `user_open_orders:{user}` (동일 구조: `user_order_history:{user}`)
```json
{
  "topic": "user_open_orders:0x60cd94295f7dcc5ca1134542d317909ace5023bc891de280a011166b08964483",
  "orders": [
    {
      "parent": "0x123...",
      "market": "0x456...",
      "order_id": "order_789",
      "status": "Open",
      "orig_size": 100.5,
      "remaining_size": 50.25,
      "price": 1500.75,
      "is_buy": true,
      "unix_ms": 1678886400000
    }
  ]
}
```

#### 6. `user_positions:{user}`
```json
{
  "topic": "user_positions:0x60cd94295f7dcc5ca1134542d317909ace5023bc891de280a011166b08964483",
  "positions": [
    {
      "market": "0xe6de4f6e...",
      "user": "0x60cd9429...",
      "size": 10.0,
      "user_leverage": 10,
      "entry_price": 4.65955151,
      "is_isolated": false,
      "is_deleted": false
    }
  ]
}
```

#### 7. `users_with_positions`
```json
{
  "topic": "users_with_positions",
  "users": [
    "0x60cd94295f7dcc5ca1134542d317909ace5023bc891de280a011166b08964483",
    "0x47182c30c91a9d43bd6e528b25af98d032f1494b8c5c19c869a997f056d19ec5"
  ]
}
```

#### 8. `user_trade_history:{user}` (동일 구조: `market_trade_history:{market}`)
```json
{
  "topic": "user_trade_history:0x60cd94295f7dcc5ca1134542d317909ace5023bc891de280a011166b08964483",
  "trades": [
    {
      "account": "0x47182c30c91a9d43bd6e528b25af98d032f1494b8c5c19c869a997f056d19ec5",
      "market": "0xe6de4f6e...",
      "action": "OpenShort",
      "size": 1.0,
      "price": 4.34392243,
      "transaction_unix_ms": 1757306191838
    }
  ]
}
```

#### 9. `user_funding_rate_history:{user}`
```json
{
  "topic": "user_funding_rate_history:0x60cd94295f7dcc5ca1134542d317909ace5023bc891de280a011166b08964483",
  "funding_rates": [
    {
      "market": "0x123...",
      "action": "CloseLong",
      "size": 100.5,
      "realized_funding_amount": -10.25,
      "transaction_unix_ms": 1678886400000
    }
  ]
}
```

#### 10. `account_overview:{user}`
```json
{
  "topic": "account_overview:0x60cd94295f7dcc5ca1134542d317909ace5023bc891de280a011166b08964483",
  "account_overview": {
    "perp_equity_balance": 0.0,
    "unrealized_pnl": 0.0,
    "unrealized_funding_cost": 0.0,
    "cross_margin_ratio": 0.0,
    "maintenance_margin": 0.0,
    "cross_account_leverage_ratio": null,
    "volume_30d": null,
    "total_margin": 0.0
  }
}
```