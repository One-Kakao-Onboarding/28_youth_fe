# 28 Youth - AI Restaurant Recommendation Chat

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-green?style=flat-square)

K-Talk 스타일 채팅으로 맛집 추천받는 AI 채팅 앱

</div>

---

## 📱 주요 기능

### Step 1. 대화방 (Chat Room)

**레이아웃**
- K-Talk 스타일 헤더 (친구 이름, 뒤로가기, 검색)
- 메시지 리스트
  - **사용자**: 우측 정렬, 노란색(`#FEE500`) 말풍선
  - **봇**: 좌측 정렬, 프로필 이미지(원형), 흰색 말풍선
  - 시간 표시 (말풍선 하단)

**트리거 & 토스트**
- 트리거: Claude AI가 대화 분석하여 맛집 추천 시점 자동 판단
- 토스트 UI
  - 위치: 채팅 입력창 위
  - 스타일: 짙은 회색(`rgba(50,50,50,0.9)`) 캡슐 모양
  - 예시: "💡 강남에서 점심 맛집을 추천받으시겠습니까?"

### Step 2. 조건 입력 (Bottom Sheet Modal)

**진입**: 토스트 클릭 → 바텀시트 슬라이드 업

**UI 구성**
- 상단 핸들 바
- 입력 폼 (위치, 카테고리, 예산)
- 하단 버튼: "결과 받기" (노란색 배경, 검은 글씨, Full Width)

### Step 3. 추천 결과 선택 (Selection View)

**UI 구성**
- 썸네일(좌측) + 텍스트(우측) 리스트
- 선택 인터랙션
  - 클릭 시 우측에 노란색 체크 아이콘(✔) 활성화
  - 선택된 아이템 배경: 옅은 노란색(`rgba(254,229,0,0.1)`)
- 전송 버튼: "3개 공유하기" (하단 노란색)

### Step 4. 공유 메시지 & 상세보기 (Card Message)

**공유 메시지 (커스텀 템플릿)**
```
┌─────────────────────────┐
│ 강남 맛집 추천 리스트    │ ← 제목 (Bold)
├─────────────────────────┤
│   [대표 이미지]          │ ← 지도/음식 사진
├─────────────────────────┤
│     [상세보기 >]         │ ← 클릭 유도 버튼
└─────────────────────────┘
```

**상세보기 모달**
- 바텀시트 또는 풀스크린 모달
- 선택한 식당 카드 리스트
- 각 카드: 별점, 주소, 지도 아이콘, 길찾기 버튼

---

## 🛠 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| **Framework** | Next.js | 16.0.10 |
| **UI Library** | React | 19.2.0 |
| **Language** | TypeScript | 5.0+ |
| **Styling** | Tailwind CSS | 4.1.9 |
| **WebSocket** | @stomp/stompjs | 7.2.1 |
| | sockjs-client | 1.6.1 |
| **UI Components** | Radix UI | 1.x |
| **Icons** | Lucide React | 0.454.0 |

---

## 🚀 시작하기

### 설치

```bash
# 클론
git clone https://github.com/One-Kakao-Onboarding/28_youth_fe.git
cd 28_youth_fe

# 의존성 설치
npm install
```

### 환경 변수 설정

`.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://192.168.8.180:8080
NEXT_PUBLIC_WS_URL=http://192.168.8.180:8080
```

### 개발 서버 실행

```bash
npm run dev
# http://localhost:3000
```

### 프로덕션 빌드

```bash
npm run build
npm run start
```

---

## 📁 프로젝트 구조

```
28_fe/
├── app/                    # Next.js App Router
├── views/                  # UI 컴포넌트
│   ├── ChatRoomView.tsx   # 채팅방 메인
│   └── components/
│       ├── MessageBubble.tsx      # 메시지 버블
│       ├── trigger-toast.tsx      # 추천 토스트
│       ├── bottom-sheet.tsx       # 조건 입력
│       ├── selection-view.tsx     # 맛집 선택
│       └── detail-modal.tsx       # 상세보기
├── controllers/            # 비즈니스 로직
│   └── useChatRoomController.ts
├── models/                 # 데이터 모델
│   ├── Restaurant.ts
│   └── Message.ts
├── lib/                    # 유틸리티
│   ├── websocket/client.ts
│   ├── api/client.ts
│   └── utils/user.ts
└── components/             # 앱 레벨 컴포넌트
```

---

## 🔌 WebSocket 통신

### 연결 설정

```typescript
import { createWebSocketClient } from '@/lib/websocket/client'

const wsClient = createWebSocketClient()

wsClient.connect({
  userId: string,
  nickname: string,
  roomId: number,
  onMessageReceived: (message) => { /* 채팅 메시지 */ },
  onRecommendationPrompt: (prompt) => { /* 추천 알림 */ },
  onSuggestion: (suggestion) => { /* 맛집 추천 */ },
  onError: (error) => { /* 에러 */ },
})
```

### 구독 채널

| 채널 | 설명 |
|------|------|
| `/sub/room/{roomId}` | 채팅방 메시지 |
| `/user/queue/recommendation-prompt` | 추천 알림 |
| `/user/queue/suggestions` | 맛집 추천 |
| `/user/queue/errors` | 에러 메시지 |

### 발행 엔드포인트

| 엔드포인트 | 설명 |
|-----------|------|
| `/pub/message` | 채팅 메시지 전송 |
| `/pub/request-recommendation` | 맛집 추천 요청 |

### 2단계 추천 플로우

```
[Client] 메시지 전송: "판교에서 점심 추천"
    ↓
[Server] Claude AI 분석
    ↓
[Client] 토스트 알림: "💡 판교에서 점심 맛집을 추천받으시겠습니까?"
    ↓ [사용자 클릭]
[Client] 추천 요청: /pub/request-recommendation
    ↓
[Server] 맛집 검색
    ↓
[Client] 카드 메시지 표시
```

---

## 📡 REST API

### 채팅방 관리

```typescript
// 모든 채팅방 조회
GET /api/rooms

// 특정 채팅방 조회
GET /api/rooms/:roomId

// 채팅방 생성
POST /api/rooms
Body: { name: string }

// 헬스체크
GET /api/health
```

---

## 🎨 디자인 시스템

### 컬러

| 용도 | 컬러 | 값 |
|------|------|-----|
| Primary (카카오 노랑) | Yellow | `#FEE500` |
| Secondary (진한 노랑) | Dark Yellow | `#FDD800` |
| User Bubble | Yellow | `#FEE500` |
| Bot Bubble | White | `#FFFFFF` |
| Toast Background | Dark Gray | `rgba(50,50,50,0.9)` |
| Selection Highlight | Light Yellow | `rgba(254,229,0,0.1)` |

### 타이포그래피

- 기본 폰트: 시스템 폰트
- 말풍선 텍스트: `14px`
- 시간 표시: `12px`, 회색

---

## 🐛 트러블슈팅

### WebSocket 연결 실패

```bash
# 백엔드 서버 확인
curl http://localhost:8080/api/health

# .env.local 확인
NEXT_PUBLIC_WS_URL=http://localhost:8080
```

### 추천 알림이 표시되지 않음

**원인**: 백엔드 Simple Broker 설정 오류

**해결**: 백엔드 `WebSocketConfig.java` 수정 필요
```java
config.enableSimpleBroker("/sub", "/user");  // "/user" 추가
```

### 브라우저 콘솔에서 userId 확인

```javascript
console.log('My userId:', localStorage.getItem('user_id'))
```

---

## 💻 개발 가이드

### 컴포넌트 작성

```typescript
// Props 인터페이스
interface ComponentProps {
  title: string
  onSubmit: (data: Restaurant) => void
}

// 함수형 컴포넌트
export function Component({ title, onSubmit }: ComponentProps) {
  const [state, setState] = useState()

  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    }
  }, [])

  return <div>{title}</div>
}
```

### WebSocket 클라이언트 사용

```typescript
// 연결
useEffect(() => {
  const wsClient = createWebSocketClient()
  wsClient.connect({ /* config */ })

  return () => {
    wsClient.disconnect()
  }
}, [])

// 메시지 전송
wsClient.sendMessage({
  roomId: 1,
  content: "메시지 내용",
  type: "TALK"
})

// 추천 요청
wsClient.requestRecommendation(analysisId)
```

---

## 📄 라이센스

MIT License - 28 Youth Team

---

<div align="center">

**Built with ❤️ by 28 Youth Team**

</div>
