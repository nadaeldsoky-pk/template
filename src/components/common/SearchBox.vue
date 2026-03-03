<template>
  <div>
    <v-text-field
      v-model="searchQuery"
      placeholder="بحث..."
      prepend-inner-icon="mdi-magnify"
      density="comfortable"
      variant="outlined"
      hide-details
      bg-color="white"
      rounded="lg"
      class="custom-search"
      @keyup.enter="performSearch"
      clearable
    ></v-text-field>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

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

.custom-search :deep(.v-field__prepend-inner) {
  padding-right: 0;
  padding-left: 8px;
}
</style>
