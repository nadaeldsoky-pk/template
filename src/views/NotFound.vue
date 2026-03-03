<template>
  <v-app>
    <v-main class="bg-gray-50 min-h-screen flex items-center justify-center">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <!-- 404 Icon -->
            <v-icon size="120" color="primary" class="mb-6">
              mdi-alert-circle-outline
            </v-icon>

            <!-- Error Message -->
            <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">
              عذراً، الصفحة غير موجودة
            </h2>
            <p class="text-gray-600 mb-8">
              الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر
            </p>

            <!-- Action Buttons -->
            <div class="flex gap-4 justify-center">
              <v-btn
                size="large"
                color="primary"
                prepend-icon="mdi-home"
                @click="goHome"
              >
                العودة للرئيسية
              </v-btn>

              <v-btn
                size="large"
                variant="outlined"
                color="primary"
                prepend-icon="mdi-arrow-right"
                @click="goBack"
              >
                الرجوع للخلف
              </v-btn>
            </div>

            <!-- Help Links -->
            <v-card class="mt-8 pa-6" variant="outlined">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                هل تحتاج مساعدة؟
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <v-btn
                  variant="text"
                  prepend-icon="mdi-chart-line"
                  @click="$router.push('/analytics')"
                >
                  نظرة تحليلية
                </v-btn>
                <v-btn
                  variant="text"
                  prepend-icon="mdi-shield-account"
                  @click="$router.push('/governance')"
                >
                  الحوكمة
                </v-btn>
                <v-btn
                  variant="text"
                  prepend-icon="mdi-alert-circle"
                  @click="$router.push('/risk-management')"
                >
                  إدارة المخاطر
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
