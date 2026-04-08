import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthCredentials, ActionResult } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token') || null)
  const isAuthenticated = computed<boolean>(() => !!token.value)

  // Actions
  const login = async (credentials: AuthCredentials): Promise<ActionResult> => {
    try {
      // محاكاة API call
      // في الواقع، سيتم إجراء طلب API هنا
      const response = {
        token: 'sample-token-123',
        user: {
          id: 1,
          name: 'User 2',
          email: credentials.email,
          role: 'مدير الإدارة',
          initials: 'UU',
          avatar: null
        } as User
      }

      token.value = response.token
      user.value = response.user
      localStorage.setItem('auth_token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'فشل تسجيل الدخول' }
    }
  }

  const logout = (): void => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const loadUser = (): void => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser) as User
    }
  }

  const updateProfile = async (userData: Partial<User>): Promise<ActionResult> => {
    try {
      // محاكاة API call
      user.value = { ...user.value, ...userData } as User
      localStorage.setItem('user', JSON.stringify(user.value))
      return { success: true }
    } catch (error) {
      console.error('Update profile error:', error)
      return { success: false, error: 'فشل تحديث الملف الشخصي' }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    loadUser,
    updateProfile
  }
})
