"use client"

import { useState, useRef, useEffect } from "react"
import {
  initialMessages,
  TRIGGER_KEYWORDS,
  Message,
} from "../models/Message"
import { Restaurant, mockRestaurants } from "../models/Restaurant"

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
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [showSelectionView, setShowSelectionView] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false)
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([])
  const [sharedRestaurants, setSharedRestaurants] = useState<Restaurant[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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

  const checkTriggerKeywords = (text: string) => {
    return TRIGGER_KEYWORDS.some(keyword => text.includes(keyword))
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

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

    if (checkTriggerKeywords(inputValue)) {
      setTimeout(() => {
        setShowToast(true)
      }, 1000)
    }

    setInputValue("")
  }

  const handleToastClick = () => {
    setShowToast(false)

    // 개인정보 동의 확인
    const hasConsented = localStorage.getItem("privacy_consent_agreed")
    if (!hasConsented) {
      setShowPrivacyConsent(true)
    } else {
      setShowBottomSheet(true)
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
        title: "맛깨비 추천 리스트",
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
    showBottomSheet,
    showSelectionView,
    showDetailModal,
    showPrivacyConsent,
    selectedRestaurants,
    sharedRestaurants,
    messagesEndRef,
    mockRestaurants,
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
