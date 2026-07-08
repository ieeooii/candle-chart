import { useQuery } from '@tanstack/react-query'
import { getCandleSeconds } from '@/entities/candle/api/getCandleSeconds'
import { candleKeys } from '@/entities/candle/api/candleQueryKeys'

type UseCandleSecondsQueryParams = {
  market: string
  to?: string
  count?: number
}

export const useCandleSecondsQuery = ({
  market,
  to,
  count,
}: UseCandleSecondsQueryParams) => {
  return useQuery({
    // count/to는 키에서 제외 — 소켓 브리지가 같은 리스트를 찾을 수 있어야 한다
    queryKey: candleKeys.secondsOf(market),
    queryFn: () => {
      return getCandleSeconds({ market, to, count })
    },
  })
}
