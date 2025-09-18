import type { DeciDashConfig } from "@/config";
import type { AccountOverviews, UserPosition } from "./types";
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
}): Promise<AccountOverviews[]> => {
  const { fetchFn, tradingVM } = args.decidashConfig;
  const response = await get<AccountOverviews[]>(
    `${tradingVM.APIURL}/api/v1/account_overviews?user=${args.user}`,
    fetchFn,
  );
  return response;
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
