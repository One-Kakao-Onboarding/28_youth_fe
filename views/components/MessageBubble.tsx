import { Message } from "../../models/Message"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function MessageBubble({
  message,
  onDetailClick,
}: {
  message: Message
  onDetailClick: () => void
}) {
  const isUser = message.sender === "user"

  if (message.type === "card" && message.cardData) {
    return (
      <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
        <div className="max-w-[280px]">
          {/* 카드 메시지 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="p-3">
              <h3 className="font-bold text-sm text-foreground">
                {message.cardData.title}
              </h3>
            </div>
            <img
              src={message.cardData.image || "/placeholder.svg"}
              alt="맛집 지도"
              className="w-full h-32 object-cover"
            />
            <div className="border-t border-gray-200">
              <button
                onClick={onDetailClick}
                className="w-full py-3 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1"
              >
                상세보기 <span className="text-xs">{">"}</span>
              </button>
            </div>
          </div>
          <span className="text-[10px] text-gray-600 mt-1 block text-right">
            {message.time}
          </span>
        </div>
      </div>
    )
  }

  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-1">
        <span className="text-[10px] text-gray-600">{message.time}</span>
        <div className="bg-[#FEE500] rounded-2xl rounded-br-sm px-3 py-2 max-w-[240px]">
          <p className="text-sm text-foreground">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/korean-woman-profile.png" />
        <AvatarFallback>민지</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-xs text-foreground mb-1">민지</span>
        <div className="flex items-end gap-1">
          <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 max-w-[200px]">
            <p className="text-sm text-foreground">{message.content}</p>
          </div>
          <span className="text-[10px] text-gray-600">{message.time}</span>
        </div>
      </div>
    </div>
  )
}
