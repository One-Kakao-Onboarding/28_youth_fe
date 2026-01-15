"use client"

import { useChatRoomController } from "@/controllers/useChatRoomController"
import { ChatRoomView } from "../views/ChatRoomView"

export function ChatRoom() {
  const controller = useChatRoomController()

  return <ChatRoomView {...controller} />
}