"use client"

import { useState } from "react"
import { Check, X, Star } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import type { Restaurant } from "../../models/Restaurant"

interface SelectionViewProps {
  isOpen: boolean
  onClose: () => void
  restaurants: Restaurant[]
  onShare: (selected: Restaurant[]) => void
}

export function SelectionView({ isOpen, onClose, restaurants, onShare }: SelectionViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleShare = () => {
    const selected = restaurants.filter((r) => selectedIds.includes(r.id))
    onShare(selected)
    setSelectedIds([])
  }

  return (
    <>
      {/* 백드롭 */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* 바텀 시트 */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 transition-transform duration-300 max-w-md mx-auto max-h-[80vh] flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* 핸들 바 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-lg font-semibold text-foreground">추천 맛집 선택</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 리스트 */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <div className="space-y-2">
            {restaurants.map((restaurant) => {
              const isSelected = selectedIds.includes(restaurant.id)
              return (
                <button
                  key={restaurant.id}
                  onClick={() => toggleSelect(restaurant.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                    isSelected ? "bg-[rgba(254,229,0,0.1)]" : "hover:bg-gray-50",
                  )}
                >
                  {/* 썸네일 */}
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  {/* 텍스트 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate">{restaurant.name}</h3>
                    <p className="text-xs text-gray-500">{restaurant.category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-foreground">{restaurant.rating}</span>
                      <span className="text-xs text-gray-400">• {restaurant.distance}</span>
                    </div>
                  </div>

                  {/* 체크 아이콘 */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                      isSelected ? "bg-[#FEE500]" : "bg-gray-200",
                    )}
                  >
                    {isSelected && <Check className="w-4 h-4 text-foreground" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 공유 버튼 */}
        <div className="p-5 border-t border-gray-100">
          <Button
            onClick={handleShare}
            disabled={selectedIds.length === 0}
            className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-foreground font-semibold py-6 text-base disabled:opacity-50"
          >
            {selectedIds.length > 0 ? `${selectedIds.length}개 공유하기` : "맛집을 선택하세요"}
          </Button>
        </div>
      </div>
    </>
  )
}
