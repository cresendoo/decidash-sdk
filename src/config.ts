export type DeciDashConfig = {
  tradingVM: {
    FeePayerURL: string;
    APIURL: string;
    WSURL: string;
  };
  node: { HTTPURL: string };

  fetchFn?: typeof fetch;
  WebSocketCtor?: typeof WebSocket;
};

export namespace DeciDashConfig {
  export const DEVNET = {
    tradingVM: {
      FeePayerURL:
        "https://fee-payer-dev-netna-us-central1-410192433417.us-central1.run.app",
      APIURL:
        "https://trading-api-http-dev-netna-us-central1-410192433417.us-central1.run.app",
      WSURL:
        "wss://trading-api-ws-dev-netna-us-central1-410192433417.us-central1.run.app/",
    },
    node: {
      HTTPURL: "https://api.netna.staging.aptoslabs.com/v1",
    },
  } satisfies DeciDashConfig;
}

export type MarketList = Record<string, string>;

export const MARKET_LIST: MarketList = {
  "APT/USD":
    "0xe6de4f6ec47f1bc2ab73920e9f202953e60482e1c1a90e7eef3ee45c8aafee36",
};
