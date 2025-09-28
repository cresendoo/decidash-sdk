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

    console.log("\n🌎 All Market Prices 구독 시작...");
    const allMarketPricesStream = wsSession.subscribeAllMarketPrices();

    let allPriceCount = 0;
    for await (const payload of allMarketPricesStream) {
      console.log(`\n🌐 All Market Prices #${++allPriceCount}:`);
      console.log(`  페이로드 내 마켓 수: ${payload.prices.length}`);
      if (payload.prices[0]) {
        console.log(
          `  첫 번째 마켓: ${payload.prices[0].market} | Mark: ${payload.prices[0].mark_px.toFixed(6)}`,
        );
      }

      if (allPriceCount >= 2) break;
    }

    console.log("\n🕯️ Market Candlestick (1m) 구독 시작...");
    const marketCandleStream = wsSession.subscribeMarketCandlestick(
      aptUsdMarket,
      "1m",
    );

    let candleCount = 0;
    for await (const candlePayload of marketCandleStream) {
      console.log(`\n🕯️ Candle Update #${++candleCount}:`);
      console.log(
        `  기간: ${new Date(candlePayload.candle.t).toISOString()} ~ ${new Date(candlePayload.candle.T).toISOString()}`,
      );
      console.log(
        `  OHLC: ${candlePayload.candle.o}, ${candlePayload.candle.h}, ${candlePayload.candle.l}, ${candlePayload.candle.c}`,
      );

      if (candleCount >= 2) break;
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
