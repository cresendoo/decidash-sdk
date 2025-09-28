import type { DeciDashConfig } from "@/config";
import type {
  AccountOverviews,
  FundingRateHistoryEntry,
  MarketTradeHistory,
  OpenOrder,
  OrderDetail,
  PortfolioChartDataType,
  PortfolioChartPoint,
  PortfolioChartRange,
  UserPosition,
} from "./types";
import { get } from "./utils";

/**
 * Retrieves account overview information for a user.
 *
 * @param args.user - User address
 * @returns Array of account overview information
 */
export const getAccountOverviews = async (args: {
  decidashConfig: DeciDashConfig;
  user: string;
}): Promise<AccountOverviews> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = new URLSearchParams({ user: args.user }).toString();
  return get<AccountOverviews>(
    `${tradingVM.APIURL}/api/v1/account_overviews?${query}`,
    fetchFn,
  );
};

/**
 * Retrieves user position information for a given account.
 *
 * @param args.user - User address
 * @param args.includeDeleted - Whether to include deleted positions
 *   - true: Include deleted positions in the response
 *   - Used to fetch position settings for UI (Isolated/Cross mode, leverage settings, etc.)
 * @param args.limit - Maximum number of positions to return
 * @param args.marketAddress - (Optional) Market address to filter positions
 */
export const getAccountPositions = async (args: {
  decidashConfig: DeciDashConfig;
  user: string;
  includeDeleted: boolean;
  limit: number;
  marketAddress?: string;
}): Promise<UserPosition[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;

  const queryParams = new URLSearchParams();
  queryParams.append("user", args.user);
  queryParams.append("include_deleted", args.includeDeleted.toString());
  queryParams.append("limit", args.limit.toString());
  if (args.marketAddress) {
    queryParams.append("market_address", args.marketAddress);
  }

  const response = await get<UserPosition[]>(
    `${tradingVM.APIURL}/api/v1/user_positions?${queryParams.toString()}`,
    fetchFn,
  );
  return response;
};

export const getUserOpenOrders = async (args: {
  decidashConfig: DeciDashConfig;
  user: string;
}): Promise<OpenOrder[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = new URLSearchParams({ user: args.user }).toString();
  return get<OpenOrder[]>(
    `${tradingVM.APIURL}/api/v1/open_orders?${query}`,
    fetchFn,
  );
};

export const getOrderDetail = async (args: {
  decidashConfig: DeciDashConfig;
  orderId: string;
  marketAddress: string;
}): Promise<OrderDetail> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = new URLSearchParams({
    order_id: args.orderId,
    market_address: args.marketAddress,
  }).toString();
  return get<OrderDetail>(
    `${tradingVM.APIURL}/api/v1/orders?${query}`,
    fetchFn,
  );
};

export const getUserTradeHistory = async (args: {
  decidashConfig: DeciDashConfig;
  user: string;
  limit?: number;
}): Promise<MarketTradeHistory[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = new URLSearchParams({
    user: args.user,
    limit: String(args.limit ?? 10),
  }).toString();
  return get<MarketTradeHistory[]>(
    `${tradingVM.APIURL}/api/v1/trade_history?${query}`,
    fetchFn,
  );
};

export const getUserFundingRateHistory = async (args: {
  decidashConfig: DeciDashConfig;
  user: string;
  limit?: number;
}): Promise<FundingRateHistoryEntry[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = new URLSearchParams({
    user: args.user,
    limit: String(args.limit ?? 10),
  }).toString();
  return get<FundingRateHistoryEntry[]>(
    `${tradingVM.APIURL}/api/v1/funding_rate_history?${query}`,
    fetchFn,
  );
};

export const getPortfolioChart = async (args: {
  decidashConfig: DeciDashConfig;
  user: string;
  range: PortfolioChartRange;
  dataType: PortfolioChartDataType;
}): Promise<PortfolioChartPoint[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const query = new URLSearchParams({
    user: args.user,
    range: args.range,
    data_type: args.dataType,
  }).toString();
  return get<PortfolioChartPoint[]>(
    `${tradingVM.APIURL}/api/v1/portfolio_chart?${query}`,
    fetchFn,
  );
};
