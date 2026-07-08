export type SocketListener<TMessage> = (message: TMessage) => void

/**
 * 거래소와 무관한 범용 WebSocket 전송 계층.
 * 연결 생명주기 / 재연결(backoff) / heartbeat / 구독 관리(Observer)를 담당한다.
 * provider 특화 지점(url, onOpen, parse, ping)만 하위 클래스가 채운다. (Template Method)
 */
export abstract class Socket<TMessage> {
  private ws: WebSocket | null = null
  private listeners = new Set<SocketListener<TMessage>>()
  private shouldReconnect = false
  private reconnectAttempts = 0
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null

  protected heartbeatInterval = 30_000
  protected maxReconnectDelay = 10_000

  /** 연결할 WebSocket 엔드포인트 */
  protected abstract url: string
  /** 연결 직후(onopen) 실행 — 구독 메시지 전송 지점 */
  protected abstract onOpen(): void
  /** 원본 프레임을 애플리케이션 메시지로 변환 (바이너리 디코딩 등) */
  protected abstract parse(raw: MessageEvent['data']): Promise<TMessage> | TMessage
  /** 연결 유지용 keep-alive 프레임 전송 */
  protected abstract ping(): void

  connect() {
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) {
      return
    }

    this.shouldReconnect = true

    const ws = new WebSocket(this.url)
    ws.binaryType = 'arraybuffer'

    ws.onopen = () => {
      this.reconnectAttempts = 0
      this.startHeartbeat()
      this.onOpen()
    }

    ws.onmessage = async (event) => {
      const message = await this.parse(event.data)
      this.notify(message)
    }

    ws.onclose = () => {
      this.stopHeartbeat()
      if (this.shouldReconnect) {
        this.scheduleReconnect()
      }
    }

    ws.onerror = () => {
      ws.close()
    }

    this.ws = ws
  }

  disconnect() {
    this.shouldReconnect = false
    this.stopHeartbeat()
    this.ws?.close()
    this.ws = null
  }

  /** 리스너 등록 후 연결을 보장한다. 반환된 함수를 호출하면 구독 해제. */
  subscribe(listener: SocketListener<TMessage>) {
    this.listeners.add(listener)
    this.connect()

    return () => {
      this.listeners.delete(listener)
    }
  }

  /** JSON 페이로드 전송 (구독 메시지 등) */
  send(payload: unknown) {
    this.sendRaw(JSON.stringify(payload))
  }

  protected sendRaw(data: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data)
    }
  }

  private notify(message: TMessage) {
    this.listeners.forEach((listener) => {
      listener(message)
    })
  }

  private scheduleReconnect() {
    this.reconnectAttempts += 1
    const delay = Math.min(
      1_000 * 2 ** this.reconnectAttempts,
      this.maxReconnectDelay,
    )

    setTimeout(() => {
      if (this.shouldReconnect) {
        this.connect()
      }
    }, delay)
  }

  private startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      this.ping()
    }, this.heartbeatInterval)
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }
}
