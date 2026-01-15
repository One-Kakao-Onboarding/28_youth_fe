import SockJS from 'sockjs-client'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080'

export interface ChatMessageDto {
  id?: number
  roomId: number
  senderId?: string
  senderNickname?: string
  content: string
  type?: 'TALK' | 'ENTER' | 'LEAVE'
  createdAt?: string
}

// 추천 알림 DTO (신규)
export interface RecommendationPromptDto {
  analysisId: string
  location: string
  mealType: string
  confidence: number
  time: string
}

// 맛집 추천 DTO (신규)
export interface SuggestionDto {
  type: 'card'
  message: string
  cardData: {
    title: string
    image: string
    restaurants: Array<{
      id: number
      name: string
      category: string
      locationText: string
      address: string
      description: string
      rating: number
      image: string
      distance: string
    }>
  }
  time: string
}

// 추천 요청 DTO (신규)
export interface RecommendationRequestDto {
  analysisId: string
  userId?: string
}

// 에러 DTO (신규)
export interface ErrorDto {
  message: string
}

export interface WebSocketConfig {
  userId: string
  nickname: string
  roomId: number
  onMessageReceived: (message: ChatMessageDto) => void
  onRecommendationPrompt?: (prompt: RecommendationPromptDto) => void // 신규
  onSuggestion?: (suggestion: SuggestionDto) => void // 신규
  onError?: (error: ErrorDto) => void // 변경
  onConnected?: () => void
  onDisconnected?: () => void
}

export class WebSocketClient {
  private client: Client | null = null
  private chatSubscription: StompSubscription | null = null
  private promptSubscription: StompSubscription | null = null
  private suggestionSubscription: StompSubscription | null = null
  private errorSubscription: StompSubscription | null = null
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
      console.log('[WebSocket] Connected')

      // 1. 채팅방 메시지 구독
      const chatDestination = `/sub/room/${config.roomId}`
      console.log('[WebSocket] Subscribing to chat:', chatDestination)
      this.chatSubscription = this.client!.subscribe(chatDestination, (message: IMessage) => {
        try {
          console.log('[WebSocket] Chat message received:', message.body)
          const chatMessage: ChatMessageDto = JSON.parse(message.body)
          config.onMessageReceived(chatMessage)
        } catch (error) {
          console.error('[WebSocket] Failed to parse chat message:', error)
        }
      })

      // 2. 추천 알림 구독 (신규)
      console.log('[WebSocket] Attempting to subscribe to /user/queue/recommendation-prompt')
      console.log('[WebSocket] Current userId:', config.userId)
      this.promptSubscription = this.client!.subscribe('/user/queue/recommendation-prompt', (message: IMessage) => {
        try {
          console.log('[WebSocket] ===== Recommendation prompt received =====')
          console.log('[WebSocket] Raw message body:', message.body)
          const prompt: RecommendationPromptDto = JSON.parse(message.body)
          console.log('[WebSocket] Parsed prompt data:', {
            analysisId: prompt.analysisId,
            location: prompt.location,
            mealType: prompt.mealType,
            confidence: prompt.confidence,
            time: prompt.time
          })
          console.log('[WebSocket] Full prompt object:', prompt)
          config.onRecommendationPrompt?.(prompt)
        } catch (error) {
          console.error('[WebSocket] Failed to parse recommendation prompt:', error)
          console.error('[WebSocket] Raw data that failed:', message.body)
        }
      })
      console.log('[WebSocket] Subscription ID for recommendation-prompt:', this.promptSubscription?.id)
      console.log('[WebSocket] Successfully subscribed to /user/queue/recommendation-prompt')

      // 3. 맛집 추천 구독 (신규)
      console.log('[WebSocket] Subscribing to suggestions')
      this.suggestionSubscription = this.client!.subscribe('/user/queue/suggestions', (message: IMessage) => {
        try {
          console.log('[WebSocket] Suggestion received:', message.body)
          const suggestion: SuggestionDto = JSON.parse(message.body)
          config.onSuggestion?.(suggestion)
        } catch (error) {
          console.error('[WebSocket] Failed to parse suggestion:', error)
        }
      })

      // 4. 에러 메시지 구독 (신규)
      console.log('[WebSocket] Subscribing to errors')
      this.errorSubscription = this.client!.subscribe('/user/queue/errors', (message: IMessage) => {
        try {
          console.log('[WebSocket] Error received:', message.body)
          const errorDto: ErrorDto = JSON.parse(message.body)
          config.onError?.(errorDto)
        } catch (error) {
          console.error('[WebSocket] Failed to parse error:', error)
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
      config.onError?.({ message: frame.body || 'WebSocket connection error' })
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

  requestRecommendation(analysisId: string) {
    if (!this.client || !this.client.connected) {
      console.error('[WebSocket] Cannot request recommendation: not connected')
      return
    }

    const request: RecommendationRequestDto = {
      analysisId,
      userId: this.config?.userId,
    }

    console.log('[WebSocket] Requesting recommendation:', request)

    this.client.publish({
      destination: '/pub/request-recommendation',
      body: JSON.stringify(request),
    })

    console.log('[WebSocket] Recommendation request sent to /pub/request-recommendation')
  }

  disconnect() {
    console.log('[WebSocket] Disconnecting...')

    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe()
      this.chatSubscription = null
      console.log('[WebSocket] Unsubscribed from chat')
    }

    if (this.promptSubscription) {
      this.promptSubscription.unsubscribe()
      this.promptSubscription = null
      console.log('[WebSocket] Unsubscribed from recommendation prompt')
    }

    if (this.suggestionSubscription) {
      this.suggestionSubscription.unsubscribe()
      this.suggestionSubscription = null
      console.log('[WebSocket] Unsubscribed from suggestions')
    }

    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe()
      this.errorSubscription = null
      console.log('[WebSocket] Unsubscribed from errors')
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
