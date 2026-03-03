<template>
  <v-app>
    <!-- App Bar - مرر حالة rail -->
    <AppBar :rail="rail" @toggle-sidebar="rail = !rail" />

    <!-- Sidebar -->
    <Sidebar v-model:rail="rail" />

    <!-- Main Content -->
    <v-main class="bg-gray-50">
      <v-container fluid class="pa-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>

      <!-- Footer - يظهر هنا ليتحرك مع المحتوى -->
      <Footer />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import AppBar from '../components/layout/AppBar.vue'
import Sidebar from '../components/layout/Sidebar.vue'
import Footer from '../components/layout/Footer.vue'

const rail = ref(false)
</script>

<style scoped>
/* Page transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.v-main {
  min-height: calc(100vh - 120px);
}
</style>
