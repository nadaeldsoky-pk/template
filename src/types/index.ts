// ─── User & Auth ──────────────────────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string
  role: string
  initials: string
  avatar: string | null
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ActionResult {
  success: boolean
  error?: string
}

// ─── Theme ────────────────────────────────────────────────────────────────────
export type ThemeName = 'cyberMode' | 'dark' | 'purple' | 'green'

// ─── Breadcrumbs & Route ──────────────────────────────────────────────────────
export interface Breadcrumb {
  text: string
  path: string
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  per_page: number
  last_page: number
}
