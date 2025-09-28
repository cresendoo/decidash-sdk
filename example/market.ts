import {
  getMarket,
  getMarketCandlesticks,
  getMarketPrice,
  getMarketTradeHistory,
} from "../src/api/market";
import { DeciDashConfig, MARKET_LIST } from "../src/config";

async function main() {
  const config = DeciDashConfig.DEVNET;
  const markets = await getMarket({
    decidashConfig: config,
  });

  try {
    for (const market of markets) {
      // 1. Market Trade History 조회
      console.log("📈 Market Trade History 조회 중...");
      const tradeHistory = await getMarketTradeHistory({
        decidashConfig: config,
        market: market.market_addr,
        limit: 5,
      });

      console.log(`✅ ${tradeHistory.length}개의 거래 내역 조회 완료:`);
      tradeHistory.forEach((trade, index) => {
        console.log(
          `  ${index + 1}. ${trade.action} | ${trade.size} @ $${trade.price.toFixed(6)} | PnL: $${trade.realized_pnl_amount.toFixed(6)}`,
        );
        console.log(
          `     수수료: ${trade.fee_amount} | 시간: ${new Date(trade.transaction_unix_ms).toISOString()}`,
        );
      });

      // 2. Market Price 조회
      console.log("\n💰 Market Price 조회 중...");
      const marketPrices = await getMarketPrice({
        decidashConfig: config,
        market: market.market_addr,
      });

      console.log(`✅ ${marketPrices.length}개의 가격 데이터 조회 완료:`);
      marketPrices.forEach((price, index) => {
        console.log(
          `  ${index + 1}. Oracle: $${price.oracle_px.toFixed(6)} | Mark: $${price.mark_px.toFixed(6)} | Mid: $${price.mid_px.toFixed(6)}`,
        );
        console.log(
          `     Funding Rate: ${price.funding_rate_bps} bps | Open Interest: ${price.open_interest.toFixed(6)}`,
        );
        console.log(
          `     시간: ${new Date(price.transaction_unix_ms).toISOString()}`,
        );
      });

      // 3. Market Candlesticks 조회 (최근 1시간, 1분 간격)
      console.log("\n🕯️ Market Candlesticks 조회 중...");
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000; // 1시간 전

      const candlesticks = await getMarketCandlesticks({
        decidashConfig: config,
        market: market.market_addr,
        interval: "1m",
        startTime: oneHourAgo,
        endTime: now,
      });

      console.log(`✅ ${candlesticks.length}개의 캔들스틱 데이터 조회 완료:`);
      candlesticks.slice(-5).forEach((candle, index) => {
        console.log(
          `  ${index + 1}. 시간: ${new Date(candle.t).toISOString()}`,
        );
        console.log(
          `     OHLC: O:$${candle.o.toFixed(6)} H:$${candle.h.toFixed(6)} L:$${candle.l.toFixed(6)} C:$${candle.c.toFixed(6)}`,
        );
        console.log(`     거래량: ${candle.v.toFixed(6)}`);
      });
    }
  } catch (error) {
    console.error("❌ HTTP API 에러:", error);
  }
}

main().catch(console.error);
