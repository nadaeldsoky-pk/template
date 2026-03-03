<template>
  <!-- KPI Frequency Data Modal -->
  <div v-if="showModal" class="modal-backdrop fade show"></div>
  <div 
    v-if="showModal"
    class="modal fade show"
    tabindex="-1"
    style="display: block;"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content shadow">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <h5 class="modal-title">
            {{ kpi?.name }} - {{ $t('kpi.frequencyData') }}
          </h5>
          <button 
            type="button" 
            @click="closeModal"
          >
          <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 1.5L1 11.5M11 11.5L1 1.5" stroke="#404040" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</button>
        </div>

        <div class="modal-body">
          <div class="card mb-1">
            <!-- Frequency Data Table -->
            <div v-if="paginatedData.length">
              <div class="table-responsive p-3">
                <table class="table align-middle table-hover border custom-table">
                  <thead class="table-light">
                    <tr>
                      <th class="fw-semibold text-start px-6">{{ $t('kpi.date') }} & Time</th>
                      <th class="fw-semibold text-center ps-9">{{ $t('kpi.value') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in paginatedData" :key="index">
                      <td class="text-start px-6">{{ formatDate(item.date) }}</td>
                      <td class="text-end px-6">{{ item.value }} {{ kpi.kpiunit?.name }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-5">
              <i class="fas fa-chart-pie fa-3x text-muted mb-3"></i>
              <h5>{{ $t('kpi.No Frequency Data Available') }}</h5>
              <p class="text-muted">
                {{ $t('kpi.This KPI doesnt have any frequency targets configured yet') }}
              </p>
            </div>
          </div>
          <!-- Smart Pagination -->
              <nav aria-label="Page navigation" v-if="paginatedData.length">
                <ul class="pagination justify-content-center align-items-center mb-0">
                  <!-- Prev -->
                  <li class="page-item mx-1 " :class="{ disabled: currentPage === 1 }">
                    <button class="page-link prev-next-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                      <i class="fas fa-chevron-left fa-xs"></i>
                    </button>
                  </li>

                  <!-- Dynamic pages -->
                  <li 
                    v-for="(page, index) in visiblePages" 
                    :key="index"
                    class="page-item"
                    :class="{ active: currentPage === page, disabled: page === '...'}"
                  >
                    <button 
                      class="page-link page-number-btn"
                      v-if="page !== '...'"
                      @click="changePage(page)"
                    >
                      {{ page }}
                    </button>
                    <span v-else class="page-link page-dots">…</span>
                  </li>

                  <!-- Next -->
                  <li class="page-item mx-1" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link prev-next-btn" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                      <i class="fas fa-chevron-right fa-xs "></i>
                    </button>
                  </li>
                </ul>
              </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  showModal: Boolean,
  kpi: Object
});
const emit = defineEmits(['close']);

const closeModal = () => emit('close');

// Pagination logic
const currentPage = ref(1);
const itemsPerPage = 4;

const totalPages = computed(() => {
  if (!props.kpi?.frequency_data) return 1;
  return Math.ceil(props.kpi.frequency_data.length / itemsPerPage);
});

const paginatedData = computed(() => {
  if (!props.kpi?.frequency_data) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  return props.kpi.frequency_data.slice(start, start + itemsPerPage);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

// Smart pagination generator
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2;
  const range = [];

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }

  if (current - delta > 2) range.unshift("...");
  if (current + delta < total - 1) range.push("...");

  range.unshift(1);
  if (total > 1) range.push(total);

  return range;
});

// Date formatter
const formatDate = (date) => {
  if (!date) return "N/A";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours() % 12 || 12;
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = d.getHours() >= 12 ? "PM" : "AM";
    return `${day}/${month}/${year} at ${hours}:${minutes} ${ampm}`;
  } catch {
    return "N/A";
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.modal-title{
font-weight:700;
color:#000;
}
.table th {
  font-size: 14px;
  text-transform: uppercase;
  color: #404040;
  font-weight:500;
}

.table td {
  vertical-align: middle;
  font-size: 12px;
  color: #404040;
  font-weight:500;
}

.page-link {
  border-radius: 50% !important;
  width: 25px;
  height: 25;
  display: flex;
  align-items: center;
  justify-content: center;
  background:transparent;
    color: #919191;
    font-weight:600;
}
.page-link.prev-next-btn{
    background: #43235C;
    height: 20px;
    color:#fff;
}
.page-link:focus {
    box-shadow: unset !important;
}

.page-item.active .page-link {
  background-color: transparent ;
  border-color: transparent;
    color: #43235C;

}

.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-content {
  border-radius: 0.75rem;
  background: #F5F5F5;
}

.modal-header {
  border-bottom: 0px; 
  padding: 14px 14px 0px 14px !important; 
}
.page-link {
    border: 0;
}
.custom-table {
  border-radius: 10px;
  overflow: hidden;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fff;
}
</style>
