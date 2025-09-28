import {
  getAssetContexts,
  getDexRegistration,
  getLeaderboard,
  getMarketCandlesticks,
  getMarketDepth,
  getMarketPrices,
  getMarketTradeHistory,
  getMarkets,
} from "../src/api/market";
import { DeciDashConfig } from "../src/config";

async function main() {
  const config = DeciDashConfig.DEVNET;

  console.log("🌐 Trading API URL:", config.tradingVM.APIURL);

  // 1. Fetch available markets
  const markets = await getMarkets({ decidashConfig: config });
  console.log(`\n📊 Found ${markets.length} markets`);
  markets.slice(0, 3).forEach((market, index) => {
    console.log(
      `  ${index + 1}. ${market.market_name} | Address: ${market.market_addr}`,
    );
  });

  const targetMarket = markets[0];
  if (!targetMarket) {
    console.log("⚠️ No markets returned. Exiting example.");
    return;
  }

  console.log(`\n🎯 Using market ${targetMarket.market_name}`);
  const marketAddress = targetMarket.market_addr;

  // 2. Fetch price snapshots
  console.log("\n💰 Latest prices (all markets)");
  const allMarketPrices = await getMarketPrices({
    decidashConfig: config,
  });
  console.log(`  Received ${allMarketPrices.length} price entries`);

  console.log("\n💰 Latest price for target market");
  const singleMarketPrice = await getMarketPrices({
    decidashConfig: config,
    market: marketAddress,
  });
  singleMarketPrice.slice(0, 1).forEach((price) => {
    console.log(
      `  Oracle: $${price.oracle_px.toFixed(6)} | Mark: $${price.mark_px.toFixed(6)}`,
    );
    console.log(
      `  Funding: ${price.funding_rate_bps} bps | OI: ${price.open_interest.toFixed(6)}`,
    );
  });

  // 3. Fetch order book depth
  console.log("\n📈 Order book depth");
  const marketDepth = await getMarketDepth({
    decidashConfig: config,
    market: marketAddress,
    limit: 5,
  });
  console.log(marketDepth);
  console.log(
    "  Top bids:",
    marketDepth.bids.map((bid) => `${bid.price}@${bid.size}`).join(", "),
  );
  console.log(
    "  Top asks:",
    marketDepth.asks.map((ask) => `${ask.price}@${ask.size}`).join(", "),
  );

  // 4. Fetch candlesticks for the last hour
  console.log("\n🕯️ Candlesticks (1m)");
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const candlesticks = await getMarketCandlesticks({
    decidashConfig: config,
    market: marketAddress,
    interval: "1m",
    startTime: oneHourAgo,
    endTime: now,
  });
  console.log(`  Received ${candlesticks.length} candles`);
  candlesticks.slice(-3).forEach((candle) => {
    console.log(
      `  ${new Date(candle.t).toISOString()} O:${candle.o} H:${candle.h} L:${candle.l} C:${candle.c}`,
    );
  });

  // 5. Fetch market trade history
  console.log("\n🧾 Recent trades");
  const tradeHistory = await getMarketTradeHistory({
    decidashConfig: config,
    market: marketAddress,
    limit: 5,
  });
  tradeHistory.forEach((trade, index) => {
    console.log(
      `  ${index + 1}. ${trade.action} ${trade.size}@${trade.price} | PnL: ${trade.realized_pnl_amount}`,
    );
  });

  // 6. Fetch asset context snapshot
  console.log("\n📚 Asset context");
  const [assetContext] = await getAssetContexts({
    decidashConfig: config,
    market: marketAddress,
  });
  if (assetContext) {
    console.log(
      `  24h Volume: ${assetContext.volume_24h} | Mark: ${assetContext.mark_price} | Oracle: ${assetContext.oracle_price}`,
    );
    console.log(
      `  24h Change: ${assetContext.price_change_pct_24h.toFixed(2)}%`,
    );
  }

  // 7. Fetch DEX registration info
  console.log("\n🏛️ DEX registration");
  const dexRegistration = await getDexRegistration({
    decidashConfig: config,
  });
  console.log(
    `  Collateral ${dexRegistration.collateral_name} (${dexRegistration.collateral_address}) with ${dexRegistration.collateral_balance_decimals} decimals`,
  );

  // 8. Fetch leaderboard snapshot
  console.log("\n🏅 Leaderboard (top 5 by account value)");
  const leaderboard = await getLeaderboard({
    decidashConfig: config,
    sortKey: "account_value",
    sortDir: "DESC",
    limit: 5,
  });
  console.log(leaderboard);
  leaderboard.items.forEach((item) => {
    console.log(
      `  #${item.rank} ${item.account} | Value: ${item.account_value} | ROI: ${(item.roi * 100).toFixed(2)}%`,
    );
  });
}

main().catch(console.error);
