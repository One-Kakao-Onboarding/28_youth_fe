"use client"

import { X, Star, MapPin, Navigation } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import type { Restaurant } from "../../models/Restaurant"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  restaurants: Restaurant[]
}

export function DetailModal({ isOpen, onClose, restaurants }: DetailModalProps) {
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

      {/* 풀스크린 모달 */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-50 transition-transform duration-300 max-w-md mx-auto flex flex-col",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* 헤더 */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-foreground">강남 맛집 추천 리스트</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </header>

        {/* 카드 리스트 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {/* 이미지 */}
              <img
                src={restaurant.image || "/placeholder.svg"}
                alt={restaurant.name}
                className="w-full h-40 object-cover"
              />

              {/* 정보 */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{restaurant.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{restaurant.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FEE500] px-2 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
                    <span className="text-sm font-semibold text-foreground">{restaurant.rating}</span>
                  </div>
                </div>

                {/* 주소 */}
                <div className="flex items-center gap-2 mt-3 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{restaurant.address}</span>
                </div>

                {/* 거리 + 길찾기 */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-500">{restaurant.distance}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#3182F6] border-[#3182F6] hover:bg-[#3182F6]/10 bg-transparent"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    길찾기
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t border-gray-100">
          <Button
            onClick={onClose}
            className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-foreground font-semibold py-6 text-base"
          >
            닫기
          </Button>
        </div>
      </div>
    </>
  )
}
