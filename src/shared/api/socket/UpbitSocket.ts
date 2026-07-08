import { Socket } from '@/shared/api/socket/Socket'

export type UpbitStreamType =
  | 'ticker'
  | 'trade'
  | 'orderbook'
  | `candle.${string}`

export type UpbitSubscription = {
  type: UpbitStreamType
  codes: string[]
}

const decoder = new TextDecoder()

/**
 * Upbit WebSocket 프로토콜 계층.
 * - 오픈 직후 [{ticket}, ...구독, {format}] 전송
 * - 바이너리(ArrayBuffer/Blob) 프레임을 JSON으로 디코딩
 * - keep-alive는 'PING' 텍스트 프레임
 * 구독 대상(subscriptions)만 주입받아 스트림별로 재사용한다.
 */
export class UpbitSocket<TMessage> extends Socket<TMessage> {
  protected url = 'wss://api.upbit.com/websocket/v1'

  private ticket: string
  private subscriptions: UpbitSubscription[]

  constructor(ticket: string, subscriptions: UpbitSubscription[]) {
    super()
    this.ticket = ticket
    this.subscriptions = subscriptions
  }

  protected onOpen() {
    this.send([
      { ticket: this.ticket },
      ...this.subscriptions,
      { format: 'DEFAULT' },
    ])
  }

  protected async parse(raw: MessageEvent['data']): Promise<TMessage> {
    const text =
      raw instanceof Blob ? await raw.text() : decoder.decode(raw as ArrayBuffer)

    return JSON.parse(text) as TMessage
  }

  protected ping() {
    this.sendRaw('PING')
  }
}
