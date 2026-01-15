const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface ChatRoom {
  id: number
  name: string
  createdAt?: string
}

export interface CreateRoomRequest {
  name: string
}

export interface HealthResponse {
  status: string
  timestamp: string
  service: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getAllRooms(): Promise<ChatRoom[]> {
    return this.fetch<ChatRoom[]>('/api/rooms')
  }

  async getRoom(roomId: number): Promise<ChatRoom> {
    return this.fetch<ChatRoom>(`/api/rooms/${roomId}`)
  }

  async createRoom(request: CreateRoomRequest): Promise<ChatRoom> {
    return this.fetch<ChatRoom>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async healthCheck(): Promise<HealthResponse> {
    return this.fetch<HealthResponse>('/api/health')
  }
}

export const apiClient = new ApiClient(API_URL)
