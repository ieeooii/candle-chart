import { UpbitSocket } from '@/shared/api/socket/UpbitSocket'
import type { CandleStreamMessage } from '@/entities/candle/model/candle'

/**
 * KRW-BTC 초봉 실시간 소켓 싱글턴.
 * export 자체가 모듈 캐싱으로 싱글턴 역할을 한다.
 */
export const candleSocket = new UpbitSocket<CandleStreamMessage>('candle-chart', [
  { type: 'candle.1s', codes: ['KRW-BTC'] },
])
