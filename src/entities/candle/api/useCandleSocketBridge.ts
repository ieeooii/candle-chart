import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { candleSocket } from '@/entities/candle/api/candleSocket'
import { candleKeys } from '@/entities/candle/api/candleQueryKeys'
import { mergeCandleStream } from '@/entities/candle/lib/mergeCandleStream'
import type { CandleSeconds } from '@/entities/candle/model/candle'

/**
 * 실시간 캔들 소켓을 구독해 TanStack Query 캐시로 흘려보낸다.
 * 앱에서 한 번만 마운트하면 REST 쿼리(useCandleSecondsQuery)가
 * 자동으로 실시간 갱신된다.
 */
export const useCandleSocketBridge = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = candleSocket.subscribe((message) => {
      queryClient.setQueryData<CandleSeconds[]>(
        candleKeys.secondsOf(message.code),
        (prev) => {
          return mergeCandleStream(prev, message)
        },
      )
    })

    return unsubscribe
  }, [queryClient])
}
