import type {
  MarketCandlesticksInterval,
  WebsocketResponseAccountOverview,
  WebsocketResponseAllMarketPrices,
  WebsocketResponseMarketCandlestick,
  WebsocketResponseMarketDepth,
  WebsocketResponseMarketPrice,
  WebsocketResponseMarketTradeHistory,
  WebsocketResponseUserFundingRateHistory,
  WebsocketResponseUserOpenOrders,
  WebsocketResponseUserOrderHistory,
  WebsocketResponseUserPositions,
  WebsocketResponseUserTradeHistory,
  WebsocketResponseUsersWithPositions,
} from "./types";

export type WSAPISessionConfig = {
  wsURL: string;
  WebSocketCtor?: new (
    url: string | URL,
    protocols?: string | string[],
  ) => WebSocket;
};

type SubscriptionController = Pick<
  ReadableStreamDefaultController,
  "enqueue" | "error"
>;

export class WSAPISession {
  private ws: WebSocket;
  private openPromise: Promise<void>;
  private subscriptions: { [key: string]: SubscriptionController[] };

  constructor(config: WSAPISessionConfig) {
    const WebSocketCtor = config.WebSocketCtor ?? WebSocket;
    this.ws = new WebSocketCtor(config.wsURL);
    this.openPromise = new Promise((resolve, reject) => {
      this.ws.addEventListener("open", () => resolve());
      this.ws.addEventListener("close", (e) =>
        reject(new Error(`WebSocket closed: ${e.reason}`)),
      );
    });
    this.ws.addEventListener("message", (e) => this.handleMessage(e));
    this.ws.addEventListener("close", (e) => this.handleClose(e));
    this.subscriptions = {};
  }

  async connect() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    return this.openPromise;
  }

  disconnect() {
    this.ws.close();
  }

  private handleMessage(e: MessageEvent) {
    const data = JSON.parse(e.data) as { topic: string };
    const topic = data.topic;
    const controllers = (this.subscriptions[topic] ??= []);
    for (const controller of controllers) {
      controller.enqueue(data);
    }
  }

  private handleClose(e: CloseEvent) {
    const controllers = Object.values(this.subscriptions).flat();
    for (const controller of controllers) {
      controller.error(new Error(`WebSocket closed: ${e.reason}`));
    }
    this.subscriptions = {};
  }

  subscribeMarketDepth(
    market: string,
  ): AsyncIterable<WebsocketResponseMarketDepth> {
    return this.subscribe<WebsocketResponseMarketDepth>(
      `market_depth:${market}`,
    );
  }

  subscribeMarketPrice(
    market: string,
  ): AsyncIterable<WebsocketResponseMarketPrice> {
    return this.subscribe<WebsocketResponseMarketPrice>(
      `market_price:${market}`,
    );
  }

  subscribeAllMarketPrices(): AsyncIterable<WebsocketResponseAllMarketPrices> {
    return this.subscribe<WebsocketResponseAllMarketPrices>(
      "all_market_prices",
    );
  }

  subscribeMarketCandlestick(
    market: string,
    interval: MarketCandlesticksInterval,
  ): AsyncIterable<WebsocketResponseMarketCandlestick> {
    return this.subscribe<WebsocketResponseMarketCandlestick>(
      `market_candlestick:${market}:${interval}`,
    );
  }

  subscribeUserOpenOrders(
    user: string,
  ): AsyncIterable<WebsocketResponseUserOpenOrders> {
    return this.subscribe<WebsocketResponseUserOpenOrders>(
      `user_open_orders:${user}`,
    );
  }

  subscribeUserOrderHistory(
    user: string,
  ): AsyncIterable<WebsocketResponseUserOrderHistory> {
    return this.subscribe<WebsocketResponseUserOrderHistory>(
      `user_order_history:${user}`,
    );
  }

  subscribeUserPositions(
    user: string,
  ): AsyncIterable<WebsocketResponseUserPositions> {
    return this.subscribe<WebsocketResponseUserPositions>(
      `user_positions:${user}`,
    );
  }

  subscribeUsersWithPositions(): AsyncIterable<WebsocketResponseUsersWithPositions> {
    return this.subscribe<WebsocketResponseUsersWithPositions>(
      "users_with_positions",
    );
  }

  subscribeUserTradeHistory(
    user: string,
  ): AsyncIterable<WebsocketResponseUserTradeHistory> {
    return this.subscribe<WebsocketResponseUserTradeHistory>(
      `user_trade_history:${user}`,
    );
  }

  subscribeMarketTradeHistory(
    market: string,
  ): AsyncIterable<WebsocketResponseMarketTradeHistory> {
    return this.subscribe<WebsocketResponseMarketTradeHistory>(
      `market_trade_history:${market}`,
    );
  }

  subscribeUserFundingRateHistory(
    user: string,
  ): AsyncIterable<WebsocketResponseUserFundingRateHistory> {
    return this.subscribe<WebsocketResponseUserFundingRateHistory>(
      `user_funding_rate_history:${user}`,
    );
  }

  subscribeAccountOverview(
    user: string,
  ): AsyncIterable<WebsocketResponseAccountOverview> {
    return this.subscribe<WebsocketResponseAccountOverview>(
      `account_overview:${user}`,
    );
  }

  private subscribe<T>(topic: string): AsyncIterable<T> {
    const t = this;

    let ctlr: ReadableStreamDefaultController<T> | undefined;

    const stream = new ReadableStream({
      async start(controller) {
        ctlr = controller;
        t.ws.send(JSON.stringify({ Subscribe: { topic } }));
        (t.subscriptions[topic] ??= []).push(controller);
      },
      async cancel() {
        if (!ctlr) return;
        const controllers = t.subscriptions[topic] ?? [];
        const remaining = controllers.filter((c) => c !== ctlr);
        t.subscriptions[topic] = remaining;
        if (remaining.length === 0) {
          t.ws.send(JSON.stringify({ Unsubscribe: { topic } }));
        }
        try {
          ctlr.close();
        } catch (error) {
          // Ignore ERR_INVALID_STATE error (controller is already closed)
          if (
            error instanceof Error &&
            error.message.includes("Controller is already closed")
          ) {
            return;
          }
          throw error;
        }
      },
    });
    return stream;
  }
}
