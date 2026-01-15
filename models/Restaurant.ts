export interface Restaurant {
  id: number // 백엔드 스펙: number
  name: string
  category: string
  locationText: string // 백엔드 스펙: 위치 텍스트
  address: string
  description: string // 백엔드 스펙: 설명
  rating: number
  image: string
  distance: string
  source: 'favorite' | 'ai_recommended' // 클라이언트 전용: 출처
}

export const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "강남 돈까스 본점",
    category: "일식 • 돈까스",
    locationText: "강남역 2번 출구",
    address: "서울 강남구 테헤란로 123",
    description: "두툼한 돈까스와 바삭한 튀김옷의 조화",
    rating: 4.8,
    image: "/tonkatsu-japanese-food.jpg",
    distance: "도보 5분",
    source: "favorite",
  },
  {
    id: 2,
    name: "미도인 강남점",
    category: "한식 • 백반",
    locationText: "강남역 11번 출구",
    address: "서울 강남구 강남대로 456",
    description: "집밥 같은 따뜻한 한식 백반",
    rating: 4.5,
    image: "/korean-traditional-food.jpg",
    distance: "도보 8분",
    source: "favorite",
  },
  {
    id: 3,
    name: "파스타랩 강남",
    category: "양식 • 파스타",
    locationText: "역삼역 3번 출구",
    address: "서울 강남구 역삼동 789",
    description: "신선한 재료로 만든 수제 파스타",
    rating: 4.7,
    image: "/italian-pasta-dish.png",
    distance: "도보 3분",
    source: "ai_recommended",
  },
  {
    id: 4,
    name: "홍콩반점 강남",
    category: "중식 • 짜장면",
    locationText: "논현역 1번 출구",
    address: "서울 강남구 논현동 321",
    description: "옛날 짜장면의 진한 맛",
    rating: 4.3,
    image: "/chinese-jajangmyeon-noodles.jpg",
    distance: "도보 10분",
    source: "ai_recommended",
  },
  {
    id: 5,
    name: "스시오마카세",
    category: "일식 • 스시",
    locationText: "청담역 8번 출구",
    address: "서울 강남구 청담동 555",
    description: "신선한 제철 생선으로 만든 오마카세",
    rating: 4.9,
    image: "/sushi-omakase-platter.jpg",
    distance: "도보 12분",
    source: "ai_recommended",
  },
]
