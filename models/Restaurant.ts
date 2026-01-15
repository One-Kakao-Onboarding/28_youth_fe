export interface Restaurant {
  id: string
  name: string
  category: string
  rating: number
  address: string
  image: string
  distance: string
}

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "강남 돈까스 본점",
    category: "일식 • 돈까스",
    rating: 4.8,
    address: "서울 강남구 테헤란로 123",
    image: "/tonkatsu-japanese-food.jpg",
    distance: "도보 5분",
  },
  {
    id: "2",
    name: "미도인 강남점",
    category: "한식 • 백반",
    rating: 4.5,
    address: "서울 강남구 강남대로 456",
    image: "/korean-traditional-food.jpg",
    distance: "도보 8분",
  },
  {
    id: "3",
    name: "파스타랩 강남",
    category: "양식 • 파스타",
    rating: 4.7,
    address: "서울 강남구 역삼동 789",
    image: "/italian-pasta-dish.png",
    distance: "도보 3분",
  },
  {
    id: "4",
    name: "홍콩반점 강남",
    category: "중식 • 짜장면",
    rating: 4.3,
    address: "서울 강남구 논현동 321",
    image: "/chinese-jajangmyeon-noodles.jpg",
    distance: "도보 10분",
  },
  {
    id: "5",
    name: "스시오마카세",
    category: "일식 • 스시",
    rating: 4.9,
    address: "서울 강남구 청담동 555",
    image: "/sushi-omakase-platter.jpg",
    distance: "도보 12분",
  },
]
