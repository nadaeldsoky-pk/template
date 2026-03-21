<template>
  <div class="menu-group-container" :class="{ 'rtl-menu': isRtl }">
    <!-- Menu item without children -->
    <v-list-item v-if="!item.children || item.children.length === 0" :to="item.path" class="menu-item mb-1 rounded-lg"
      :class="{ 'rail-mode-item': rail }" active-class="active-item">
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
            <v-icon size="small" :class="{ 'rotate-180': isOpen }">mdi-chevron-down</v-icon>
          </template>
        </v-list-item>
      </template>

      <template v-if="!rail">
        <!-- Vertical left-border wrapper for sub-items -->
        <div class="sub-items-wrapper" :class="isRtl ? 'border-right' : 'border-left'">
          <template v-for="subItem in item.children" :key="subItem.title">
            <!-- Sub-item WITH grandchildren -->
            <v-list-group v-if="subItem.children && subItem.children.length" :value="subItem.title">
              <template v-slot:activator="{ props: subProps, isOpen: subOpen }">
                <v-list-item v-bind="subProps" :title="subItem.title"
                  class="sub-menu-item rounded-lg"
                  active-class="active-sub-item">
                  <template v-slot:append>
                    <v-icon size="small" :class="{ 'rotate-180': subOpen }">mdi-chevron-down</v-icon>
                  </template>
                </v-list-item>
              </template>
              <!-- Grandchildren with vertical border + bullet -->
              <div class="grand-items-wrapper" :class="isRtl ? 'border-right' : 'border-left'">
                <v-list-item
                  v-for="grandChild in subItem.children"
                  :key="grandChild.title"
                  :to="grandChild.path"
                  :title="grandChild.title"
                  class="grand-sub-item rounded-lg"
                  active-class="active-grand-item">
                  <template v-slot:prepend>
                    <span class="bullet-dot">•</span>
                  </template>
                </v-list-item>
              </div>
            </v-list-group>

            <!-- Sub-item WITHOUT grandchildren -->
            <v-list-item v-else :to="subItem.path" :title="subItem.title"
              class="sub-menu-item rounded-lg"
              active-class="active-sub-item" />
          </template>
        </div>
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
/* ── Top-level menu item ─────────────────────── */
.menu-item {
  color: var(--color-sidebar-text) !important;
  border-radius: 8px !important;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  min-height: 44px;
}

.menu-item:hover {
  background-color: var(--color-sidebar-hover-item) !important;
}

.active-item {
  background-color: #ffffff !important;
  color: #1e3a8a !important;
  font-weight: 600;
  border-radius: 8px !important;
}

.active-item :deep(.v-list-item-title) {
  color: #1e3a8a !important;
}

.active-item :deep(.v-icon) {
  color: #1e3a8a !important;
}

.active-parent-item {
  background-color: var(--color-sidebar-hover-item) !important;
  color: var(--color-sidebar-text) !important;
}

/* Chevron rotation animation */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

/* ── Icons & Text ────────────────────────────── */
.menu-icon {
  color: var(--color-sidebar-text) !important;
  opacity: 0.9;
}

.menu-title {
  font-family: var(--font-family-base) !important;
  font-size: 15px;
  font-weight: 500;
}

/* ── Sub-items wrapper with vertical border ──── */
.sub-items-wrapper {
  margin-bottom: 4px;
}

.sub-items-wrapper.border-left {
  border-left: 2px solid rgba(255, 255, 255, 0.25);
  margin-left: 20px;
  padding-left: 4px;
}

.sub-items-wrapper.border-right {
  border-right: 2px solid rgba(255, 255, 255, 0.25);
  margin-right: 20px;
  padding-right: 4px;
}

.sub-menu-item {
  color: var(--color-sidebar-text-secondary) !important;
  font-size: 13.5px;
  min-height: 38px !important;
  border-radius: 6px !important;
  margin-bottom: 2px;
}

.sub-menu-item:hover {
  color: var(--color-sidebar-text) !important;
  background-color: var(--color-sidebar-hover-item) !important;
}

.active-sub-item {
  color: var(--color-sidebar-text) !important;
  background-color: var(--color-sidebar-hover-item) !important;
  font-weight: 500;
}

/* ── Grand-children wrapper with vertical border  */
.grand-items-wrapper {
  margin-bottom: 2px;
}

.grand-items-wrapper.border-left {
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  margin-left: 16px;
  padding-left: 4px;
}

.grand-items-wrapper.border-right {
  border-right: 2px solid rgba(255, 255, 255, 0.2);
  margin-right: 16px;
  padding-right: 4px;
}

/* Bullet dot */
.bullet-dot {
  color: var(--color-sidebar-text-secondary);
  font-size: 18px;
  line-height: 1;
  margin-inline-end: 6px;
  width: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.grand-sub-item {
  color: var(--color-sidebar-text-secondary) !important;
  font-size: 13px;
  min-height: 36px !important;
  border-radius: 6px !important;
  margin-bottom: 2px;
}

.grand-sub-item:hover {
  color: var(--color-sidebar-text) !important;
  background-color: var(--color-sidebar-hover-item) !important;
}

/* Active grand-child = white background */
.active-grand-item {
  background-color: #ffffff !important;
  border-radius: 6px !important;
  font-weight: 500;
}

.active-grand-item :deep(.v-list-item-title) {
  color: #1e3a8a !important;
}

.active-grand-item .bullet-dot {
  color: #1e3a8a !important;
}

/* ── Vuetify overrides ───────────────────────── */
:deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

/* Rail mode */
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

/* Spacing between icon and text */
:deep(.v-list-item__spacer) {
  width: 4px !important;
}

:deep(.v-list-item__prepend) {
  margin-inline-end: 4px !important;
}

/* Remove default Vuetify padding-start from sub/grand items */
:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 8px !important;
  padding-inline-end: 8px !important;
}
</style>