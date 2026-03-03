import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const login = async (credentials) => {
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
        }
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

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const loadUser = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  const updateProfile = async (userData) => {
    try {
      // محاكاة API call
      user.value = { ...user.value, ...userData }
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
