<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
      <v-btn 
        variant="text" 
        size="small" 
        color="primary"
        @click="viewAll"
      >
        عرض الكل
        <v-icon class="mr-1">mdi-arrow-left</v-icon>
      </v-btn>
    </div>

    <v-list>
      <v-list-item
        v-for="activity in activities"
        :key="activity.id"
        class="border-b last:border-b-0 px-0"
      >
        <template v-slot:prepend>
          <v-avatar :color="activity.avatarColor" size="40">
            <v-icon color="white">{{ activity.icon }}</v-icon>
          </v-avatar>
        </template>

        <div class="flex-1">
          <v-list-item-title class="text-right font-medium">
            {{ activity.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-right text-gray-500">
            {{ activity.description }}
          </v-list-item-subtitle>
        </div>

        <template v-slot:append>
          <span class="text-xs text-gray-400">{{ activity.time }}</span>
        </template>
      </v-list-item>
    </v-list>

    <div v-if="activities.length === 0" class="text-center py-8 text-gray-400">
      <v-icon size="48" color="grey-lighten-2">mdi-inbox</v-icon>
      <p class="mt-2">لا توجد نشاطات حالياً</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'النشاطات الأخيرة'
  },
  activities: {
    type: Array as PropType<any[]>,
    required: true
  }
})

const emit = defineEmits(['view-all'])

const viewAll = () => {
  emit('view-all')
}
</script>
