# Decidash TS SDK

## Package Install
```
pnpm add @coldbell/decidash-ts-sdk
```

## Install & Build
```bash
pnpm install
pnpm build
```

## Run Example
```bash
npx tsx example/account.ts
npx tsx example/contract.ts
npx tsx example/market.ts
npx tsx example/websocket.ts
npx tsx example/traders.ts
```

## SDK Structure (excluding `/src/contract`)
- `src/config.ts`: defines the `DeciDashConfig` interface plus ready-to-use presets (e.g., `DeciDashConfig.DEVNET`) and the `MARKET_LIST` helper. Override `fetchFn` or `WebSocketCtor` here to adapt to SSR/React Native environments.
- `src/api/index.ts`: re-exports every public helper so consumers can import from the package root (`import { getMarkets } from "decidash-ts-sdk"`).
- `src/api/utils.ts`: typed `get`/`post` wrappers that honor the injected `fetchFn` and raise on non-OK responses.
- `src/api/types.ts`: source of truth for all DTOs covering markets, orders, asset contexts, funding history, leaderboard entries, portfolio charts, plus WebSocket payloads. Keep these synced with backend schema to preserve type safety across the app.

### HTTP API Clients (`src/api`)
- `market.ts` exposes REST helpers such as `getMarkets`, `getMarketPrices`, `getMarketDepth`, `getMarketCandlesticks`, `getAssetContexts`, `getDexRegistration`, and `getLeaderboard`. Query strings are built via a shared utility, and legacy aliases (`getMarket`, `getMarketPrice`, `getAssetContext`) remain for backwards compatibility.
- `account.ts` provides account-centric endpoints: `getAccountOverviews`, `getAccountPositions`, `getUserOpenOrders`, `getOrderDetail`, `getUserTradeHistory`, `getUserFundingRateHistory`, and `getPortfolioChart`.
- `traders.ts` targets the DeciDash dashboard: `getTradersDashboard`, `getTraders`, `getTraderDetail`, `getTraderStats`, and `getTraderAssetStats`.

### WebSocket Session (`src/api/websocket.ts`)
- `WSAPISession` manages the lifecycle of a trading WebSocket connection. It exposes typed subscription helpers for every documented topic (market depth, individual/all market prices, market candlesticks, user open orders, order history, positions, users with positions, user/market trade history, user funding history, and account overview). Returns async iterables so you can bridge to RxJS, React hooks, or custom stream handlers.

### Root Barrel (`src/index.ts`)
- Aggregates config, API helpers, WebSocket tools, and types for convenient consumption. Import from here in your frontend to avoid deep relative paths.

### Example Scripts (`/example`)
- `account.ts`, `market.ts`, and `traders.ts` demonstrate the REST helpers in realistic flows (filtering, pagination, data formatting).
- `websocket.ts` shows how to subscribe and gracefully tear down multiple topics in sequence.
- `contract.ts` covers on-chain helpers and lives alongside the others for parity, but the SDK description above focuses on non-contract modules per this guide.

## Frontend Integration Notes
- Always pass a `DeciDashConfig` when calling helpers; the SDK will fall back to the preset’s `fetchFn`/`WebSocketCtor` if provided.
- Wrap promise-returning helpers with SWR/React Query or your preferred data layer. The method signatures are uniform: `{ decidashConfig, ...params }`.
- Convert WebSocket async iterables into your state management system (e.g., `for await` loops, `ReadableStream` readers, or custom adapters).
- Leverage the exported types in `src/api/types.ts` for component props, stores, or validation to stay aligned with the backend contract.
