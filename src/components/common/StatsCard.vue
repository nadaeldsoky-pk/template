<template>
  <div 
    class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300 cursor-pointer card-hover"
    @click="handleClick"
  >
    <div class="flex items-center justify-between">
      <v-icon :size="iconSize" :color="iconColor">{{ icon }}</v-icon>
      <div class="text-right">
        <h3 class="text-gray-500 text-sm mb-1">{{ title }}</h3>
        <p class="text-3xl font-bold text-gray-800">{{ value }}</p>
        <div v-if="trend" class="flex items-center justify-end gap-1 mt-2">
          <v-icon 
            :color="trendColor" 
            size="16"
          >
            {{ trendIcon }}
          </v-icon>
          <span :class="`text-xs ${trendColor}--text`">{{ trendValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  iconSize: {
    type: Number,
    default: 40
  },
  trend: {
    type: String,
    default: null // 'up', 'down', null
  },
  trendValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const trendIcon = computed(() => {
  if (props.trend === 'up') return 'mdi-trending-up'
  if (props.trend === 'down') return 'mdi-trending-down'
  return ''
})

const trendColor = computed(() => {
  if (props.trend === 'up') return 'success'
  if (props.trend === 'down') return 'error'
  return 'grey'
})

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
}
</style>
