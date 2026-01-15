"use client"

import { useState, useRef, useEffect } from "react"
import {
  initialMessages,
  COOLTIME_MS,
  TRIGGER_KEYWORDS,
  Message,
} from "../models/Message"
import { Restaurant, mockRestaurants } from "../models/Restaurant"

export function useChatRoomController() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [showSelectionView, setShowSelectionView] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([])
  const [sharedRestaurants, setSharedRestaurants] = useState<Restaurant[]>([])
  const lastTriggerTime = useRef<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

    const now = Date.now()
    if (
      checkTriggerKeywords(inputValue) &&
      now - lastTriggerTime.current > COOLTIME_MS
    ) {
      lastTriggerTime.current = now
      setTimeout(() => {
        setShowToast(true)
      }, 1000)
    }

    setInputValue("")
  }

  const handleToastClick = () => {
    setShowToast(false)
    setShowBottomSheet(true)
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
        title: "강남 맛집 추천 리스트",
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
    setShowBottomSheet,
    setShowSelectionView,
    setShowDetailModal,
  }
}
