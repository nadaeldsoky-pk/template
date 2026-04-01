<template>
  <div class="flex items-center gap-2 text-sm" :class="isRtl ? 'flex-row-reverse' : 'flex-row'">
   <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.41667 14.75V8.85541C9.41667 8.65999 9.34058 8.47258 9.20513 8.3344C9.06969 8.19622 8.88599 8.11859 8.69444 8.11859H5.80556C5.61401 8.11859 5.43031 8.19622 5.29487 8.3344C5.15942 8.47258 5.08333 8.65999 5.08333 8.85541V14.75M0.75 6.64494C0.74995 6.43057 0.795741 6.21878 0.88418 6.02433C0.972619 5.82987 1.10158 5.65745 1.26206 5.51907L6.31761 1.09813C6.57832 0.873336 6.90865 0.75 7.25 0.75C7.59135 0.75 7.92168 0.873336 8.18239 1.09813L13.2379 5.51907C13.3984 5.65745 13.5274 5.82987 13.6158 6.02433C13.7043 6.21878 13.7501 6.43057 13.75 6.64494V13.2764C13.75 13.6672 13.5978 14.042 13.3269 14.3184C13.056 14.5947 12.6886 14.75 12.3056 14.75H2.19444C1.81135 14.75 1.44395 14.5947 1.17307 14.3184C0.902182 14.042 0.75 13.6672 0.75 13.2764V6.64494Z" 
        stroke="currentColor" 
        stroke-width="1.5" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
</svg>

    <template v-for="(item, index) in breadcrumbs" :key="index">
      <span 
        :class="[
          item.isActive
            ? 'text-[var(--color-text-primary)] font-bold'
            : 'text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-text-primary)]'
        ]" 
        @click="navigateTo(item)"
      >
        {{ item.text }}
      </span>
      <span v-if="index < breadcrumbs.length - 1" class="text-gray-400 mx-1">
        /
      </span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRtl } from 'vuetify'

const route = useRoute()
const router = useRouter()
const { isRtl } = useRtl()

const breadcrumbs = computed(() => {
  const items = route.meta.breadcrumbs || [
    { text: 'طريق 1', path: '/' },
    { text: 'طريق 2', path: '/' },
    { text: 'طريق 3', path: '/' },
    { text: 'طريق 4', path: route.path }
  ]

  // ✅ حدد الـ active قبل ما تعمل reverse
  const withActive = items.map((item, index) => ({
    ...item,
    isActive: index === items.length - 1
  }))

  return isRtl.value ? [...withActive].reverse() : withActive
})

const navigateTo = (item) => {
  if (item.path && item.path !== route.path) {
    router.push(item.path)
  }
}
</script>