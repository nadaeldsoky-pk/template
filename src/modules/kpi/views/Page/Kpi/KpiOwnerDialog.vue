<template>
  <v-dialog 
    :model-value="showModal" 
    @update:model-value="$emit('update:showModal', $event)" 
    max-width="600px" 
    persistent
  >
    <v-card class="kpi-modal-card" style="background: #f5f5f5">
      <!-- Header -->
      <v-card-title class="modal-header">
        <span class="modal-title">{{ $t('kpi.select_owners') }}</span>
        <div class="cursor" @click="closeModal">
          <svg
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 1.5L1 11.5M11 11.5L1 1.5"
              stroke="#404040"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </v-card-title>

      <v-card-text class="modal-content">
        <div class="card p-4 mb-0">
          <!-- Current Choose Section -->
          <div class="current-choose-section">
            <h6 class="section-label">{{ $t('kpi.current Choose') }}</h6>
            <div class="selected-chips-container">
              <v-chip
                v-for="user in getSelectedUsers()"
                :key="'user-'+user.id"
                class="selected-chip"
                closable
                @click:close="removeSelectedUser(user.id)"
              >
                <div class="chip-avatar">{{ getInitials(user.name) }}</div>
                <span class="chip-text mx-2">{{ user.name }}</span>
              </v-chip>
              <v-chip
                v-for="position in getSelectedPositions()"
                :key="'position-'+position.id"
                class="selected-chip"
                closable
                @click:close="removeSelectedPosition(position.id)"
              >
                <div class="chip-avatar">{{ getInitials(position.name) }}</div>
                <span class="chip-text mx-2">{{ position.name }}</span>
              </v-chip>
              <p v-if="!selectedUserOwners.length && !selectedPositionOwners.length" class="empty-text">
                {{ $t('kpi.Not Choose Any One') }}
              </p>
            </div>
          </div>

          <!-- Search Input -->
          <div class="search-container">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search Users & Positions"
              variant="outlined"
              density="compact"
              hide-details
              class="search-input"
            >
              <template v-slot:append-inner>
                <v-icon color="#9CA3AF">mdi-magnify</v-icon>
              </template>
            </v-text-field>
          </div>

          <!-- Tabs -->
          <div class="tabs-container">
            <button 
              class="tab-button"
              :class="{ active: currentOwnerTab === 'users' }"
              @click="currentOwnerTab = 'users'"
            >
              {{ $t('kpi.users') }}
            </button>
            <button 
              class="tab-button"
              :class="{ active: currentOwnerTab === 'positions' }"
              @click="currentOwnerTab = 'positions'"
            >
              {{ $t('kpi.positions') }}
            </button>
          </div>

          <!-- List Content -->
          <div class="list-container">
            <div v-if="currentOwnerTab === 'users'" class="list-content">
              <label 
                v-for="user in filteredUsers"
                :key="user.id"
                class="list-item"
              >
                <input
                  type="checkbox"
                  :checked="selectedUserOwners.includes(user.id)"
                  @change="toggleUser(user.id)"
                  class="custom-checkbox"
                />
                <div class="user-avatar">{{ getInitials(user.name) }}</div>
                <div class="user-info">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-role">Admin</div>
                </div>
              </label>
              <div v-if="filteredUsers.length === 0" class="no-results">
                No users found
              </div>
            </div>

            <div v-if="currentOwnerTab === 'positions'" class="list-content">
              <label 
                v-for="position in filteredPositions"
                :key="position.id"
                class="list-item"
              >
                <input
                  type="checkbox"
                  :checked="selectedPositionOwners.includes(position.id)"
                  @change="togglePosition(position.id)"
                  class="custom-checkbox"
                />
                <div class="user-avatar">{{ getInitials(position.name) }}</div>
                <div class="user-info">
                  <div class="user-name">{{ position.name }}</div>
                  <div class="user-role">Position</div>
                </div>
              </label>
              <div v-if="filteredPositions.length === 0" class="no-results">
                No positions found
              </div>
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Footer Actions -->
      <v-card-actions class="modal-actions">
        <button class="cancel-btn" @click="closeModal">
          {{ $t('kpi.cancel') }}
        </button>
        <button class="save-btn" @click="saveOwners">
          {{ $t('kpi.save') }}
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue';

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  users: {
    type: Array,
    default: () => []
  },
  positions: {
    type: Array,
    default: () => []
  },
  initialSelectedOwners: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:showModal', 'close', 'save']);

const selectedUserOwners = ref([]);
const selectedPositionOwners = ref([]);
const currentOwnerTab = ref('users');
const searchQuery = ref('');

// Get initials from name
const getInitials = (name) => {
  if (!name) return 'NA';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// Filtered users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return props.users;
  }
  const query = searchQuery.value.toLowerCase();
  return props.users.filter(user => 
    user.name.toLowerCase().includes(query)
  );
});

// Filtered positions based on search query
const filteredPositions = computed(() => {
  if (!searchQuery.value) {
    return props.positions;
  }
  const query = searchQuery.value.toLowerCase();
  return props.positions.filter(position => 
    position.name.toLowerCase().includes(query)
  );
});

const determineDefaultTab = () => {
  if (props.initialSelectedOwners && props.initialSelectedOwners.length > 0) {
    const hasUserOwners = props.initialSelectedOwners.some(owner => owner.type === 'user');
    const hasPositionOwners = props.initialSelectedOwners.some(owner => owner.type === 'position');
    
    if (hasUserOwners) {
      currentOwnerTab.value = 'users';
    } else if (hasPositionOwners) {
      currentOwnerTab.value = 'positions';
    }
  }
};

watch(() => props.initialSelectedOwners, (newVal) => {
  selectedUserOwners.value = newVal.filter(owner => owner.type === 'user').map(owner => owner.id);
  selectedPositionOwners.value = newVal.filter(owner => owner.type === 'position').map(owner => owner.id);
  determineDefaultTab(); 
}, { immediate: true });

const closeModal = () => {
  emit('update:showModal', false);
  emit('close');
};

const saveOwners = () => {
  const owners = [
    ...selectedUserOwners.value.map(id => ({ id, type: 'user' })),
    ...selectedPositionOwners.value.map(id => ({ id, type: 'position' }))
  ];
  emit('save', owners);
  closeModal();
};

const getSelectedUsers = () => {
  return props.users.filter(user => selectedUserOwners.value.includes(user.id));
};

const getSelectedPositions = () => {
  return props.positions.filter(position => selectedPositionOwners.value.includes(position.id));
};

const removeSelectedUser = (id) => {
  selectedUserOwners.value = selectedUserOwners.value.filter(userId => userId !== id);
};

const removeSelectedPosition = (id) => {
  selectedPositionOwners.value = selectedPositionOwners.value.filter(positionId => positionId !== id);
};

const toggleUser = (id) => {
  if (selectedUserOwners.value.includes(id)) {
    selectedUserOwners.value = selectedUserOwners.value.filter(userId => userId !== id);
  } else {
    selectedUserOwners.value.push(id);
    selectedPositionOwners.value = [];
  }
};

const togglePosition = (id) => {
  if (selectedPositionOwners.value.includes(id)) {
    selectedPositionOwners.value = selectedPositionOwners.value.filter(positionId => positionId !== id);
  } else {
    selectedPositionOwners.value.push(id);
    selectedUserOwners.value = [];
  }
};
</script>

<style scoped>
/* ============================================ */
/* MODAL CARD STYLES */
/* ============================================ */
.cursor {
  cursor: pointer;
}

.kpi-modal-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px 0 !important;
  background: #f5f5f5;
}

.modal-title {
  font-size: 20px;
  font-weight: 800;
  color: #000;
}

.modal-content {
  padding: 0 15px !important;
  background: #f5f5f5;
  max-height: 600px;
  overflow-y: auto;
}

/* ============================================ */
/* CARD CONTAINER */
/* ============================================ */
.card {
  background-color: #fff;
  border-radius: 10px;
}

.p-4 {
  padding: 16px;
}

.mb-0 {
  margin-bottom: 0;
}

/* ============================================ */
/* CURRENT CHOOSE SECTION */
/* ============================================ */
.current-choose-section {
  margin-bottom: 20px;
}

.section-label {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 12px;
}

.selected-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 52px;
  align-items: center;
}

.empty-text {
  color: #9CA3AF;
  font-size: 14px;
  margin: 0;
}

.selected-chip {
  background: #F5F5F5 !important;
  border-radius: 24px !important;
  height: 40px !important;
  padding: 0 12px 0 4px !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chip-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #EBDCB3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #C4951B;
}

.chip-text {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

/* ============================================ */
/* SEARCH INPUT */
/* ============================================ */
.search-container {
  margin-bottom: 20px;
}

.search-input :deep(.v-field) {
  border-radius: 12px !important;
  border: 1px solid #E5E7EB !important;
  background: white;
  font-size: 15px;
}

.search-input :deep(.v-field__input) {
  padding: 14px 16px !important;
  min-height: 52px !important;
  font-size: 15px;
}

.search-input :deep(input::placeholder) {
  color: #9CA3AF;
  font-size: 15px;
}

/* ============================================ */
/* TABS */
/* ============================================ */
.tabs-container {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #6E3894;
}

.tab-button {
  flex: 1;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  background: white;
  color: #6E3894;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  background: #6E3894;
  color: white;
}

.tab-button:hover:not(.active) {
  background: #F5F3FF;
}

/* ============================================ */
/* LIST CONTAINER */
/* ============================================ */
.list-container {
  background: white;
  max-height: 400px;
  overflow-y: auto;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}

.list-item:hover {
  background: #F9FAFB;
}

.no-results {
  padding: 24px;
  text-align: center;
  color: #9CA3AF;
  font-size: 14px;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border: 2px solid #6E3894;
  border-radius: 4px;
  cursor: pointer;
  appearance: none;
  background: white;
  position: relative;
  transition: all 0.2s;
}

.custom-checkbox:checked {
  background: #6E3894;
  border-color: #6E3894;
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.user-avatar {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  background: #DDD6FE;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #5B21B6;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.user-role {
  font-size: 14px;
  font-weight: 400;
  color: #6B7280;
  line-height: 1.3;
}

/* ============================================ */
/* FOOTER ACTIONS */
/* ============================================ */
.modal-actions {
  padding: 12px 24px !important;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  background: #f5f5f5;
}

.cancel-btn {
  border: 1px solid #6e3894 !important;
  color: #43235c !important;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 24px !important;
  border-radius: 10px !important;
  cursor: pointer;
  background: transparent;
  height: 36px;
}

.cancel-btn:hover {
  background: #f3e8ff;
}

.save-btn {
  background: #6e3894 !important;
  color: #ffffff !important;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 24px !important;
  border-radius: 10px !important;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
}

.save-btn:hover:not(:disabled) {
  background: #5b2d7a !important;
}

.save-btn:disabled {
  background: #d1d5db !important;
  cursor: not-allowed;
}

/* ============================================ */
/* SCROLLBAR STYLING */
/* ============================================ */
.modal-content::-webkit-scrollbar,
.list-container::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track,
.list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb,
.list-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover,
.list-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */
@media (max-width: 640px) {
  .modal-header {
    padding: 12px 16px 0 !important;
  }

  .modal-content {
    padding: 0 12px !important;
  }

  .modal-actions {
    padding: 12px 16px !important;
  }

  .tab-button {
    font-size: 14px;
    padding: 12px 16px;
  }
}
</style>