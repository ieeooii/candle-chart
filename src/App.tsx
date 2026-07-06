import { useCandleSecondsQuery } from '@/entities/candle/api/useCandleSecondsQuery'
import './App.css'

function App() {
  const { data, isLoading, error } = useCandleSecondsQuery({
    market: 'KRW-BTC',
    count: 5,
  })

  if (isLoading) {
    return <div>Loading…</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <ul>
      {data?.map((candle) => {
        return (
          <li key={candle.timestamp}>
            {candle.candle_date_time_kst} — {candle.trade_price.toLocaleString()}{' '}
            KRW
          </li>
        )
      })}
    </ul>
  )
}

export default App
