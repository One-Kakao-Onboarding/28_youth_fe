"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export function BottomSheet({ isOpen, onClose, onSubmit }: BottomSheetProps) {
  const [location, setLocation] = useState("강남역")
  const [category, setCategory] = useState("")

  const categories = ["한식", "일식", "중식", "양식", "카페"]

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
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 transition-transform duration-300 max-w-md mx-auto",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* 핸들 바 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-lg font-semibold text-foreground">맛집 검색 조건</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 폼 */}
        <div className="px-5 pb-6 space-y-5">
          {/* 위치 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">위치</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="위치를 입력하세요"
              className="bg-gray-50 border-gray-200 focus-visible:ring-[#FEE500]"
            />
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">카테고리</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    category === cat ? "bg-[#FEE500] text-foreground" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 결과 받기 버튼 */}
          <Button
            onClick={onSubmit}
            className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-foreground font-semibold py-6 text-base"
          >
            결과 받기
          </Button>
        </div>
      </div>
    </>
  )
}
