# 28 Youth - AI-Powered Restaurant Recommendation Chat

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-green?style=for-the-badge)

실시간 채팅과 AI 기반 맛집 추천을 결합한 차세대 음식점 추천 플랫폼

[Features](#-주요-기능) • [Tech Stack](#-기술-스택) • [Getting Started](#-시작하기) • [Architecture](#-아키텍처) • [API Docs](#-api-문서)

</div>

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [아키텍처](#-아키텍처)
- [프로젝트 구조](#-프로젝트-구조)
- [API 문서](#-api-문서)
- [주요 컴포넌트](#-주요-컴포넌트)
- [WebSocket 통신](#-websocket-통신)
- [개발 가이드](#-개발-가이드)
- [트러블슈팅](#-트러블슈팅)
- [성능 최적화](#-성능-최적화)
- [기여하기](#-기여하기)

---

## 🎯 프로젝트 소개

**28 Youth**는 실시간 채팅을 통해 사용자의 의도를 파악하고, Claude AI를 활용하여 맥락에 맞는 맛집을 추천하는 혁신적인 플랫폼입니다.

### 핵심 가치

- 🤖 **AI 기반 의도 분석**: Claude AI가 대화 맥락을 분석하여 정확한 추천 시점 판단
- ⚡ **실시간 양방향 통신**: WebSocket/STOMP 프로토콜을 통한 지연 없는 채팅 경험
- 🎯 **2단계 추천 플로우**: 사용자 동의 기반의 개인화된 추천 시스템
- 📱 **모바일 최적화**: 모바일 우선(Mobile-First) 설계로 직관적인 UX 제공

### 사용 시나리오

```
사용자: "내일 판교에서 점심 어디서 먹을까?"
      ↓
[AI 분석] 위치(판교), 시간(점심), 의도(맛집 추천) 파악
      ↓
[알림] 💡 판교에서 점심 맛집을 추천받으시겠습니까?
      ↓ [사용자 클릭]
[추천] 카카오맵 즐겨찾기 + AI 맞춤 추천 제공
```

---

## ✨ 주요 기능

### 1. 실시간 채팅

- **WebSocket 기반**: SockJS + STOMP 프로토콜을 통한 안정적인 실시간 통신
- **자동 재연결**: 네트워크 불안정 시 자동 재연결 (5초 간격)
- **하트비트**: 4초 간격 양방향 heartbeat로 연결 상태 유지
- **세션 관리**: UUID 기반 사용자 식별 및 세션 지속성

### 2. AI 기반 맛집 추천

#### 2단계 추천 프로세스

**1단계: 의도 분석 및 알림**
- Claude AI가 최근 10개 메시지 분석
- 맛집 추천이 필요한 맥락인지 판단 (신뢰도 0.6 이상)
- 위치, 식사 종류, 신뢰도를 포함한 알림 전송

**2단계: 사용자 요청 시 추천 제공**
- 사용자가 알림 클릭 시에만 실제 추천 실행
- 카카오맵 즐겨찾기 + AI 맞춤 추천 조합
- 5분간 유효한 analysisId 기반 요청 관리

#### 추천 알고리즘

```typescript
// 분석 결과 DTO
interface RecommendationPromptDto {
  analysisId: string      // 분석 결과 식별자
  location: string        // 추출된 지역 (예: "판교", "강남")
  mealType: string        // 식사 종류 (예: "점심", "저녁")
  confidence: number      // AI 신뢰도 (0.6 ~ 1.0)
  time: string           // 전송 시각
}
```

### 3. 스마트 UI/UX

- **동적 토스트 알림**: 맥락 기반 추천 메시지 (`${location}에서 ${mealType} 맛집을 추천받으시겠습니까?`)
- **카테고리별 분류**: 즐겨찾기 ⭐ / AI 추천 ✨ 구분 표시
- **상세 모달**: 풀스크린 모달에서 맛집 상세 정보 제공 (평점, 위치, 거리, 길찾기)
- **선택 공유**: 다중 선택 후 채팅방에 카드 형태로 공유

### 4. 개인정보 보호

- **동의 기반 추천**: 최초 사용 시 개인정보 동의 모달
- **로컬 저장소 관리**: localStorage 기반 동의 상태 저장
- **세션 격리**: 사용자별 독립적인 WebSocket 세션

---

## 🛠 기술 스택

### Frontend Framework

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 16.0.10 | React 프레임워크, SSR/SSG |
| **React** | 19.2.0 | UI 라이브러리 |
| **TypeScript** | 5.0+ | 타입 안전성 |

### Real-time Communication

| 기술 | 버전 | 용도 |
|------|------|------|
| **@stomp/stompjs** | 7.2.1 | STOMP 프로토콜 클라이언트 |
| **sockjs-client** | 1.6.1 | WebSocket fallback |

### UI/UX

| 기술 | 버전 | 용도 |
|------|------|------|
| **Tailwind CSS** | 4.1.9 | 유틸리티 우선 CSS 프레임워크 |
| **Radix UI** | 1.x | 접근성 최적화 컴포넌트 |
| **Lucide React** | 0.454.0 | 아이콘 라이브러리 |
| **Vaul** | 1.1.2 | Bottom sheet 컴포넌트 |

### State Management & Forms

| 기술 | 버전 | 용도 |
|------|------|------|
| **React Hook Form** | 7.60.0 | 폼 상태 관리 |
| **Zod** | 3.25.76 | 스키마 검증 |

### Development Tools

| 기술 | 용도 |
|------|------|
| **ESLint** | 코드 품질 검사 |
| **PostCSS** | CSS 후처리 |
| **Autoprefixer** | CSS 자동 브라우저 호환성 |

---

## 🚀 시작하기

### 필수 요구사항

- **Node.js**: 18.x 이상
- **npm** 또는 **yarn**: 최신 버전
- **Git**: 버전 관리
- **백엔드 서버**: 28_be 프로젝트 실행 중이어야 함

### 설치 및 실행

#### 1. 저장소 클론

```bash
git clone https://github.com/One-Kakao-Onboarding/28_youth_fe.git
cd 28_youth_fe
```

#### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

#### 3. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성:

```env
# 백엔드 API URL
NEXT_PUBLIC_API_URL=http://192.168.8.180:8080

# WebSocket URL
NEXT_PUBLIC_WS_URL=http://192.168.8.180:8080
```

> 💡 **로컬 개발 시**: `http://localhost:8080`으로 변경

#### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

#### 5. 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

---

## 🏗 아키텍처

### 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Views      │  │ Controllers  │  │   Models     │  │
│  │  (UI Layer)  │←→│  (Logic)     │←→│   (Data)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         ↓                  ↓                  ↓          │
│  ┌───────────────────────────────────────────────────┐  │
│  │         WebSocket Client (STOMP/SockJS)           │  │
│  └───────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────┘
                            │ WebSocket
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Backend (Spring Boot)                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │            STOMP Message Broker                    │  │
│  │  • /sub/room/{roomId} - 채팅방 메시지              │  │
│  │  • /user/queue/recommendation-prompt - 추천 알림   │  │
│  │  • /user/queue/suggestions - 맛집 추천             │  │
│  │  • /user/queue/errors - 에러 메시지                │  │
│  └───────────────────────────────────────────────────┘  │
│         ↓                  ↓                  ↓          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Chat Service │  │Suggestion Svc│  │ Claude API   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### MVC 아키텍처

프로젝트는 명확한 관심사 분리를 위해 MVC 패턴을 따릅니다:

#### Model (models/)
- **Restaurant.ts**: 맛집 데이터 모델
- **Message.ts**: 채팅 메시지 모델

#### View (views/)
- **ChatRoomView.tsx**: 채팅방 메인 뷰
- **components/**: 재사용 가능한 UI 컴포넌트
  - `MessageBubble.tsx`: 메시지 버블
  - `TriggerToast.tsx`: 추천 알림 토스트
  - `DetailModal.tsx`: 맛집 상세 모달
  - `SelectionView.tsx`: 맛집 선택 바텀시트

#### Controller (controllers/)
- **useChatRoomController.ts**: 채팅방 비즈니스 로직
  - WebSocket 연결 관리
  - 메시지 송수신 처리
  - 추천 플로우 제어

#### Lib (lib/)
- **websocket/client.ts**: WebSocket 클라이언트 래퍼
- **api/client.ts**: REST API 클라이언트
- **utils/user.ts**: 사용자 세션 관리

---

## 📁 프로젝트 구조

```
28_fe/
├── app/                          # Next.js 16 App Router
│   ├── page.tsx                 # 홈페이지 (채팅방)
│   ├── layout.tsx               # 루트 레이아웃
│   └── globals.css              # 전역 스타일
│
├── views/                        # View Layer (UI)
│   ├── ChatRoomView.tsx         # 채팅방 메인 뷰
│   └── components/              # UI 컴포넌트
│       ├── MessageBubble.tsx    # 메시지 버블
│       ├── trigger-toast.tsx    # 추천 알림 토스트
│       ├── detail-modal.tsx     # 맛집 상세 모달
│       ├── selection-view.tsx   # 맛집 선택 뷰
│       ├── bottom-sheet.tsx     # 바텀시트 컴포넌트
│       ├── privacy-consent-modal.tsx  # 개인정보 동의 모달
│       └── ui/                  # 기본 UI 컴포넌트 (Button, Input 등)
│
├── controllers/                  # Controller Layer (Business Logic)
│   └── useChatRoomController.ts # 채팅방 컨트롤러
│
├── models/                       # Model Layer (Data)
│   ├── Restaurant.ts            # 맛집 모델
│   └── Message.ts               # 메시지 모델
│
├── lib/                          # 라이브러리 및 유틸리티
│   ├── websocket/
│   │   └── client.ts            # WebSocket 클라이언트
│   ├── api/
│   │   └── client.ts            # REST API 클라이언트
│   └── utils/
│       └── user.ts              # 사용자 세션 관리
│
├── components/                   # 앱 레벨 컴포넌트
│   └── chat-room.tsx            # 채팅방 컨테이너
│
├── public/                       # 정적 파일
│   └── images/                  # 이미지 리소스
│
├── .env.local                    # 환경 변수 (git ignore)
├── package.json                  # 프로젝트 메타데이터
├── tsconfig.json                 # TypeScript 설정
├── tailwind.config.ts            # Tailwind CSS 설정
└── next.config.js                # Next.js 설정
```

---

## 📡 API 문서

### REST API

#### 채팅방 관리

```typescript
// 모든 채팅방 조회
GET /api/rooms
Response: ChatRoom[]

// 특정 채팅방 조회
GET /api/rooms/:roomId
Response: ChatRoom

// 채팅방 생성
POST /api/rooms
Body: { name: string }
Response: ChatRoom

// 헬스체크
GET /api/health
Response: { status: 'UP' }
```

### WebSocket API

#### 연결 설정

```typescript
// WebSocket 연결
const wsClient = new WebSocketClient()

wsClient.connect({
  userId: string,          // 사용자 UUID
  nickname: string,        // 사용자 닉네임
  roomId: number,          // 채팅방 ID
  onMessageReceived: (message: ChatMessageDto) => void,
  onRecommendationPrompt: (prompt: RecommendationPromptDto) => void,
  onSuggestion: (suggestion: SuggestionDto) => void,
  onError: (error: ErrorDto) => void,
  onConnected: () => void,
  onDisconnected: () => void,
})
```

#### 구독 채널

| 채널 | 설명 | DTO |
|------|------|-----|
| `/sub/room/{roomId}` | 채팅방 메시지 | `ChatMessageDto` |
| `/user/queue/recommendation-prompt` | 추천 알림 | `RecommendationPromptDto` |
| `/user/queue/suggestions` | 맛집 추천 | `SuggestionDto` |
| `/user/queue/errors` | 에러 메시지 | `ErrorDto` |

#### 발행 엔드포인트

| 엔드포인트 | 설명 | 요청 DTO |
|-----------|------|----------|
| `/pub/message` | 채팅 메시지 전송 | `ChatMessageDto` |
| `/pub/request-recommendation` | 맛집 추천 요청 | `RecommendationRequestDto` |

---

## 🧩 주요 컴포넌트

### WebSocket Client

**위치**: `lib/websocket/client.ts`

WebSocket 통신을 추상화한 클라이언트 클래스:

```typescript
export class WebSocketClient {
  // 연결 설정
  connect(config: WebSocketConfig): void

  // 메시지 전송
  sendMessage(message: ChatMessageDto): void

  // 추천 요청
  requestRecommendation(analysisId: string): void

  // 연결 해제
  disconnect(): void

  // 연결 상태 확인
  isConnected(): boolean
}
```

**특징**:
- 자동 재연결 (5초 간격)
- 하트비트 관리 (4초 간격)
- 다중 채널 구독 관리
- 에러 핸들링 및 로깅

### Chat Room Controller

**위치**: `controllers/useChatRoomController.ts`

채팅방의 비즈니스 로직을 관리하는 커스텀 훅:

```typescript
export function useChatRoomController() {
  // 상태 관리
  const [messages, setMessages] = useState<Message[]>([])
  const [showToast, setShowToast] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<RecommendationPromptDto | null>(null)

  // WebSocket 연결 설정
  useEffect(() => {
    wsClient.connect({
      onRecommendationPrompt: (prompt) => {
        setToastMessage(`${prompt.location}에서 ${prompt.mealType} 맛집을 추천받으시겠습니까?`)
        setShowToast(true)
      },
      onSuggestion: (suggestion) => {
        // 맛집 카드 메시지 추가
      },
      // ...
    })
  }, [])

  // 메시지 전송
  const handleSendMessage = () => {
    wsClient.sendMessage({ content: inputValue, ... })
  }

  // 추천 요청
  const handleToastClick = () => {
    wsClient.requestRecommendation(currentPrompt.analysisId)
  }

  return { messages, handleSendMessage, handleToastClick, ... }
}
```

### Restaurant Model

**위치**: `models/Restaurant.ts`

맛집 데이터 모델:

```typescript
export interface Restaurant {
  id: number                  // 맛집 ID
  name: string                // 이름
  category: string            // 카테고리 (예: "한식 • 백반")
  locationText: string        // 위치 텍스트 (예: "강남역 2번 출구")
  address: string             // 주소
  description: string         // 설명
  rating: number              // 평점 (0.0 ~ 5.0)
  image: string               // 이미지 URL
  distance: string            // 거리 정보 (예: "도보 5분")
  source: 'favorite' | 'ai_recommended'  // 출처
}
```

---

## 🔌 WebSocket 통신

### 연결 플로우

```
1. 사용자 식별
   ↓ getUserId() - localStorage에서 UUID 조회/생성

2. WebSocket 연결
   ↓ SockJS + STOMP over /ws-chat

3. STOMP CONNECT
   ↓ Headers: { 'X-User-Id': userId, 'X-Nickname': nickname }

4. 채널 구독
   ↓ /sub/room/{roomId}
   ↓ /user/queue/recommendation-prompt
   ↓ /user/queue/suggestions
   ↓ /user/queue/errors

5. 통신 시작
```

### 메시지 흐름

#### 채팅 메시지

```
[Client] --publish--> /pub/message { content: "..." }
                           ↓
                    [Server Processing]
                           ↓
[Client] <--broadcast-- /sub/room/{roomId}
```

#### 맛집 추천 (2단계)

```
[Client] --publish--> /pub/message { content: "판교 점심 추천" }
                           ↓
                    [Claude AI Analysis]
                           ↓
[Client] <--private-- /user/queue/recommendation-prompt
         { analysisId: "uuid", location: "판교", mealType: "점심" }
                           ↓
                    [사용자 클릭]
                           ↓
[Client] --publish--> /pub/request-recommendation { analysisId }
                           ↓
                    [Restaurant Search]
                           ↓
[Client] <--private-- /user/queue/suggestions
         { cardData: { restaurants: [...] } }
```

### 에러 처리

```typescript
// STOMP 연결 에러
this.client.onStompError = (frame) => {
  console.error('[WebSocket] STOMP error:', frame)
  config.onError?.({ message: frame.body || 'WebSocket connection error' })
}

// 구독 에러
try {
  const data = JSON.parse(message.body)
  config.onRecommendationPrompt?.(data)
} catch (error) {
  console.error('[WebSocket] Failed to parse message:', error)
}

// 서버 에러 메시지
[Client] <--private-- /user/queue/errors
         { message: "분석 결과를 찾을 수 없습니다" }
```

---

## 💻 개발 가이드

### 코딩 컨벤션

#### TypeScript

```typescript
// ✅ 명시적 타입 지정
const userId: string = getUserId()

// ✅ 인터페이스 명명: PascalCase
interface RestaurantDto {
  id: number
  name: string
}

// ✅ 함수 명명: camelCase, 동사로 시작
function handleSendMessage(): void {}

// ✅ 컴포넌트 props 인터페이스
interface MessageBubbleProps {
  message: Message
  onDetailClick: () => void
}
```

#### React Components

```typescript
// ✅ 함수형 컴포넌트 + TypeScript
export function ChatRoomView({ messages, ...props }: ChatRoomViewProps) {
  return <div>...</div>
}

// ✅ 커스텀 훅 명명: use로 시작
export function useChatRoomController() {
  const [state, setState] = useState()
  return { state, setState }
}

// ✅ 이벤트 핸들러 명명: handle로 시작
const handleClick = () => {}
const handleSubmit = () => {}
```

#### Tailwind CSS

```tsx
// ✅ 클래스 순서: 레이아웃 → 스타일 → 상태
<div className="flex items-center gap-2 bg-white px-4 py-2 hover:bg-gray-50">

// ✅ cn() 유틸리티로 조건부 클래스
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  isDisabled && "disabled-classes"
)}>
```

### 컴포넌트 작성 가이드

#### 1. Props 인터페이스 정의

```typescript
interface ComponentProps {
  // Required props
  title: string
  data: Restaurant[]

  // Optional props
  className?: string

  // Callbacks
  onSubmit: (data: Restaurant) => void
  onCancel?: () => void
}
```

#### 2. 상태 관리

```typescript
// ✅ useState for local UI state
const [isOpen, setIsOpen] = useState(false)

// ✅ useRef for DOM references
const inputRef = useRef<HTMLInputElement>(null)

// ✅ useEffect for side effects
useEffect(() => {
  // Setup
  const subscription = wsClient.subscribe()

  // Cleanup
  return () => subscription.unsubscribe()
}, [dependencies])
```

#### 3. 에러 핸들링

```typescript
// ✅ Try-catch for async operations
const fetchData = async () => {
  try {
    const data = await api.getData()
    setData(data)
  } catch (error) {
    console.error('Failed to fetch data:', error)
    setError('데이터를 불러올 수 없습니다.')
  }
}

// ✅ Null checks
if (!data) {
  return <div>Loading...</div>
}
```

---

## 🐛 트러블슈팅

### 자주 발생하는 문제

#### 1. WebSocket 연결 실패

**증상**: 콘솔에 `[WebSocket] Connection failed` 에러

**원인**:
- 백엔드 서버가 실행되지 않음
- 잘못된 WebSocket URL
- CORS 정책 문제

**해결**:
```bash
# 1. 백엔드 서버 상태 확인
curl http://localhost:8080/api/health

# 2. .env.local 확인
NEXT_PUBLIC_WS_URL=http://localhost:8080

# 3. 브라우저 콘솔에서 연결 시도 확인
[WebSocket] Connecting with: { userId: "...", wsUrl: "..." }
```

#### 2. 추천 알림이 표시되지 않음

**증상**: 메시지를 보냈지만 토스트 알림이 나타나지 않음

**원인**:
- 백엔드의 Simple Broker 설정 오류 (`/user` prefix 누락)
- userId 불일치
- 신뢰도 0.6 미만

**해결**:
```typescript
// 1. 브라우저 콘솔에서 userId 확인
console.log('My userId:', localStorage.getItem('user_id'))

// 2. 백엔드 로그에서 STOMP CONNECT 확인
// STOMP CONNECT - sessionId: xxx, userId: xxx

// 3. 백엔드 WebSocketConfig.java 수정
config.enableSimpleBroker("/sub", "/user");  // "/user" 추가 필요
```

#### 3. 타입 에러

**증상**: TypeScript 컴파일 에러

**원인**:
- DTO 인터페이스 불일치
- null/undefined 처리 누락

**해결**:
```typescript
// ✅ Optional chaining 사용
const location = prompt?.location

// ✅ Nullish coalescing
const rating = restaurant.rating ?? 4.5

// ✅ Type guard
if (message.type === 'card' && message.cardData) {
  // cardData 안전하게 사용
}
```

#### 4. 페이지 새로고침 시 연결 끊김

**증상**: 개발 중 Hot Reload 시 WebSocket 연결이 유지되지 않음

**원인**:
- useEffect cleanup 함수 미실행
- 컴포넌트 언마운트 시 연결 해제 안 됨

**해결**:
```typescript
useEffect(() => {
  wsClient.connect(config)

  // ✅ Cleanup 함수로 연결 해제
  return () => {
    wsClient.disconnect()
  }
}, [])
```

### 디버깅 팁

#### 1. WebSocket 로그 활성화

모든 WebSocket 이벤트가 콘솔에 로그됩니다:

```typescript
[WebSocket] Connecting with: ...
[WebSocket] Connected
[WebSocket] Attempting to subscribe to /user/queue/recommendation-prompt
[WebSocket] Subscription ID for recommendation-prompt: sub-0
[WebSocket] ===== Recommendation prompt received =====
[WebSocket] Raw message body: {"analysisId":"..."}
```

#### 2. STOMP Debug 로그

STOMP 프로토콜 레벨 디버그:

```typescript
this.client = new Client({
  debug: (str) => {
    console.log('STOMP Debug:', str)
  }
})
```

#### 3. 네트워크 탭 확인

브라우저 개발자 도구 → Network 탭:
- WS 필터 선택
- ws-chat 연결 상태 확인
- 메시지 프레임 확인

---

## ⚡ 성능 최적화

### 1. 코드 스플리팅

```typescript
// 동적 import로 큰 컴포넌트 lazy load
const DetailModal = dynamic(() => import('./components/detail-modal'), {
  loading: () => <Spinner />,
  ssr: false
})
```

### 2. 메모이제이션

```typescript
// useMemo로 비싼 계산 캐싱
const filteredRestaurants = useMemo(() => {
  return restaurants.filter(r => r.source === 'favorite')
}, [restaurants])

// useCallback으로 함수 재생성 방지
const handleClick = useCallback(() => {
  wsClient.requestRecommendation(analysisId)
}, [analysisId])
```

### 3. 이미지 최적화

```typescript
// Next.js Image 컴포넌트 사용
import Image from 'next/image'

<Image
  src={restaurant.image}
  alt={restaurant.name}
  width={300}
  height={200}
  loading="lazy"
  placeholder="blur"
/>
```

### 4. WebSocket 연결 풀링

```typescript
// 싱글톤 패턴으로 WebSocket 클라이언트 재사용
const wsClientRef = useRef(createWebSocketClient())

// 컴포넌트 언마운트 시에만 연결 해제
useEffect(() => {
  return () => {
    wsClientRef.current.disconnect()
  }
}, [])
```

---

## 🤝 기여하기

### 브랜치 전략

```
main              # 프로덕션 배포 브랜치
  ↓
develop           # 개발 통합 브랜치
  ↓
feature/xxx       # 기능 개발 브랜치
  ↓
hotfix/xxx        # 긴급 수정 브랜치
```

### 커밋 메시지 컨벤션

```bash
# 기능 추가
feat: Add restaurant detail modal

# 버그 수정
fix: Fix WebSocket reconnection issue

# 리팩토링
refactor: Improve message handling logic

# 문서 업데이트
docs: Update API documentation

# 스타일 변경
style: Format code with Prettier

# 테스트
test: Add unit tests for WebSocket client

# 빌드 설정
chore: Update dependencies
```

### Pull Request 가이드

1. **Fork** 후 feature 브랜치 생성
2. **코드 작성** 및 테스트
3. **Commit** with conventional message
4. **Push** to your fork
5. **Pull Request** 생성 with description

#### PR 템플릿

```markdown
## 변경 사항
- [ ] 새로운 기능 추가
- [ ] 버그 수정
- [ ] 리팩토링
- [ ] 문서 업데이트

## 설명
<!-- 변경 사항에 대한 상세 설명 -->

## 테스트
- [ ] 로컬에서 테스트 완료
- [ ] 브라우저 호환성 확인
- [ ] 모바일 반응형 확인

## 스크린샷
<!-- UI 변경 시 스크린샷 첨부 -->
```

---

## 📄 라이센스

이 프로젝트는 **MIT License**를 따릅니다.

```
MIT License

Copyright (c) 2026 28 Youth Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👥 팀

**28 Youth Team** - Kakao Onboarding Hackathon 2026

- Frontend: Next.js + TypeScript + WebSocket
- Backend: Spring Boot + Claude AI
- Design: Mobile-First UI/UX

---

## 📞 문의

- **GitHub Issues**: [https://github.com/One-Kakao-Onboarding/28_youth_fe/issues](https://github.com/One-Kakao-Onboarding/28_youth_fe/issues)
- **Email**: youth28.team@kakao.com

---

<div align="center">

**Built with ❤️ by 28 Youth Team**

[⬆ Back to Top](#28-youth---ai-powered-restaurant-recommendation-chat)

</div>
