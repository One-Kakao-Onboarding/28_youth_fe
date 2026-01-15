import { Restaurant } from "./Restaurant"

export interface Message {
  id: string
  sender: "user" | "bot"
  content: string
  time: string
  type: "text" | "card"
  cardData?: {
    title: string
    image: string
    restaurants: Restaurant[]
  }
}

export const TRIGGER_KEYWORDS = ["강남", "건대", "점심", "저녁", "뭐 먹지", "메뉴 추천", "배고파", "밥", "식사", "레스토랑", "맛집", "카페", "디저트", "오늘", "내일", "주말", "어디", "추천", "뭐해?", "뭐하니?"]
export const COOLTIME_MS = 5 * 60 * 1000 // 5분
 
export const initialMessages: Message[] = [
  {
    id: "1",
    sender: "bot",
    content: "안녕! 오랜만이야 😊",
    time: "오후 2:30",
    type: "text",
  },
  {
    id: "2",
    sender: "user",
    content: "오 안녕! 잘 지냈어?",
    time: "오후 2:31",
    type: "text",
  },
  {
    id: "3",
    sender: "bot",
    content: "응 잘 지냈지~ 너는?",
    time: "오후 2:31",
    type: "text",
  },
]
