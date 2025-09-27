import {
  getTraderAssetStats,
  getTraderDetail,
  getTraderStats,
  getTraders,
  getTradersDashboard,
} from "../src/api/traders";
import { DeciDashConfig } from "../src/config";

async function main() {
  const config = DeciDashConfig.DEVNET;

  console.log(`🌐 Base API URL: ${config.DeciDash}`);

  try {
    console.log("\n📊 Fetching traders dashboard summary...");
    const dashboard = await getTradersDashboard({ decidashConfig: config });

    console.log(
      `  Market Sentiment: ${dashboard.market_sentiment.long_percentage.toFixed(2)}% long / ${dashboard.market_sentiment.short_percentage.toFixed(2)}% short`,
    );
    console.log(
      `  Top Performer: ${dashboard.top_performer_main_position.asset} (${dashboard.top_performer_main_position.roi})`,
    );
    console.log(
      `  Asset Concentration (Highest OI): ${dashboard.asset_concentration.highest_oi.asset} $${dashboard.asset_concentration.highest_oi.amount.toLocaleString()}`,
    );
    console.log(
      `  Trader Profitability: ${dashboard.trader_profitability.profitable_percentage.toFixed(2)}% profitable (${dashboard.trader_profitability.profitable_count}/${dashboard.trader_profitability.total_traders})`,
    );

    console.log("\n📄 Fetching traders list (first page)...");
    const tradersResponse = await getTraders({
      decidashConfig: config,
      page: 1,
      perPage: 5,
    });

    console.log(
      `  Received ${tradersResponse.traders.length} traders (page ${tradersResponse.page}/${tradersResponse.total_pages})`,
    );

    if (tradersResponse.traders.length === 0) {
      console.log("  No traders returned from the API.");
      return;
    }

    tradersResponse.traders.forEach((trader, index) => {
      console.log(
        `  ${index + 1}. ${trader.address} | Equity: $${trader.perp_equity.toLocaleString()} | Main Position: ${trader.main_position?.asset ?? "N/A"}`,
      );
    });

    const firstTrader = tradersResponse.traders[0];

    console.log(`\n🔍 Fetching detail for trader ${firstTrader.address}...`);
    const traderDetail = await getTraderDetail({
      decidashConfig: config,
      address: firstTrader.address,
    });

    console.log(
      `  Daily PnL: $${traderDetail.daily_pnl.amount.toLocaleString()} (${traderDetail.daily_pnl.percentage.toFixed(2)}%)`,
    );
    console.log(
      `  Direction Bias: ${traderDetail.direction_bias.long_percentage.toFixed(2)}% long / ${traderDetail.direction_bias.short_percentage.toFixed(2)}% short`,
    );

    console.log("\n📈 Fetching aggregate trader stats...");
    const traderStats = await getTraderStats({ decidashConfig: config });
    console.log(
      `  Total Traders: ${traderStats.total_traders} | Profitable: ${traderStats.profitable_count} (${traderStats.profitable_percentage.toFixed(2)}%)`,
    );
    console.log(
      `  Total Equity: $${traderStats.total_equity.toLocaleString()} | Avg Daily PnL: $${traderStats.avg_daily_pnl.toLocaleString()}`,
    );

    console.log("\n🧮 Fetching asset stats (top 3)...");
    const assetStats = await getTraderAssetStats({ decidashConfig: config });
    const topAssets = Object.values(assetStats).slice(0, 3);

    if (topAssets.length === 0) {
      console.log("  No asset stats available.");
      return;
    }

    topAssets.forEach((asset) => {
      console.log(
        `  ${asset.asset}: Traders=${asset.total_traders}, Total OI=${asset.total_oi.toFixed(2)}, Avg Position=${asset.avg_position.toFixed(2)}, Long=${asset.long_count}, Short=${asset.short_count}`,
      );
    });
  } catch (error) {
    console.error("❌ Traders API error:", error);
  }
}

main().catch(console.error);
