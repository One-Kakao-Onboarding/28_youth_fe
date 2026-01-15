"use client"

import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface PrivacyConsentModalProps {
  isOpen: boolean
  onAgree: () => void
  onClose: () => void
}

export function PrivacyConsentModal({ isOpen, onAgree, onClose }: PrivacyConsentModalProps) {
  return (
    <>
      {/* 백드롭 */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 z-50 transition-opacity flex items-center justify-center",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        {/* 모달 */}
        <div
          className={cn(
            "bg-white rounded-2xl max-w-sm mx-4 p-6 space-y-4 transition-transform duration-300",
            isOpen ? "scale-100" : "scale-95",
          )}
        >
          {/* 아이콘 */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#FEE500] rounded-full flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
          </div>

          {/* 제목 */}
          <h2 className="text-xl font-bold text-center text-foreground">
            AI 맞춤 장소 추천
          </h2>

          {/* 설명 */}
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              더 정확한 장소 추천을 위해 다음 정보를 활용합니다:
            </p>
            <ul className="space-y-2 pl-5">
              <li className="flex items-start">
                <span className="mr-2">🍽️</span>
                <span>대화 내용 분석으로 취향 파악</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">⭐</span>
                <span>카카오 맵 즐겨찾기 기반 맞춤 추천</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 pt-2">
              * 수집된 정보는 장소 추천 목적으로만 사용되며, 언제든지 설정에서 철회 가능합니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={onAgree}
              className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-foreground font-semibold py-6 text-base"
            >
              동의하고 장소 추천받기
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700"
            >
              나중에 하기
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
