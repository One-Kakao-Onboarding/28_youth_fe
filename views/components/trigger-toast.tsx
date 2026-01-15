"use client"

import { cn } from "@/lib/utils"

interface TriggerToastProps {
  show: boolean
  message: string
  onClick: () => void
}

export function TriggerToast({ show, message, onClick }: TriggerToastProps) {
  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 bottom-20 z-50 transition-all duration-300",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      <button
        onClick={onClick}
        className="bg-[rgba(50,50,50,0.9)] text-white px-4 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-[rgba(40,40,40,0.95)] transition-colors"
      >
        💡 {message || "맛집을 찾아드릴까요?"}
      </button>
    </div>
  )
}
