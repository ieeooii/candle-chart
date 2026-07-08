/** REST 쿼리와 소켓 브리지가 공유하는 캔들 query key (계층형) */
export const candleKeys = {
  all: ['candle'] as const,
  seconds: () => {
    return [...candleKeys.all, 'seconds'] as const
  },
  secondsOf: (market: string) => {
    return [...candleKeys.seconds(), market] as const
  },
}
