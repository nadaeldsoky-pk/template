<template>
  <div class="menu-group-container">
    <!-- ══════════════════════════════════════════════ -->
    <!-- 1. Item WITHOUT children (leaf node)          -->
    <!-- ══════════════════════════════════════════════ -->
    <v-list-item
      v-if="!item.children || item.children.length === 0"
      :to="item.path"
      class="menu-item mb-1 rounded-lg"
      :class="{ 'rail-mode-item': rail }"
      active-class="active-item"
    >
      <template v-slot:prepend>
        <v-icon v-if="rail" class="menu-icon" size="20">{{ item.icon }}</v-icon>
      </template>
      <template v-slot:append>
        <div v-if="!rail" class="d-flex align-center gap-2" style="min-width: 0;">
          <span class="menu-title" :dir="isRtl ? 'rtl' : 'ltr'" style="flex: 1 1 auto; min-width: 0;">{{ item.title }}</span>
          <v-icon class="menu-icon" style="flex-shrink: 0;" size="20">{{ item.icon }}</v-icon>
        </div>
      </template>

    </v-list-item>

    <!-- ══════════════════════════════════════════════ -->
    <!-- 2. Item WITH children — RAIL mode → flyout    -->
    <!-- ══════════════════════════════════════════════ -->
    <v-menu
      v-else-if="rail"
      location="end"
      :offset="12"
      open-on-hover
      :close-on-content-click="false"
      transition="slide-x-transition"
    >
      <!-- Trigger icon in the rail bar -->
      <template v-slot:activator="{ props: menuProps }">
        <v-list-item
          v-bind="menuProps"
          class="menu-item mb-1 rounded-lg rail-mode-item"
          :class="{ 'rail-active-item': isGroupActive }"
        >
          <template v-slot:prepend>
            <v-icon class="menu-icon" size="20">{{ item.icon }}</v-icon>
          </template>

        </v-list-item>
      </template>

      <!-- ────── Flyout card ────── -->
      <v-card
        class="flyout-card"
        elevation="4"
        width="260"
        rounded="xl"
        :dir="isRtl ? 'rtl' : 'ltr'"
      >

        <!-- Header: icon + group title -->
        <div class="flyout-header d-flex align-center gap-3 px-4 pt-4 pb-2">
          <v-icon size="22" class="flyout-header-icon">{{ item.icon }}</v-icon>
          <span class="flyout-header-title">{{ item.title }}</span>
        </div>
        <v-divider class="flyout-divider mx-3 mb-1" />

        <!-- Sub-items list -->
        <v-list class="flyout-list pa-2" density="compact">
          <template v-for="subItem in item.children" :key="subItem.title">

            <!-- Sub WITH grandchildren -->
            <v-list-group
              v-if="subItem.children && subItem.children.length"
              :value="subItem.title"
            >
              <template v-slot:activator="{ props: subProps, isOpen: subOpen }">
                <v-list-item
                  v-bind="subProps"
                  class="flyout-sub-item rounded-lg mb-1"
                >
                  <v-list-item-title class="flyout-sub-title">{{ subItem.title }}</v-list-item-title>
                  <v-tooltip activator="parent" location="top" :text="subItem.title" />
                  <template v-slot:append>
                    <v-icon size="16" :class="{ 'rotate-icon': subOpen }">mdi-chevron-down</v-icon>
                  </template>
                </v-list-item>
              </template>

              <!-- Grandchildren -->
              <div class="flyout-grand-wrapper">
                <v-list-item
                  v-for="grandChild in subItem.children"
                  :key="grandChild.title"
                  :to="grandChild.path"
                  class="flyout-grand-item rounded-lg mb-1"
                  active-class="active-flyout-grand"
                >
                  <template v-slot:prepend>
                    <span class="flyout-bullet">•</span>
                  </template>
                  <v-list-item-title class="flyout-grand-title">{{ grandChild.title }}</v-list-item-title>
                  <v-tooltip activator="parent" location="top" :text="grandChild.title" />
                </v-list-item>
              </div>
            </v-list-group>

            <!-- Sub WITHOUT grandchildren -->
            <v-list-item
              v-else
              :to="subItem.path"
              class="flyout-sub-item rounded-lg mb-1"
              active-class="active-flyout-sub"
            >
              <v-list-item-title class="flyout-sub-title">{{ subItem.title }}</v-list-item-title>
              <v-tooltip activator="parent" location="top" :text="subItem.title" />
            </v-list-item>

          </template>
        </v-list>
      </v-card>
    </v-menu>

    <!-- ══════════════════════════════════════════════ -->
    <!-- 3. Item WITH children — EXPANDED mode         -->
    <!-- ══════════════════════════════════════════════ -->
    <v-list-group v-else :value="item.id">
      <template v-slot:activator="{ props: activatorProps, isOpen }">
        <v-list-item
          v-bind="activatorProps"
          class="menu-item mb-1 rounded-lg"
          :class="{ 'active-parent-item': isOpen }"
        >
          <template v-slot:prepend>
            <v-icon size="small" :class="{ 'rotate-180': isOpen }">mdi-chevron-down</v-icon>
          </template>
          <template v-slot:append>
            <div class="d-flex align-center gap-2" style="min-width: 0;">
              <span class="menu-title" :title="item.title" :dir="isRtl ? 'rtl' : 'ltr'" style="flex: 1 1 auto; min-width: 0;">{{ item.title }}</span>
              <v-icon class="menu-icon" style="flex-shrink: 0;" size="20">{{ item.icon }}</v-icon>
            </div>
          </template>
        </v-list-item>
      </template>

      <!-- Sub-items wrapper -->
      <div class="sub-items-wrapper">
        <template v-for="subItem in item.children" :key="subItem.title">

          <!-- Sub WITH grandchildren -->
          <v-list-group v-if="subItem.children && subItem.children.length" :value="subItem.title">
            <template v-slot:activator="{ props: subProps, isOpen: subOpen }">
              <v-list-item
                v-bind="subProps"
                class="sub-menu-item rounded-lg"
                active-class="active-sub-item"
              >
                <template v-slot:prepend>
                  <v-icon size="small" :class="{ 'rotate-180': subOpen }">mdi-chevron-down</v-icon>
                </template>
                <template v-slot:append>
                  <span class="sub-menu-title" :title="subItem.title" :dir="isRtl ? 'rtl' : 'ltr'" style="min-width: 0; display: inline-block;">{{ subItem.title }}</span>
                </template>
              </v-list-item>
            </template>

            <!-- Grandchildren -->
            <div class="grand-items-wrapper">
              <v-list-item
                v-for="grandChild in subItem.children"
                :key="grandChild.title"
                :to="grandChild.path"
                class="grand-sub-item rounded-lg"
                active-class="active-grand-item"
              >
                <template v-slot:append>
                  <div class="d-flex align-center gap-1" style="min-width: 0;">
                    <span class="grand-sub-title" :title="grandChild.title" :dir="isRtl ? 'rtl' : 'ltr'" style="flex: 1 1 auto; min-width: 0;">{{ grandChild.title }}</span>
                    <span class="bullet-dot" style="flex-shrink: 0;">•</span>
                  </div>
                </template>
              </v-list-item>
            </div>
          </v-list-group>

          <!-- Sub WITHOUT grandchildren -->
          <v-list-item
            v-else
            :to="subItem.path"
            class="sub-menu-item rounded-lg"
            active-class="active-sub-item"
          >
            <template v-slot:append>
              <span class="sub-menu-title" :dir="isRtl ? 'rtl' : 'ltr'" style="min-width: 0; display: inline-block;">{{ subItem.title }}</span>
            </template>
          </v-list-item>

        </template>
      </div>
    </v-list-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

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
    default: null
  }
})

/** Returns true when the current route matches any child or grandchild path */
const isGroupActive = computed(() => {
  if (!props.item.children) return false
  return props.item.children.some(child => {
    if (route.path === child.path) return true
    if (child.children) {
      return child.children.some(gc => route.path === gc.path)
    }
    return false
  })
})

/** Detect RTL from the HTML element (set by the i18n/locale system) */
const isRtl = computed(() =>
  document.documentElement.dir === 'rtl' ||
  document.documentElement.lang === 'ar'
)
</script>

<style scoped>
/* ── Top-level item ─────────────────────────────── */
.menu-item {
  color: var(--color-sidebar-text) !important;
  border-radius: 8px !important;
  margin-bottom: 4px;
  transition: background 0.2s ease;
  min-height: 44px;
}

.menu-item:hover:not(.active-item):not(.rail-active-item) {
  background-color: transparent !important;
}

.menu-item:hover :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

.active-item {
  background-color: #ffffff !important;
  color: #1e3a8a !important;
  font-weight: 600;
  border-radius: 8px !important;
}

.active-item :deep(.v-list-item-title),
.active-item :deep(.v-icon) {
  color: #1e3a8a !important;
}

.active-parent-item {
  color: var(--color-sidebar-text) !important;
}

/* Chevron */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

/* Icon & title */
.menu-icon {
  color: var(--color-sidebar-text) !important;
  opacity: 0.9;
}

.menu-title {
  font-family: var(--font-family-base) !important;
  font-size: 15px;
  font-weight: 500;
}

/* ── Sub-items wrapper ──────────────────────────── */
.sub-items-wrapper {
  margin-inline-end: 20px;
  padding-inline-end: 4px;
  border-inline-end: 2px solid rgba(255, 255, 255, 0.25);
  margin-bottom: 4px;
}

.sub-menu-item {
  color: var(--color-sidebar-text-secondary) !important;
  font-size: 13.5px;
  min-height: 38px !important;
  border-radius: 6px !important;
  margin-bottom: 2px;
}

.sub-menu-item:hover :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

.active-sub-item {
  background-color: #ffffff !important;
  border-radius: 6px !important;
  font-weight: 500;
}

.active-sub-item .sub-menu-title {
  color: #1e3a8a !important;
  font-weight: 600;
}

.active-sub-item :deep(.v-icon) {
  color: #1e3a8a !important;
}

.sub-menu-title {
  font-family: var(--font-family-base) !important;
  font-size: 13.5px;
  color: var(--color-sidebar-text-secondary);
}

.grand-sub-title {
  font-family: var(--font-family-base) !important;
  font-size: 13px;
  color: var(--color-sidebar-text-secondary);
}

/* ── Grand-children wrapper ─────────────────────── */
.grand-items-wrapper {
  margin-inline-end: 16px;
  padding-inline-end: 4px;
  border-inline-end: 2px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2px;
}

.grand-sub-item {
  color: var(--color-sidebar-text-secondary) !important;
  font-size: 13px;
  min-height: 36px !important;
  border-radius: 6px !important;
  margin-bottom: 2px;
}

.grand-sub-item:hover :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

.active-grand-item {
  background-color: #ffffff !important;
  border-radius: 6px !important;
  font-weight: 500;
}

.active-grand-item :deep(.v-list-item-title) {
  color: #1e3a8a !important;
}

.active-grand-item .bullet-dot,
.active-grand-item .grand-sub-title {
  color: #1e3a8a !important;
  font-weight: 600;
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

/* ── Vuetify overrides ──────────────────────────── */
:deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

/* Rail mode — icon-only button */
.rail-mode-item {
  padding: 0 !important;
  margin-inline: 4px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

/* Active state highlight for rail icon */
.rail-active-item {
  background-color: #ffffff !important;
  border-radius: 8px !important;
}

.rail-active-item :deep(.v-icon) {
  color: #1e3a8a !important;
  opacity: 1 !important;
}

/* Also force active-item icon to be centred in rail */
.rail-mode-item.active-item {
  background-color: #ffffff !important;
  border-radius: 8px !important;
}

.rail-mode-item.active-item :deep(.v-icon) {
  color: #1e3a8a !important;
  opacity: 1 !important;
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

/* Icon-text gap */
:deep(.v-list-item__spacer) {
  width: 4px !important;
}

:deep(.v-list-item__prepend) {
  margin-inline-end: 4px !important;
}

/* Remove Vuetify default padding on nested items */
:deep(.v-list-group__items .v-list-item) {
  padding-inline-start: 8px !important;
  padding-inline-end: 8px !important;
}

/* ══════════════════════════════════════════════════
   FLYOUT MENU — Rail mode
   ══════════════════════════════════════════════════ */
.flyout-card {
  background-color: #eef2f9 !important;
  border: 1px solid #d1daf0;
  overflow: hidden;
}

/* Header row */
.flyout-header {
  background-color: transparent;
}

.flyout-header-icon {
  color: #1e3a8a !important;
}

.flyout-header-title {
  font-family: var(--font-family-base) !important;
  font-size: 16px;
  font-weight: 700;
  color: #1e3a8a;
}

/* Separator line */
.flyout-divider {
  border-color: #b8c7e0 !important;
  opacity: 1 !important;
}

/* List inside flyout */
.flyout-list {
  background-color: transparent !important;
}

/* Sub-item row */
.flyout-sub-item {
  color: #1e293b !important;
  min-height: 38px !important;
}

.flyout-sub-item:hover {
  background-color: rgba(30, 58, 138, 0.06) !important;
}

.flyout-sub-title {
  font-family: var(--font-family-base) !important;
  font-size: 13.5px;
  font-weight: 500;
  color: #1e293b !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

/* Active sub */
.active-flyout-sub {
  background-color: #ffffff !important;
  border-radius: 6px !important;
}

.active-flyout-sub .flyout-sub-title {
  color: #1e3a8a !important;
  font-weight: 600;
}

/* Grandchildren wrapper */
.flyout-grand-wrapper {
  margin-inline-start: 8px;
  padding-inline-start: 10px;
  border-inline-start: 2px solid #b8c7e0;
  margin-block: 2px;
}

/* Grandchild row */
.flyout-grand-item {
  color: #334155 !important;
  min-height: 36px !important;
}

.flyout-grand-title {
  font-family: var(--font-family-base) !important;
  font-size: 13px;
  color: #334155 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.flyout-bullet {
  font-size: 18px;
  color: #64748b;
  margin-inline-end: 6px;
  line-height: 1;
}

/* Active grandchild */
.active-flyout-grand {
  background-color: #ffffff !important;
  border-radius: 6px !important;
}

.active-flyout-grand .flyout-grand-title {
  color: #1e3a8a !important;
  font-weight: 600;
}

.active-flyout-grand .flyout-bullet {
  color: #1e3a8a !important;
}

/* Chevron rotation in flyout */
.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}


.menu-title {
  font-family: var(--font-family-base) !important;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

.sub-menu-title {
  font-family: var(--font-family-base) !important;
  font-size: 13.5px;
  color: var(--color-sidebar-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

.grand-sub-title {
  font-family: var(--font-family-base) !important;
  font-size: 13px;
  color: var(--color-sidebar-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
}

:deep(.v-list-item__append) {
  min-width: 0 !important;
  flex-shrink: 1 !important;
}
</style>