<template>
  <div class="menu-group-container" :class="{ 'rtl-menu': isRtl }">
    <!-- Menu item without children -->
    <v-list-item v-if="!item.children || item.children.length === 0" :to="item.path" class="menu-item mb-1 rounded-lg"
      :class="{ 'rail-mode-item': rail }" active-class="active-item rtl">
      <template v-slot:prepend>
        <v-icon class="menu-icon" size="20">{{ item.icon }}</v-icon>
      </template>
      <v-list-item-title v-if="!rail" class="menu-title">{{ item.title }}</v-list-item-title>

      <!-- Tooltip for Rail Mode -->
      <v-tooltip v-if="rail" activator="parent" :location="isRtl ? 'start' : 'end'">
        {{ item.title }}
      </v-tooltip>
    </v-list-item>

    <!-- Menu item with children -->
    <v-list-group v-else :value="item.id">
      <template v-slot:activator="{ props: activatorProps, isOpen }">
        <v-list-item v-bind="activatorProps" :title="rail ? '' : item.title" class="menu-item mb-1 rounded-lg"
          :class="{ 'rail-mode-item': rail, 'active-parent-item': isOpen }">
          <template v-slot:prepend>
            <v-icon class="menu-icon" size="20">{{ item.icon }}</v-icon>

            <!-- Tooltip for Rail Mode (Parent) -->
            <v-tooltip v-if="rail" activator="parent" :location="isRtl ? 'start' : 'end'">
              {{ item.title }}
            </v-tooltip>
          </template>
          <!-- Absolute hide for arrow in rail mode -->
          <template v-if="!rail" v-slot:append>
            <v-icon size="small">mdi-chevron-down</v-icon>
          </template>
        </v-list-item>
      </template>

      <template v-if="!rail">
        <v-list-item v-for="subItem in item.children" :key="subItem.title" :to="subItem.path" :title="subItem.title"
          :class="['sub-menu-item', 'text-sm', 'rounded-lg', isRtl ? 'pl-12' : 'pr-12']"
          active-class="active-sub-item"></v-list-item>
      </template>
    </v-list-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  rail: {
    type: Boolean,
    default: false
  },
  isRtl: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.menu-item {
  color: var(--color-sidebar-text) !important;
  border-radius: 8px !important;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  min-height: 48px;
}

.menu-item:hover {
  background-color: var(--color-sidebar-hover-item) !important;
}

.active-item {
  background-color: var(--color-sidebar-active-item) !important;
  color: var(--color-sidebar-text) !important;
  font-weight: 600;
}

.active-parent-item {
  background-color: var(--color-sidebar-active-parent) !important;
  color: var(--color-sidebar-text) !important;
}

.menu-icon {
  color: var(--color-sidebar-text) !important;
  opacity: 0.9;
}

.menu-title {
  font-family: var(--font-family-base) !important;
  font-size: 15px;
  font-weight: 500;
}

.sub-menu-item {
  color: var(--color-sidebar-text-secondary) !important;
  margin-bottom: 4px;
}

.sub-menu-item:hover {
  color: var(--color-sidebar-text) !important;
  background-color: var(--color-sidebar-hover-item) !important;
}

.active-sub-item {
  color: var(--color-sidebar-text) !important;
  background-color: var(--color-sidebar-active-item) !important;
  font-weight: 500;
}

:deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

/* Perfect Centering for Rail Mode */
.rail-mode-item {
  padding: 0 !important;
  margin-inline: 4px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.rail-mode-item :deep(.v-list-item__prepend) {
  margin: 0 !important;
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  min-width: unset !important;
}

.rail-mode-item :deep(.v-list-item__content),
.rail-mode-item :deep(.v-list-item__append),
.rail-mode-item :deep(.v-list-item-title),
.rail-mode-item :deep(.v-list-item__spacer) {
  display: none !important;
}

.rail-mode-item :deep(.v-icon) {
  margin: 0 !important;
}

/* RTL Support للعناصر الفرعية */
.rtl-menu :deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 0 !important;
  padding-inline-end: 16px !important;
  text-align: end !important;
}

/* LTR (Default) */
:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 16px !important;
}

[dir="rtl"] .menu-item,
[dir="rtl"] .v-list-item-title {
  direction: rtl !important;
}

/* تقليل المسافة بين الأيقونة والاسم */
:deep(.v-list-item__spacer) {
  width: 4px !important;
}

:deep(.v-list-item__prepend) {
  margin-inline-end: 4px !important;
}
</style>