import type { DeciDashConfig } from "@/config";
import type {
  MarketCandlesticks,
  MarketCandlesticksInterval,
  MarketPrice,
  MarketTradeHistory,
} from "./types";
import { get } from "./utils";

export const getMarketTradeHistory = async (args: {
  decidashConfig: DeciDashConfig;
  market: string;
  limit?: number;
}): Promise<MarketTradeHistory[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const response = await get<MarketTradeHistory[]>(
    `${tradingVM.APIURL}/api/v1/market_trade_history?market=${
      args.market
    }&limit=${args.limit ?? 24}`,
    fetchFn,
  );
  return response;
};

export const getMarketPrice = async (args: {
  decidashConfig: DeciDashConfig;
  market: string;
}): Promise<MarketPrice[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const response = await get<MarketPrice[]>(
    `${tradingVM.APIURL}/api/v1/prices?market=${args.market}`,
    fetchFn,
  );
  return response;
};

export const getMarketCandlesticks = async (args: {
  decidashConfig: DeciDashConfig;
  market: string;
  interval: MarketCandlesticksInterval;
  startTime: number;
  endTime: number;
}): Promise<MarketCandlesticks[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const response = await get<MarketCandlesticks[]>(
    `${tradingVM.APIURL}/api/v1/candlesticks?market=${args.market}&interval=${args.interval}&startTime=${args.startTime}&endTime=${args.endTime}`,
    fetchFn,
  );
  return response;
};
