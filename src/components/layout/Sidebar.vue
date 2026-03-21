<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" app permanent location="right" :width="250" :rail-width="68"
    class="sidebar-container" elevation="0" order="-1">
    <!-- Logo Section (Full Width with White Background) -->
    <Logo :rail="rail" />

    <div class="sidebar-content h-full flex flex-col pt-4" :class="{ 'px-4': !rail, 'px-0': rail }">

      <!-- User Profile (Expanded Only or simplified in Rail) -->
      <div v-if="!rail" class="pb-4">
        <UserProfile />
      </div>

      <!-- Search Box (Expanded Only) -->
      <div v-if="!rail" class="mb-2">
        <SearchBox />
      </div>

      <!-- Navigation Menu -->
      <v-list nav class="flex-grow-1" density="compact" :class="{ 'px-2': rail }">
        <MenuGroup v-for="item in menuItems" :key="item.id" :item="item" :rail="rail" />
      </v-list>

      <!-- Logout Button -->
      <div class="pb-6 pt-2" :class="{ 'text-center': rail }">
        <v-btn v-if="!rail" block variant="text" class="logout-btn  px-0" @click="handleLogout">
          <div class="d-flex align-center justify-end w-100 gap-1">
            <span class="logout-text">تسجيل الخروج </span>
            <v-icon class="logout-icon">mdi-logout</v-icon>
          </div>
        </v-btn>
        <v-btn v-else icon variant="text" class="logout-btn-rail" @click="handleLogout">
          <v-icon class="logout-icon">mdi-logout</v-icon>
        </v-btn>
      </div>

    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/modules/auth'
import UserProfile from '../common/UserProfile.vue'
import Logo from '../common/Logo.vue'
import SearchBox from '../common/SearchBox.vue'
import MenuGroup from '../navigation/MenuGroup.vue'

const router = useRouter()
const authStore = useAuthStore()
const drawer = ref(true)

const props = defineProps({
  rail: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:rail'])



const menuItems = ref([
  {
    id: 1,
    title: 'نظرة تحليلية',
    icon: 'mdi-chart-line',
    path: '/analytics',
    children: []
  },
  {
    id: 2,
    title: 'الحوكمة',
    icon: 'mdi-bank',
    path: '/governance',
    children: [
      {
        title: 'وحدات الأعمال',
        path: '/governance/business-units',
        children: [
          { title: 'الأقسام', path: '/governance/business-units/departments' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'إدارة المخاطر',
    icon: 'mdi-alert',
    path: '/risk-management',
    children: [
      { title: 'تقييم المخاطر', path: '/risk-management/assessment' },
      { title: 'معالجة المخاطر', path: '/risk-management/treatment' },
      { title: 'مراقبة المخاطر', path: '/risk-management/monitoring' }
    ]
  },
  {
    id: 4,
    title: 'إدارة الامتثال و الالتزام',
    icon: 'mdi-file-document-check',
    path: '/compliance',
    children: [
      { title: 'متطلبات الامتثال', path: '/compliance/requirements' },
      { title: 'التدقيق', path: '/compliance/audit' },
      { title: 'التقارير', path: '/compliance/reports' }
    ]
  }
])

const handleLogout = () => {
  authStore.logout()
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}
</script>

<style scoped>
.sidebar-container {
  background-color: var(--color-sidebar-bg) !important;
  color: var(--color-sidebar-text);
  border: none !important;
}


.logout-btn {
  color: var(--color-sidebar-text) !important;
  font-family: var(--font-family-base) !important;
  justify-content: flex-end !important;
  border-radius: 8px !important;
  border: 1px  solid var(--color-sidebar-text) !important;
  padding: 8px 12px !important;

}

.logout-btn:hover {
  background-color: var(--color-sidebar-logout-hover) !important;
}

.logout-btn-rail {
  color: var(--color-sidebar-text) !important;
  border: 1px solid var(--color-sidebar-text) !important;
  border-radius: 8px !important;
  width: 40px !important;
  height: 40px !important;
}

.logout-text {
  font-size: 16px;
  font-weight: 500;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Hide Scrollbar */
:deep(.v-navigation-drawer__content) {
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  display: none;
  /* Chrome, Safari and Opera */
}

:deep(.v-list--nav) {
  padding-inline: 0 !important;
}
</style>
