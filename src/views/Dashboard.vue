<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-800 text-right">لوحة التحكم</h1>
      <p class="text-gray-600 text-right mt-2">
        مرحباً بك في نظام إدارة الحوكمة والمخاطر والامتثال
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="التقارير النشطة"
        :value="24"
        icon="mdi-chart-line"
        icon-color="primary"
        trend="up"
        trend-value="+12%"
        @click="navigateTo('/reports')"
      />

      <StatsCard
        title="المخاطر المفتوحة"
        :value="12"
        icon="mdi-alert-circle"
        icon-color="warning"
        trend="down"
        trend-value="-5%"
        @click="navigateTo('/risk-management')"
      />

      <StatsCard
        title="المهام المكتملة"
        :value="87"
        icon="mdi-clipboard-check"
        icon-color="success"
        trend="up"
        trend-value="+23%"
        @click="navigateTo('/tasks')"
      />

      <StatsCard
        title="المهام المتأخرة"
        :value="5"
        icon="mdi-clock-alert"
        icon-color="error"
        trend="down"
        trend-value="-2"
        @click="navigateTo('/tasks/overdue')"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Risk Chart -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-800 text-right mb-4">
          توزيع المخاطر
        </h2>
        <div class="h-64 flex items-center justify-center text-gray-400">
          <div class="text-center">
            <v-icon size="64" color="grey-lighten-2">mdi-chart-donut</v-icon>
            <p class="mt-2">الرسم البياني سيظهر هنا</p>
          </div>
        </div>
      </div>

      <!-- Compliance Chart -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-800 text-right mb-4">
          نسبة الامتثال
        </h2>
        <div class="h-64 flex items-center justify-center text-gray-400">
          <div class="text-center">
            <v-icon size="64" color="grey-lighten-2">mdi-chart-bar</v-icon>
            <p class="mt-2">الرسم البياني سيظهر هنا</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <ActivityList
      title="النشاطات الأخيرة"
      :activities="recentActivities"
      @view-all="viewAllActivities"
    />

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-xl font-bold text-gray-800 text-right mb-4">
        إجراءات سريعة
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <v-btn
          v-for="action in quickActions"
          :key="action.title"
          size="large"
          variant="outlined"
          class="flex-col h-auto py-4"
          @click="action.action"
        >
          <v-icon size="32" class="mb-2">{{ action.icon }}</v-icon>
          <span class="text-sm">{{ action.title }}</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StatsCard from '../components/common/StatsCard.vue'
import ActivityList from '../components/common/ActivityList.vue'

const router = useRouter()

const recentActivities = ref([
  {
    id: 1,
    title: 'تم تحديث تقييم المخاطر',
    description: 'تم تحديث تقييم المخاطر للمشروع رقم 123',
    time: 'منذ 5 دقائق',
    icon: 'mdi-file-document',
    avatarColor: 'primary'
  },
  {
    id: 2,
    title: 'إضافة مستخدم جديد',
    description: 'تم إضافة أحمد محمد إلى النظام',
    time: 'منذ 30 دقيقة',
    icon: 'mdi-account-plus',
    avatarColor: 'success'
  },
  {
    id: 3,
    title: 'تنبيه: مهمة متأخرة',
    description: 'المهمة رقم 456 تجاوزت الموعد المحدد',
    time: 'منذ ساعة',
    icon: 'mdi-alert',
    avatarColor: 'error'
  },
  {
    id: 4,
    title: 'اكتمال التدقيق',
    description: 'تم الانتهاء من تدقيق الربع الثاني',
    time: 'منذ 2 ساعة',
    icon: 'mdi-check-circle',
    avatarColor: 'success'
  },
  {
    id: 5,
    title: 'تحديث سياسة الأمان',
    description: 'تم تحديث سياسة الأمان السيبراني',
    time: 'منذ 3 ساعات',
    icon: 'mdi-shield-check',
    avatarColor: 'info'
  }
])

const quickActions = ref([
  {
    title: 'تقرير جديد',
    icon: 'mdi-file-plus',
    action: () => router.push('/reports/new')
  },
  {
    title: 'تقييم مخاطر',
    icon: 'mdi-alert-octagon',
    action: () => router.push('/risk-management/new')
  },
  {
    title: 'مهمة جديدة',
    icon: 'mdi-clipboard-plus',
    action: () => router.push('/tasks/new')
  },
  {
    title: 'تدقيق',
    icon: 'mdi-magnify',
    action: () => router.push('/compliance/audit')
  }
])

const navigateTo = (path) => {
  router.push(path)
}

const viewAllActivities = () => {
  router.push('/activities')
}
</script>
