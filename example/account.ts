import { getAccountOverviews, getAccountPositions } from "../src/api/account";
import { DeciDashConfig, MARKET_LIST } from "../src/config";

async function main() {
  const config = DeciDashConfig.DEVNET;
  
  // Example user address (replace with actual user address)
  const userAddress = "0x60cd94295f7dcc5ca1134542d317909ace5023bc891de280a011166b08964483";
  
  console.log(`👤 User Address: ${userAddress}`);
  console.log(`🌐 API URL: ${config.tradingVM.APIURL}\n`);

  try {
    // 1. Account Overview 조회
    console.log("📊 Account Overview 조회 중...");
    const accountOverviews = await getAccountOverviews({
      decidashConfig: config,
      user: userAddress,
    });
    
    console.log(`✅ 계정 개요 조회 완료:`);
    console.log(`  Perp Equity Balance: $${accountOverviews.perp_equity_balance.toFixed(6)}`);
    console.log(`  Unrealized PnL: $${accountOverviews.unrealized_pnl.toFixed(6)}`);
    console.log(`  Unrealized Funding Cost: $${accountOverviews.unrealized_funding_cost.toFixed(6)}`);
    console.log(`  Cross Margin Ratio: ${accountOverviews.cross_margin_ratio.toFixed(6)}`);
    console.log(`  Maintenance Margin: $${accountOverviews.maintenance_margin.toFixed(6)}`);
    console.log(`  Total Margin: $${accountOverviews.total_margin.toFixed(6)}`);
    console.log(`  Cross Account Leverage: ${accountOverviews.cross_account_leverage_ratio ?? 'N/A'}`);
    console.log(`  30d Volume: ${accountOverviews.volume_30d ?? 'N/A'}`);

    // 2. User Positions 조회 (삭제된 포지션 포함)
    console.log("\n📈 User Positions 조회 중 (삭제된 포지션 포함)...");
    const allPositions = await getAccountPositions({
      decidashConfig: config,
      user: userAddress,
      includeDeleted: true,
      limit: 10,
    });
    
    console.log(`✅ ${allPositions.length}개의 포지션 조회 완료:`);
    allPositions.forEach((position, index) => {
      console.log(`  ${index + 1}. Market: ${position.market}`);
      console.log(`     Size: ${position.size.toFixed(6)} | Entry Price: $${position.entry_price.toFixed(6)}`);
      console.log(`     User Leverage: ${position.user_leverage}x | Max Allowed: ${position.max_allowed_leverage}x`);
      console.log(`     Is Isolated: ${position.is_isolated} | Is Deleted: ${position.is_deleted}`);
      console.log(`     Unrealized Funding: $${position.unrealized_funding.toFixed(6)}`);
      console.log(`     Estimated Liquidation Price: $${position.estimated_liquidation_price.toFixed(6)}`);
      console.log(`     Event UID: ${position.event_uid} | Transaction Version: ${position.transaction_version}`);
      
      if (position.tp_order_id) {
        console.log(`     Take Profit: ID=${position.tp_order_id}, Trigger=$${position.tp_trigger_price?.toFixed(6)}, Limit=$${position.tp_limit_price?.toFixed(6)}`);
      }
      if (position.sl_order_id) {
        console.log(`     Stop Loss: ID=${position.sl_order_id}, Trigger=$${position.sl_trigger_price?.toFixed(6)}, Limit=$${position.sl_limit_price?.toFixed(6)}`);
      }
      console.log(`     Fixed Size TP/SL: ${position.has_fixed_sized_tpsls}`);
    });

    // 3. 특정 마켓의 포지션만 조회
    console.log("\n🎯 특정 마켓 포지션 조회 중...");
    const aptUsdMarket = MARKET_LIST["APT/USD"];
    const marketPositions = await getAccountPositions({
      decidashConfig: config,
      user: userAddress,
      includeDeleted: false, // 활성 포지션만
      limit: 5,
      marketAddress: aptUsdMarket,
    });
    
    console.log(`✅ APT/USD 마켓의 ${marketPositions.length}개 활성 포지션:`);
    marketPositions.forEach((position, index) => {
      console.log(`  ${index + 1}. Size: ${position.size.toFixed(6)} | Entry: $${position.entry_price.toFixed(6)}`);
      console.log(`     Leverage: ${position.user_leverage}x | PnL: $${position.unrealized_funding.toFixed(6)}`);
    });

  } catch (error) {
    console.error("❌ Account API 에러:", error);
  }
}

main().catch(console.error);
