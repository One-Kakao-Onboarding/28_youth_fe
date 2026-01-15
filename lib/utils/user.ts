/**
 * 사용자 ID를 가져오거나 생성합니다.
 * localStorage에 저장된 ID가 있으면 반환하고, 없으면 UUID를 생성하여 저장합니다.
 */
export function getUserId(): string {
  if (typeof window === 'undefined') return ''

  const storedUserId = localStorage.getItem('user_id')
  if (storedUserId) {
    return storedUserId
  }

  // UUID v4 생성
  const uuid = crypto.randomUUID()
  localStorage.setItem('user_id', uuid)
  return uuid
}

/**
 * 사용자 닉네임을 가져오거나 설정합니다.
 */
export function getUserNickname(): string {
  if (typeof window === 'undefined') return ''

  const storedNickname = localStorage.getItem('user_nickname')
  if (storedNickname) {
    return storedNickname
  }

  // 기본 닉네임 설정
  const defaultNickname = '사용자' + Math.floor(Math.random() * 10000)
  localStorage.setItem('user_nickname', defaultNickname)
  return defaultNickname
}

/**
 * 사용자 닉네임을 변경합니다.
 */
export function setUserNickname(nickname: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('user_nickname', nickname)
}
