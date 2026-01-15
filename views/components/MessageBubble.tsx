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
    // 최대 4개까지만 표시
    const displayRestaurants = message.cardData.restaurants.slice(0, 4)

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

            {/* 레스토랑 리스트 */}
            <div className="divide-y divide-gray-100">
              {displayRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="flex gap-3 p-3">
                  {/* 왼쪽: 이미지 */}
                  <img
                    src={restaurant.image || "/28_youth_fe/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* 오른쪽: 정보 */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {restaurant.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {restaurant.category}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-xs text-gray-600">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
        <AvatarImage src="/28_youth_fe/korean-woman-profile.png" />
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
