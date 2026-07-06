import { useQuery } from '@tanstack/react-query'
import { getCandleSeconds } from '@/entities/candle/api/getCandleSeconds'

type UseCandleSecondsQueryParams = {
  market: string
  to?: string
  count?: number
}

export const useCandleSecondsQuery = (params: UseCandleSecondsQueryParams) => {
  return useQuery({
    queryKey: ['candle', 'seconds', params],
    queryFn: () => {
      return getCandleSeconds(params)
    },
  })
}
