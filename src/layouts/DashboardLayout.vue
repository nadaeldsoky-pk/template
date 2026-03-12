<template>
  <!-- App Bar - مرر حالة rail -->
  <AppBar :rail="rail" @toggle-sidebar="rail = !rail" />

    <!-- Sidebar -->
    <Sidebar v-model:rail="rail" />

    <!-- Main Content -->
    <v-main class="bg-gray-50 flex flex-col justify-between">
      <v-container fluid class="pa-6">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
</template>

<script setup>
import { ref } from 'vue'
import AppBar from '../components/layout/AppBar.vue'
import Sidebar from '../components/layout/Sidebar.vue'

const rail = ref(false)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.v-main {
  min-height: calc(100vh - 100px); /* adjusted per feedback to reduce height */
  display: flex !important;
  flex-direction: column;
}

.v-main > .v-container {
  flex-grow: 1;
}
</style>
