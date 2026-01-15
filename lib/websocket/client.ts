import SockJS from 'sockjs-client'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080'

export interface ChatMessageDto {
  id?: number
  roomId: number
  senderId?: string
  senderNickname?: string
  content: string
  type?: 'TALK' | 'ENTER' | 'SUGGEST'
  createdAt?: string
}

export interface WebSocketConfig {
  userId: string
  nickname: string
  roomId: number
  onMessageReceived: (message: ChatMessageDto) => void
  onConnected?: () => void
  onError?: (error: any) => void
  onDisconnected?: () => void
}

export class WebSocketClient {
  private client: Client | null = null
  private subscription: StompSubscription | null = null
  private config: WebSocketConfig | null = null

  connect(config: WebSocketConfig) {
    this.config = config

    // 디버깅: 사용자 정보 확인
    console.log('[WebSocket] Connecting with:', {
      userId: config.userId,
      nickname: config.nickname,
      roomId: config.roomId,
      wsUrl: WS_URL
    })

    // SockJS 소켓 생성 (인증 정보는 STOMP connectHeaders로 전달)
    const sockJsUrl = `${WS_URL}/ws-chat`
    console.log('[WebSocket] SockJS URL:', sockJsUrl)
    const socket = new SockJS(sockJsUrl)

    // STOMP 클라이언트 생성
    this.client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        'X-User-Id': config.userId,
        'X-Nickname': config.nickname,
      },
      debug: (str) => {
        console.log('STOMP Debug:', str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    // 연결 성공 콜백
    this.client.onConnect = () => {
      console.log('WebSocket connected')

      // 채팅방 구독
      const destination = `/sub/room/${config.roomId}`
      console.log('[WebSocket] Subscribing to:', destination)

      this.subscription = this.client!.subscribe(destination, (message: IMessage) => {
        try {
          console.log('[WebSocket] Raw message received:', message)
          const chatMessage: ChatMessageDto = JSON.parse(message.body)
          console.log('[WebSocket] Parsed message:', chatMessage)
          config.onMessageReceived(chatMessage)
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error, message)
        }
      })

      config.onConnected?.()
    }

    // 연결 에러 콜백
    this.client.onStompError = (frame) => {
      console.error('[WebSocket] STOMP error:', frame)
      console.error('[WebSocket] Error details:', {
        command: frame.command,
        headers: frame.headers,
        body: frame.body
      })
      config.onError?.(frame)
    }

    // 연결 해제 콜백
    this.client.onDisconnect = () => {
      console.log('[WebSocket] Disconnected')
      config.onDisconnected?.()
    }

    // 연결 시작
    console.log('[WebSocket] Activating connection...')
    this.client.activate()
  }

  sendMessage(message: ChatMessageDto) {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket is not connected')
      return
    }

    if (!this.config) {
      console.error('WebSocket config is not set')
      return
    }

    // 메시지에 발신자 정보 추가
    const messageWithSender: ChatMessageDto = {
      ...message,
      senderId: this.config.userId,
      senderNickname: this.config.nickname,
      type: message.type || 'TALK',
    }

    console.log('[WebSocket] Sending message:', messageWithSender)

    this.client.publish({
      destination: '/pub/message',
      body: JSON.stringify(messageWithSender),
    })

    console.log('[WebSocket] Message sent to /pub/message')
  }

  disconnect() {
    console.log('[WebSocket] Disconnecting...')

    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
      console.log('[WebSocket] Unsubscribed from topic')
    }

    if (this.client) {
      this.client.deactivate()
      this.client = null
      console.log('[WebSocket] Client deactivated')
    }

    this.config = null
    console.log('[WebSocket] Disconnect complete')
  }

  isConnected(): boolean {
    return this.client?.connected || false
  }
}

export const createWebSocketClient = () => new WebSocketClient()
