export type CandleSeconds = {
  market: string
  candle_date_time_utc: string
  candle_date_time_kst: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  timestamp: number
  candle_acc_trade_price: number
  candle_acc_trade_volume: number
}

/** candle.1s WebSocket 실시간 메시지 (DEFAULT 포맷) */
export type CandleStreamMessage = {
  type: string
  code: string
  candle_date_time_utc: string
  candle_date_time_kst: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  candle_acc_trade_volume: number
  candle_acc_trade_price: number
  timestamp: number
  stream_type: 'SNAPSHOT' | 'REALTIME'
}
