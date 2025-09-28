import type { DeciDashConfig } from "@/config";
import type {
  AssetContext,
  DexRegistration,
  LeaderboardResponse,
  LeaderboardSortKey,
  Market,
  MarketCandlesticks,
  MarketCandlesticksInterval,
  MarketDepth,
  MarketPrice,
  MarketTradeHistory,
  SortDirection,
} from "./types";
import { get } from "./utils";

const toQueryString = (
  params: Record<string, string | number | boolean | undefined>,
): string => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    searchParams.append(key, String(value));
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const getMarkets = async (args: {
  decidashConfig: DeciDashConfig;
}): Promise<Market[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  return get<Market[]>(`${tradingVM.APIURL}/api/v1/markets`, fetchFn);
};

/**
 * @deprecated Use getMarkets instead.
 */
export const getMarket = getMarkets;

export const getMarketTradeHistory = async (args: {
  decidashConfig: DeciDashConfig;
  market: string;
  limit?: number;
}): Promise<MarketTradeHistory[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = toQueryString({ market: args.market, limit: args.limit ?? 10 });
  return get<MarketTradeHistory[]>(
    `${tradingVM.APIURL}/api/v1/market_trade_history${query}`,
    fetchFn,
  );
};

export const getMarketPrices = async (args: {
  decidashConfig: DeciDashConfig;
  market?: string;
}): Promise<MarketPrice[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = toQueryString({ market: args.market });
  return get<MarketPrice[]>(
    `${tradingVM.APIURL}/api/v1/prices${query}`,
    fetchFn,
  );
};

export const getMarketPrice = (args: {
  decidashConfig: DeciDashConfig;
  market: string;
}): Promise<MarketPrice[]> =>
  getMarketPrices({
    decidashConfig: args.decidashConfig,
    market: args.market,
  });

export const getMarketDepth = async (args: {
  decidashConfig: DeciDashConfig;
  market: string;
  limit?: number;
}): Promise<MarketDepth> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = toQueryString({ market: args.market, limit: args.limit });
  return get<MarketDepth>(`${tradingVM.APIURL}/api/v1/depths${query}`, fetchFn);
};

export const getMarketCandlesticks = async (args: {
  decidashConfig: DeciDashConfig;
  market: string;
  interval: MarketCandlesticksInterval;
  startTime: number;
  endTime: number;
}): Promise<MarketCandlesticks[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = toQueryString({
    market: args.market,
    interval: args.interval,
    startTime: args.startTime,
    endTime: args.endTime,
  });
  return get<MarketCandlesticks[]>(
    `${tradingVM.APIURL}/api/v1/candlesticks${query}`,
    fetchFn,
  );
};

export const getAssetContexts = async (args: {
  decidashConfig: DeciDashConfig;
  market?: string;
}): Promise<AssetContext[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = toQueryString({ market: args.market });
  return get<AssetContext[]>(
    `${tradingVM.APIURL}/api/v1/asset_contexts${query}`,
    fetchFn,
  );
};

export const getAssetContext = (args: {
  decidashConfig: DeciDashConfig;
  asset: string;
}): Promise<AssetContext[]> =>
  getAssetContexts({
    decidashConfig: args.decidashConfig,
    market: args.asset,
  });

export const getDexRegistration = async (args: {
  decidashConfig: DeciDashConfig;
}): Promise<DexRegistration> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  return get<DexRegistration>(`${tradingVM.APIURL}/api/v1/dex`, fetchFn);
};

export const getLeaderboard = async (args: {
  decidashConfig: DeciDashConfig;
  sortKey?: LeaderboardSortKey;
  sortDir?: SortDirection;
  limit?: number;
  offset?: number;
}): Promise<LeaderboardResponse> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = toQueryString({
    sort_key: args.sortKey,
    sort_dir: args.sortDir,
    limit: args.limit,
    offset: args.offset,
  });
  return get<LeaderboardResponse>(
    `${tradingVM.APIURL}/api/v1/leaderboard${query}`,
    fetchFn,
  );
};
