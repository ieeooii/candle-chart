import { https } from '@/shared/api/client'
import type { CandleSeconds } from '@/entities/candle/model/candle'

type GetCandleSecondsParams = {
  market: string
  to?: string
  count?: number
}

export const getCandleSeconds = async (params: GetCandleSecondsParams) => {
  const response = await https.get('/candles/seconds', params)
  return response.json() as Promise<CandleSeconds[]>
}
