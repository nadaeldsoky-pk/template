<template>
  <div class="user-profile-container">
    <div
      class="flex items-center cursor-pointer transition-all"
      :class="rail ? 'justify-center p-0 hover:bg-white/10 rounded-full' : 'justify-end bg-[#FFFFFF40] rounded-lg px-2 py-1 hover:bg-white/20'"
    >
      <div v-if="!rail" class="flex flex-col items-end me-2">
        <span class="text-white font-semibold text-base">{{ user.name }}</span>
        <span class="text-[--color-border] text-sm">{{ user.role }}</span>
      </div>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-avatar color="--color-bg" :size="rail ? 40 : 31" v-bind="props" class="cursor-pointer">
            <span class="text-[#2F4FA2] font-bold" :class="rail ? 'text-xl' : 'text-lg'">{{ user.initials }}</span>
          </v-avatar>
        </template>

        <v-list>
          <v-list-item @click="viewProfile">
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title>الملف الشخصي</v-list-item-title>
          </v-list-item>

          <v-list-item @click="editProfile">
            <template v-slot:prepend>
              <v-icon>mdi-account-edit</v-icon>
            </template>
            <v-list-item-title>تعديل الملف</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="logout">
            <v-list-item-title class="text-error">تسجيل الخروج</v-list-item-title>
            <template v-slot:prepend>
              <v-icon color="error">mdi-logout</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  rail: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const user = ref({
  name: 'User 2',
  role: 'مدير الإدارة',
  initials: 'UU'
})

const viewProfile = () => {
  router.push('/profile')
}

const editProfile = () => {
  router.push('/profile/edit')
}

const logout = () => {
  router.push('/login')
}
</script>
