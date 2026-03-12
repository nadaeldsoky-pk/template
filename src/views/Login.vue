<template>
  <v-main class="bg-gradient-to-br from-primary-700 to-primary-900 min-h-screen flex items-center justify-center">
    <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <!-- Login Card -->
            <v-card class="pa-8 rounded-xl" elevation="8">
              <!-- Logo -->
              <div class="text-center mb-6">
                <v-icon color="primary" size="64" class="mb-4">mdi-shield-lock</v-icon>
                <h1 class="text-2xl font-bold text-gray-800">CyberMode</h1>
                <h2 class="text-xl font-semibold text-primary mb-2">مرحباً بك</h2>
                <p class="text-gray-600 mt-2">نظام إدارة الحوكمة والمخاطر والامتثال</p>
              </div>

              <!-- Login Form -->
              <v-form @submit.prevent="handleLogin" ref="loginForm">
                <v-text-field
                  v-model="email"
                  label="البريد الإلكتروني"
                  prepend-inner-icon="mdi-email"
                  type="email"
                  :rules="emailRules"
                  required
                  variant="outlined"
                  class="mb-2"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  label="كلمة المرور"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  :rules="passwordRules"
                  required
                  variant="outlined"
                  class="mb-2"
                ></v-text-field>

                <div class="flex items-center justify-between mb-4">
                  <v-checkbox
                    v-model="rememberMe"
                    label="تذكرني"
                    hide-details
                  ></v-checkbox>
                  <a href="#" class="text-primary text-sm hover:underline">نسيت كلمة المرور؟</a>
                </div>

                <v-btn
                  type="submit"
                  block
                  size="large"
                  color="primary"
                  :loading="loading"
                  class="mb-4"
                >
                  تسجيل الدخول
                </v-btn>

                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  closable
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>
              </v-form>

              <!-- Footer -->
              <v-divider class="my-4"></v-divider>
              <p class="text-center text-sm text-gray-600">
                ليس لديك حساب؟ 
                <a href="#" class="text-primary font-semibold hover:underline">تواصل مع الإدارة</a>
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/modules/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')
const loginForm = ref(null)

const emailRules = [
  v => !!v || 'البريد الإلكتروني مطلوب',
  v => /.+@.+\..+/.test(v) || 'البريد الإلكتروني غير صحيح',
]

const passwordRules = [
  v => !!v || 'كلمة المرور مطلوبة',
  v => v.length >= 6 || 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
]

const handleLogin = async () => {
  const { valid } = await loginForm.value.validate()
  
  if (!valid) return

  loading.value = true
  error.value = ''

  try {
    const result = await authStore.login({
      email: email.value,
      password: password.value,
    })

    if (result.success) {
      // حفظ حالة "تذكرني"
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      }
      
      // الانتقال للصفحة الرئيسية
      router.push('/')
    } else {
      error.value = result.error || 'فشل تسجيل الدخول. تحقق من البيانات'
    }
  } catch (err) {
    error.value = 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-gradient-to-br {
  background: linear-gradient(135deg, #2E4A7C 0%, #4A6FA5 100%);
}

.v-card {
  backdrop-filter: blur(10px);
}
</style>
