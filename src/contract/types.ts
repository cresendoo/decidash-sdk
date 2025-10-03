/**
 * @description Order Event
 * @example
{
    client_order_id:{ vec: [0:"1"] }
    details:""
    is_bid:true
    is_taker:true
    market:"0x30ab74e43dec09f38143df8d7d2aa0b639e1b43a862625a1bcf0a899f836914"
    metadata_bytes:"0x0000000000000000"
    order_id:"440284"
    orig_size:"10000000000"
    parent:"0x90033945bd28f73452b357683caf16604f7b721ca1213d772f28fc0e8f677529"
    price:"11000000000000"
    remaining_size:"10000000000"
    size_delta:"10000000000"
    status:{ __variant__:"ACKNOWLEDGED" }
    time_in_force:{__variant__:"POST_ONLY"}
    trigger_condition:{ vec:[] }
    user:"0x38df7150a61e8790ea1c23c522e0caa66bb7534c6ae73476cbfc9a51d677242d"
}
*/
export type OrderEvent = {
  client_order_id: { vec: any[] };
  details: string;
  is_bid: boolean;
  is_taker: boolean;
  market: string;
  metadata_bytes: string;
  order_id: string;
  orig_size: string;
  parent: string;
  price: string;
  remaining_size: string;
  size_delta: string;
  status: { __variant__: string };
  time_in_force: { __variant__: string };
  trigger_condition: { vec: any[] };
  user: string;
};

/**
 * @description Time In Force
 * 0: GTC - Good Till Cancelled. 주문이 체결되거나 직접 취소할 때까지 계속 남아있음. // limit order
 *
 * 1: POST_ONLY - Post Only. 오더북에만 올라가고, 바로 체결(=taker)되면 아예 거절됨. maker만 가능.
 *
 * 2: IOC - Immediate or Cancel order type. 가능한 만큼 바로 체결, 남은 건 전부 취소. 즉시 체결 안 되면 전체 취소, Market Order 타입.
 */
export type TimeInForce = 0 | 1 | 2;
