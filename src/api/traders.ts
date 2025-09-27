import type { DeciDashConfig } from "@/config";
import type {
  ApiResponse,
  AssetStats,
  DashboardSummary,
  Trader,
  TraderStats,
  TradersResponse,
} from "./types";
import { get } from "./utils";

/**
 * Get traders dashboard summary
 */
export const getTradersDashboard = async (args: {
  decidashConfig: DeciDashConfig;
}): Promise<DashboardSummary> => {
  const { decidashConfig } = args;
  const { fetchFn } = decidashConfig;
  const baseURL = decidashConfig.DeciDash;

  const response = await get<ApiResponse<DashboardSummary>>(
    `${baseURL}/traders/dashboard`,
    fetchFn,
  );

  return response.data;
};

export const getTraders = async (args: {
  decidashConfig: DeciDashConfig;
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDesc?: boolean;
}): Promise<TradersResponse> => {
  const { decidashConfig, page, perPage, search, sortBy, sortDesc } = args;
  const { fetchFn } = decidashConfig;
  const baseURL = decidashConfig.DeciDash;

  const queryParams = new URLSearchParams();

  if (page !== undefined) {
    queryParams.append("page", page.toString());
  }

  if (perPage !== undefined) {
    queryParams.append("per_page", perPage.toString());
  }

  if (search) {
    queryParams.append("search", search);
  }

  if (sortBy) {
    queryParams.append("sort_by", sortBy);
  }

  if (sortDesc !== undefined) {
    queryParams.append("sort_desc", sortDesc ? "true" : "false");
  }

  const queryString = queryParams.toString();
  const url = queryString
    ? `${baseURL}/traders?${queryString}`
    : `${baseURL}/traders`;

  const response = await get<ApiResponse<TradersResponse>>(url, fetchFn);

  return response.data;
};

export const getTraderDetail = async (args: {
  decidashConfig: DeciDashConfig;
  address: string;
}): Promise<Trader> => {
  const { decidashConfig, address } = args;
  const { fetchFn } = decidashConfig;
  const baseURL = decidashConfig.DeciDash;

  const response = await get<ApiResponse<Trader>>(
    `${baseURL}/traders/${encodeURIComponent(address)}`,
    fetchFn,
  );

  return response.data;
};

export const getTraderStats = async (args: {
  decidashConfig: DeciDashConfig;
}): Promise<TraderStats> => {
  const { decidashConfig } = args;
  const { fetchFn } = decidashConfig;
  const baseURL = decidashConfig.DeciDash;

  const response = await get<ApiResponse<TraderStats>>(
    `${baseURL}/traders/stats`,
    fetchFn,
  );

  return response.data;
};

export const getTraderAssetStats = async (args: {
  decidashConfig: DeciDashConfig;
}): Promise<AssetStats> => {
  const { decidashConfig } = args;
  const { fetchFn } = decidashConfig;
  const baseURL = decidashConfig.DeciDash;

  const response = await get<ApiResponse<AssetStats>>(
    `${baseURL}/traders/assets/stats`,
    fetchFn,
  );

  return response.data;
};
