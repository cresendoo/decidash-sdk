import { WSAPISession } from "../src/api/websocket";
import { DeciDashConfig, MARKET_LIST } from "../src/config";

async function main() {
  const config = DeciDashConfig.DEVNET;

  const wsSession = new WSAPISession({
    wsURL: config.tradingVM.WSURL,
  });

  try {
    console.log("WebSocket 연결 중...");
    await wsSession.connect();
    console.log("✅ WebSocket 연결 성공!");

    const aptUsdMarket = MARKET_LIST["APT/USD"];
    console.log(`📊 APT/USD 마켓 ID: ${aptUsdMarket}`);

    console.log("\n🔍 Market Depth 구독 시작...");
    const marketDepthStream = wsSession.subscribeMarketDepth(aptUsdMarket);

    let depthCount = 0;
    for await (const depth of marketDepthStream) {
      console.log(`\n📈 Market Depth #${++depthCount}:`);
      console.log(
        `  Bids (${depth.bids.length}):`,
        depth.bids.slice(0, 3).map((b) => `${b.price}@${b.size}`),
      );
      console.log(
        `  Asks (${depth.asks.length}):`,
        depth.asks.slice(0, 3).map((a) => `${a.price}@${a.size}`),
      );

      if (depthCount >= 3) break;
    }

    console.log("\n💰 Market Price 구독 시작...");
    const marketPriceStream = wsSession.subscribeMarketPrice(aptUsdMarket);

    let priceCount = 0;
    for await (const priceData of marketPriceStream) {
      console.log(`\n💲 Market Price #${++priceCount}:`);
      console.log(`  Oracle Price: $${priceData.price.oracle_px.toFixed(6)}`);
      console.log(`  Mark Price: $${priceData.price.mark_px.toFixed(6)}`);
      console.log(`  Mid Price: $${priceData.price.mid_px.toFixed(6)}`);
      console.log(`  Funding Rate: ${priceData.price.funding_rate_bps} bps`);
      console.log(
        `  Open Interest: ${priceData.price.open_interest.toFixed(6)}`,
      );
      console.log(
        `  Timestamp: ${new Date(priceData.price.transaction_unix_ms).toISOString()}`,
      );

      if (priceCount >= 3) break;
    }
  } catch (error) {
    console.error("❌ WebSocket 에러:", error);
  } finally {
    console.log("\n🔌 WebSocket 연결 종료 중...");
    wsSession.disconnect();
    console.log("✅ 연결 종료 완료");
  }
}

main().catch(console.error);
