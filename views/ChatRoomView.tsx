"use client"

import React from "react"
import { ArrowLeft, Search, Send, Plus, Smile } from "lucide-react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { TriggerToast } from "./components/trigger-toast"
import { BottomSheet } from "./components/bottom-sheet"
import { SelectionView } from "./components/selection-view"
import { DetailModal } from "./components/detail-modal"
import { PrivacyConsentModal } from "./components/privacy-consent-modal"
import { MessageBubble } from "./components/MessageBubble"
import { Message } from "../models/Message"
import { Restaurant } from "../models/Restaurant"

interface ChatRoomViewProps {
  messages: Message[]
  inputValue: string
  showToast: boolean
  showBottomSheet: boolean
  showSelectionView: boolean
  showDetailModal: boolean
  showPrivacyConsent: boolean
  sharedRestaurants: Restaurant[]
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  mockRestaurants: Restaurant[]
  setInputValue: (value: string) => void
  handleSendMessage: () => void
  handleToastClick: () => void
  handleConditionSubmit: () => void
  handleShareSelected: (restaurants: Restaurant[]) => void
  handleDetailClick: () => void
  handlePrivacyAgree: () => void
  handlePrivacyClose: () => void
  setShowBottomSheet: (show: boolean) => void
  setShowSelectionView: (show: boolean) => void
  setShowDetailModal: (show: boolean) => void
}

export function ChatRoomView({
  messages,
  inputValue,
  showToast,
  showBottomSheet,
  showSelectionView,
  showDetailModal,
  showPrivacyConsent,
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
}: ChatRoomViewProps) {
  return (
    <div className="flex flex-col h-screen bg-[#B2C7D9] max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#B2C7D9]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-transparent"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <span className="text-lg font-semibold">민지</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-transparent"
        >
          <Search className="w-5 h-5" />
        </Button>
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            onDetailClick={handleDetailClick}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Toast */}
      <TriggerToast show={showToast} onClick={handleToastClick} />

      {/* Input */}
      <div className="bg-white px-3 py-2 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Plus className="w-6 h-6" />
        </Button>
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          placeholder="메시지를 입력하세요"
          className="flex-1 border-0 bg-gray-100 rounded-full focus-visible:ring-0"
        />
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Smile className="w-6 h-6" />
        </Button>
        <Button
          onClick={handleSendMessage}
          size="icon"
          className="bg-[#FEE500] hover:bg-[#FDD800] text-black rounded-full"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Bottom Sheet - 장소 검색 조건*/}
      <BottomSheet
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        onSubmit={handleConditionSubmit}
      />

      {/* Selection View */}
      <SelectionView
        isOpen={showSelectionView}
        onClose={() => setShowSelectionView(false)}
        restaurants={mockRestaurants}
        onShare={handleShareSelected}
      />

      {/* Detail Modal */}
      <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        restaurants={sharedRestaurants}
      />

      {/* Privacy Consent Modal */}
      <PrivacyConsentModal
        isOpen={showPrivacyConsent}
        onAgree={handlePrivacyAgree}
        onClose={handlePrivacyClose}
      />
    </div>
  )
}
