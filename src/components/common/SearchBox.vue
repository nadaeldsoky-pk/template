<template>
  <div>
    <v-text-field
      v-model="searchQuery"
      placeholder="بحث..."
      append-inner-icon="mdi-magnify"
      density="comfortable"
      variant="outlined"
      hide-details
      bg-color="white"
      rounded="8px"
      class="custom-search"
      @keyup.enter="performSearch"
      clearable
    ></v-text-field>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['search'])

const router = useRouter()
const searchQuery = ref('')

watch(searchQuery, (newVal) => {
  emit('search', newVal || '')
})

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    // يمكن إضافة منطق البحث هنا
    router.push({
      name: 'search',
      query: { q: searchQuery.value }
    })
  }
}
</script>

<style scoped>
.custom-search :deep(.v-field) {
  border-radius: 12px !important;
}

.custom-search :deep(.v-field__input) {
  text-align: right;
  padding: 8px 12px;
}
</style>
