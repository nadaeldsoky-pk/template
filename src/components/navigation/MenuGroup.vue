<template>
  <div class="menu-group-container">
    <!-- Menu item without children -->
    <v-list-item
      v-if="!item.children || item.children.length === 0"
      :to="item.path"
      class="menu-item mb-1 rounded-lg"
      :class="{ 'rail-mode-item': rail }"
      active-class="active-item"
    >
      <template v-slot:append>
        <div v-if="!rail" class="d-flex align-center gap-2">
          <span class="menu-title">{{ item.title }}</span>
          <v-icon class="menu-icon" size="20">{{ item.icon }}</v-icon>
        </div>
        <v-icon v-else class="menu-icon" size="20">{{ item.icon }}</v-icon>
      </template>
      <v-tooltip v-if="rail" activator="parent" location="end">
        {{ item.title }}
      </v-tooltip>
    </v-list-item>

    <!-- Menu item with children -->
    <v-list-group v-else :value="item.id">
      <template v-slot:activator="{ props: activatorProps, isOpen }">
        <v-list-item
          v-bind="activatorProps"
          class="menu-item mb-1 rounded-lg"
          :class="{ 'rail-mode-item': rail, 'active-parent-item': isOpen }"
        >
          <template v-if="!rail" v-slot:prepend>
            <v-icon size="small" :class="{ 'rotate-180': isOpen }">mdi-chevron-down</v-icon>
          </template>
          <template v-slot:append>
            <div v-if="!rail" class="d-flex align-center gap-2">
              <span class="menu-title">{{ item.title }}</span>
              <v-icon class="menu-icon" size="20">{{ item.icon }}</v-icon>
            </div>
            <template v-else>
              <v-icon class="menu-icon" size="20">{{ item.icon }}</v-icon>
              <v-tooltip activator="parent" location="end">{{ item.title }}</v-tooltip>
            </template>
          </template>
        </v-list-item>
      </template>

      <template v-if="!rail">
        <!-- Sub-items wrapper — border uses logical property (auto-flips with dir) -->
        <div class="sub-items-wrapper">
          <template v-for="subItem in item.children" :key="subItem.title">

            <!-- Sub-item WITH grandchildren -->
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
                    <span class="sub-menu-title">{{ subItem.title }}</span>
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
                    <div class="d-flex align-center gap-1">
                      <span class="grand-sub-title">{{ grandChild.title }}</span>
                      <span class="bullet-dot">•</span>
                    </div>
                  </template>
                </v-list-item>
              </div>
            </v-list-group>

            <!-- Sub-item WITHOUT grandchildren -->
            <v-list-item
              v-else
              :to="subItem.path"
              class="sub-menu-item rounded-lg"
              active-class="active-sub-item"
            >
              <template v-slot:append>
                <span class="sub-menu-title">{{ subItem.title }}</span>
              </template>
            </v-list-item>
          </template>
        </div>
      </template>
    </v-list-group>
  </div>
</template>

<script setup>
defineProps({
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

.menu-item:hover {
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
  //background-color: var(--color-sidebar-hover-item) !important;
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
/* border-inline-start flips automatically with [dir=rtl] */
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

/*
.grand-sub-item:hover {
  background-color: transparent !important;
}
*/

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
</style>