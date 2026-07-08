import type {
  CandleSeconds,
  CandleStreamMessage,
} from '@/entities/candle/model/candle'

/** 실시간 스트림 메시지를 REST 캔들 형태로 변환 (code → market) */
const toCandle = (message: CandleStreamMessage): CandleSeconds => {
  return {
    market: message.code,
    candle_date_time_utc: message.candle_date_time_utc,
    candle_date_time_kst: message.candle_date_time_kst,
    opening_price: message.opening_price,
    high_price: message.high_price,
    low_price: message.low_price,
    trade_price: message.trade_price,
    timestamp: message.timestamp,
    candle_acc_trade_price: message.candle_acc_trade_price,
    candle_acc_trade_volume: message.candle_acc_trade_volume,
  }
}

/**
 * 최신순(newest-first) 캔들 리스트에 실시간 메시지를 병합한다.
 * - 같은 초 캔들이면 맨 앞 항목을 교체
 * - 새로운 초 캔들이면 앞에 추가하고 길이를 유지
 * 캐시가 아직 없으면(REST 미완료) 그대로 둔다.
 */
export const mergeCandleStream = (
  prev: CandleSeconds[] | undefined,
  message: CandleStreamMessage,
): CandleSeconds[] | undefined => {
  if (!prev || prev.length === 0) {
    return prev
  }

  const incoming = toCandle(message)
  const [head, ...rest] = prev

  if (head.candle_date_time_utc === incoming.candle_date_time_utc) {
    return [incoming, ...rest]
  }

  return [incoming, ...prev].slice(0, prev.length)
}
