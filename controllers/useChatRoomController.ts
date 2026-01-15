"use client"

import { useState, useRef, useEffect } from "react"
import {
  initialMessages,
  Message,
} from "../models/Message"
import { Restaurant, mockRestaurants } from "../models/Restaurant"
import {
  createWebSocketClient,
  ChatMessageDto,
  RecommendationPromptDto,
  SuggestionDto,
  ErrorDto,
} from "../lib/websocket/client"
import { getUserId, getUserNickname } from "../lib/utils/user"

// 채팅방 ID (실제로는 props나 context에서 가져와야 합니다)
const ROOM_ID = 1

export function useChatRoomController() {
  // 서버에서 해야할 일:
  // 1. 해당 톡방의 모든 메세지 조회 -> messages 변수에 담아주기
  // 2. 새로운 메세지를 웹 소켓을 활용해 추가하기 -> messages 변수에 담아주기
  // 3. 현재 내가 보낸 메세지에 checkTriggerKeywords가 해당한다면, 내가 이전에 보낸 메세지까지 최대 10개를 포함해서 인공지능으로 장소를 추천해줘야하는 상황인지를 체크
  // 3-1. 장소를 추천할 수 있다면, 추천 가능성과 [약속 장소 지역, 약속 상황] 그리고 토스트 메세지를 서버에서 제공
  // 4. 서버에서 [약속 장소 지역, 약속 상황]을 받으면, 사용자의 맵 데이터에서 해당 지역의 즐겨찾기 한 곳 그리고 취향에 맞는 장소를 추천해준다.
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState<RecommendationPromptDto | null>(null)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [showSelectionView, setShowSelectionView] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false)
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([])
  const [sharedRestaurants, setSharedRestaurants] = useState<Restaurant[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsClientRef = useRef(createWebSocketClient())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // WebSocket 연결 설정
  useEffect(() => {
    const userId = getUserId()
    const nickname = getUserNickname()

    console.log('[ChatRoom] User Info:', { userId, nickname })

    if (!userId || !nickname) {
      console.error('User ID or nickname not found')
      return
    }

    const wsClient = wsClientRef.current

    wsClient.connect({
      userId,
      nickname,
      roomId: ROOM_ID,
      onMessageReceived: (chatMessage: ChatMessageDto) => {
        // 백엔드에서 받은 메시지를 프론트엔드 Message 형식으로 변환
        const message: Message = {
          id: chatMessage.id?.toString() || Date.now().toString(),
          sender: chatMessage.senderId === userId ? "user" : "bot",
          content: chatMessage.content,
          time: chatMessage.createdAt
            ? new Date(chatMessage.createdAt).toLocaleTimeString("ko-KR", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : new Date().toLocaleTimeString("ko-KR", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
          type: "text",
        }

        setMessages(prev => [...prev, message])
      },
      onRecommendationPrompt: (prompt: RecommendationPromptDto) => {
        console.log('[ChatRoom] ===== Recommendation prompt callback =====')
        console.log('[ChatRoom] Prompt data:', prompt)
        console.log('[ChatRoom] analysisId:', prompt.analysisId)
        console.log('[ChatRoom] location:', prompt.location)
        console.log('[ChatRoom] mealType:', prompt.mealType)
        console.log('[ChatRoom] confidence:', prompt.confidence)
        console.log('[ChatRoom] time:', prompt.time)

        // 추천 알림 토스트 표시
        const message = `${prompt.location}에서 ${prompt.mealType} 맛집을 추천받으시겠습니까?`
        console.log('[ChatRoom] Toast message:', message)

        setCurrentPrompt(prompt)
        setToastMessage(message)
        setShowToast(true)
        console.log('[ChatRoom] Toast state updated - showToast: true')
      },
      onSuggestion: (suggestion: SuggestionDto) => {
        console.log('[ChatRoom] Suggestion received:', suggestion)
        // 맛집 추천 카드 메시지 추가
        const cardMessage: Message = {
          id: Date.now().toString(),
          sender: "bot",
          content: suggestion.message,
          time: suggestion.time,
          type: "card",
          cardData: {
            title: suggestion.cardData.title,
            image: suggestion.cardData.image,
            restaurants: suggestion.cardData.restaurants.map(r => ({
              ...r,
              source: 'ai_recommended' as const,
            })),
          },
        }

        setMessages(prev => [...prev, cardMessage])
        setSharedRestaurants(cardMessage.cardData!.restaurants)
      },
      onError: (error: ErrorDto) => {
        console.error('[ChatRoom] Error received:', error.message)
        // 에러 메시지 표시 (콘솔 로그만)
        // TODO: 필요시 UI에 에러 토스트 표시
      },
      onConnected: () => {
        console.log('WebSocket connected successfully')
        setIsConnected(true)
      },
      onDisconnected: () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
      },
    })

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      wsClient.disconnect()
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showToast])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const wsClient = wsClientRef.current

    // WebSocket이 연결되어 있으면 서버로 메시지 전송
    if (wsClient.isConnected()) {
      const chatMessage: ChatMessageDto = {
        roomId: ROOM_ID,
        content: inputValue,
        type: 'TALK',
      }

      wsClient.sendMessage(chatMessage)
    } else {
      // WebSocket이 연결되지 않았으면 로컬에만 메시지 추가 (fallback)
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        content: inputValue,
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        type: "text",
      }

      setMessages(prev => [...prev, newMessage])
    }

    setInputValue("")
  }

  const handleToastClick = () => {
    setShowToast(false)

    // 추천 요청 전송
    if (currentPrompt) {
      const wsClient = wsClientRef.current
      wsClient.requestRecommendation(currentPrompt.analysisId)
      setCurrentPrompt(null)
    }
  }

  const handlePrivacyAgree = () => {
    localStorage.setItem("privacy_consent_agreed", "true")
    setShowPrivacyConsent(false)
    setShowBottomSheet(true)
  }

  const handlePrivacyClose = () => {
    setShowPrivacyConsent(false)
  }

  const handleConditionSubmit = () => {
    setShowBottomSheet(false)
    setShowSelectionView(true)
  }

  const handleShareSelected = (restaurants: Restaurant[]) => {
    setSelectedRestaurants(restaurants)
    setSharedRestaurants(restaurants)
    setShowSelectionView(false)

    const cardMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: "",
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      type: "card",
      cardData: {
        title: "유라님의 지도에서 쏙 골라왔어요!",
        image: "/gangnam-food-map-restaurants.jpg",
        restaurants: restaurants,
      },
    }

    setMessages(prev => [...prev, cardMessage])
  }

  const handleDetailClick = () => {
    setShowDetailModal(true)
  }

  return {
    messages,
    inputValue,
    showToast,
    toastMessage,
    showBottomSheet,
    showSelectionView,
    showDetailModal,
    showPrivacyConsent,
    selectedRestaurants,
    sharedRestaurants,
    messagesEndRef,
    mockRestaurants,
    isConnected,
    setInputValue,
    handleSendMessage,
    handleToastClick,
    handleConditionSubmit,
    handleShareSelected,
    handleDetailClick,
    handlePrivacyAgree,
    handlePrivacyClose,
    setShowBottomSheet,
    setShowSelectionView,
    setShowDetailModal,
  }
}
