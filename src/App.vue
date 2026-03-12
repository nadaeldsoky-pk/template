<template>
  <v-app>
    <router-view />
    <GlobalFooter />
  </v-app>
</template>

<script setup>
import { useAuthStore } from './store/modules/auth'
import { useThemeStore } from './store/modules/theme'
import GlobalFooter from '@/components/layout/Footer.vue'

// Initialize stores — theme applies automatically via watcher
const authStore = useAuthStore()
useThemeStore()

authStore.loadUser()
</script>

<style>
/* Global styles */
* {
  font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* RTL Support */
[dir="rtl"] {
  direction: rtl;
}
</style>
