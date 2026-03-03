<template>
  <!-- Reviews Modal (Bootstrap-style like your first modal) -->
  <div v-if="showModal" class="modal-backdrop fade show"></div>

  <div
    v-if="showModal"
    class="modal fade show"
    tabindex="-1"
    style="display: block"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content shadow">
        <!-- Header (same look as first modal) -->
        <div class="modal-header d-flex justify-content-between align-items-center">
          <h5 class="modal-title">{{ kpi?.name || "" }} - {{ $t("kpi.Reviews") }}</h5>

          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>

        <div class="modal-body">
          <div class="card mb-1">
            <!-- Table or Empty -->
            <div v-if="hasData">
              <div class="table-responsive p-3">
                <table class="table align-middle table-hover border custom-table">
                  <thead class="table-light">
                    <tr>
                      <th class="fw-semibold text-center px-6">
                        {{ $t("kpi.Submission Date") }}
                      </th>
                      <th class="fw-semibold text-center ps-9">
                        {{ $t("kpi.Submitted By") }}
                      </th>
                      <th class="fw-semibold text-center ps-9">
                        {{ $t("kpi.Submitted Value") }}
                      </th>
                      <th class="fw-semibold text-center ps-9">{{ $t("kpi.Status") }}</th>
                      <th class="fw-semibold text-center ps-9">
                        {{ $t("kpi.Actions") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td colspan="5" class="text-center py-4">
                        <div class="spinner-border" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>

                    <tr v-for="(item, index) in paginatedData" :key="item.id || index">
                      <td class="text-center px-6">
                        {{ formatDate(item.submission_date) }}
                      </td>
                      <td class="text-center px-6">
                        {{ getSubmitterName(item.created_by) }}
                      </td>
                      <td class="text-center px-6">
                        {{ item.actual_value }} {{ kpi?.kpiunit?.name || "" }}
                      </td>
                      <td class="text-center px-6">
                        <span class="status-label" :class="statusClass(item.status)">
                          <i :class="statusIconClass(item.status)"></i>
                          &nbsp;{{ item.status }}
                        </span>
                      </td>
                      <td class="text-center ps-6">
                        <button class="btn btn-sm" @click="viewReviewDetails(item)">
                          <svg
                            width="30"
                            height="21"
                            viewBox="0 0 30 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect y="0.5" width="30" height="20" rx="10" fill="#D0B5E3" />
                            <path
                              d="M8.5 10.5C8.5 10.5 10.8636 6.5 15 6.5C19.1364 6.5 21.5 10.5 21.5 10.5C21.5 10.5 19.1364 14.5 15 14.5C10.8636 14.5 8.5 10.5 8.5 10.5Z"
                              stroke="#6E3894"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M15 12C15.979 12 16.7727 11.3284 16.7727 10.5C16.7727 9.67157 15.979 9 15 9C14.0209 9 13.2273 9.67157 13.2273 10.5C13.2273 11.3284 14.0209 12 15 12Z"
                              stroke="#6E3894"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-5">
              <i class="fas fa-chart-pie fa-3x text-muted mb-3"></i>
              <h5>{{ $t("kpi.No Reviews Available") }}</h5>
              <p class="text-muted">
                {{ $t("kpi.This KPI doesnt have any reviews yet") }}
              </p>
            </div>
          </div>

          <!-- Pagination (same smart pagination as frequency modal) -->
          <nav aria-label="Page navigation" v-if="hasData">
            <ul class="pagination justify-content-center align-items-center mb-0">
              <!-- Prev -->
              <li class="page-item mx-1" :class="{ disabled: currentPage === 1 }">
                <button
                  class="page-link prev-next-btn"
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                >
                  <i class="fas fa-chevron-left fa-xs"></i>
                </button>
              </li>

              <!-- Dynamic pages -->
              <li
                v-for="(page, index) in visiblePages"
                :key="index"
                class="page-item"
                :class="{ active: currentPage === page, disabled: page === '...' }"
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
              <li
                class="page-item mx-1"
                :class="{ disabled: currentPage === totalPages }"
              >
                <button
                  class="page-link prev-next-btn"
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                >
                  <i class="fas fa-chevron-right fa-xs"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Review Details Modal (styled same style) -->
  <div v-if="showReviewDetails" class="modal-backdrop fade show"></div>
  <div
    v-if="showReviewDetails"
    class="modal fade show"
    tabindex="-1"
    style="display: block"
    @click.self="showReviewDetails = false"
  >
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content shadow">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <h5 class="modal-title">
            {{ $t("kpi.Review Details") }}
            <span class="status-label ms-2" :class="statusClass(selectedReview.status)">
              <i :class="statusIconClass(selectedReview.status)"></i>
              &nbsp;{{ selectedReview.status }}
            </span>
          </h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="showReviewDetails = false"
          ></button>
        </div>

        <div class="modal-body">
          <div v-if="selectedReview">
            <div class="row">
              <div class="col-6 text-center">
                <div class="card mb-2 p-2">
                  <div class="result-label">{{ $t("kpi.Result") }}</div>
                  <div class="result-value">
                    {{ calculateSubmissionResult(selectedReview) }}
                  </div>
                </div>
              </div>
              <div class="col-6 text-center">
                <div class="card mb-2 p-2">
                  <div class="result-label">{{ $t("kpi.Current Period Target") }}</div>
                  <div class="result-value">
                    {{ selectedReview?.current_period_target }}
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-4">
                <div class="card p-2">
                  <div class="info-label text-center">
                    {{ $t("kpi.Submission Date") }}
                  </div>
                  <div class="info-value text-center">
                    {{ formatDate(selectedReview.submission_date) }}
                  </div>

                  <div></div>
                </div>
              </div>
              <div class="col-4">
                <div class="card p-2">
                  <div class="info-label text-center">{{ $t("kpi.Submitted By") }}</div>
                  <div class="info-value text-center">
                    {{ getSubmitterName(selectedReview.created_by) }}
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div v-if="selectedReview.reviewed_by" class="card p-2">
                  <div class="info-label text-center">{{ $t("kpi.Reviewed By") }}</div>
                  <div class="info-value text-center">
                    {{ getSubmitterName(selectedReview.reviewed_by) }}
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div
                  v-if="selectedReview.submission_comment || selectedReview.reviewer_co"
                >
                  <div class="info-label text-center">{{ $t("kpi.Comments") }}</div>
                  <div class="comment-content p-2">
                    <div v-if="selectedReview.submission_comment">
                      <strong>{{ $t("kpi.Submitter Comment") }}:</strong>
                      <div class="mt-1">{{ selectedReview.submission_comment }}</div>
                    </div>
                    <div v-if="selectedReview.reviewer_comment" class="mt-2">
                      <strong>{{ $t("kpi.Reviewer Comment") }}:</strong>
                      <div class="mt-1">{{ selectedReview.reviewer_comment }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formula & variables & results (if exist) -->
            <!-- Formula & variables & results (if exist) -->
            <div
              v-if="
                selectedReview?.kpi?.formulaParts && hasVariableValues(selectedReview)
              "
            >
              <div class="formula-container p-3">
                <div class="formula-label">{{ $t("kpi.Formula") }}</div>
                <div class="formula-display mt-2">
                  {{ buildDisplayFormula(selectedReview.kpi.formulaParts) }}
                </div>

                <div class="variables-container mt-3">
                  <div class="variables-label">{{ $t("kpi.Variable Values") }}</div>
                  <table class="table variables-table mt-2 mb-0 border rounded-2">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th class="text-center">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="v in getVariableValues(selectedReview)" :key="v.id">
                        <td class="variable-name">
                          <i class="fas fa-square-root-alt me-1"></i>
                          {{ v.name || v.id }}
                        </td>
                        <td class="variable-value text-center">
                          <span>{{ formatVariableValue(v.value) }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <p class="text-muted">{{ $t("kpi.No review selected") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import kpireviewer from "@/modules/kpi/API/KPIReviwer/KPIReviwer";
import usersApi from "@/API/User/User";

const props = defineProps({
  // optional: if parent passes kpi as prop, component can use it.
  kpi: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(["close"]);

// state
const showModal = ref(false);
const loading = ref(false);
const reviews = ref([]);
const selectedReview = ref(null);
const users = ref([]);
const showReviewDetails = ref(false);

// pagination same as first modal
const currentPage = ref(1);
const itemsPerPage = 4;

const totalPages = computed(() => {
  const list = Array.isArray(reviews.value) ? reviews.value : [];
  return Math.max(1, Math.ceil(list.length / itemsPerPage));
});

const paginatedData = computed(() => {
  const list = Array.isArray(reviews.value) ? reviews.value : [];
  const start = (currentPage.value - 1) * itemsPerPage;
  return list.slice(start, start + itemsPerPage);
});

const hasData = computed(() => Array.isArray(reviews.value) && reviews.value.length > 0);

const changePage = (page) => {
  if (page === "...") return;
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

// smart pagination generator
const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2;
  const range = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) range.unshift("...");
  if (current + delta < total - 1) range.push("...");

  range.unshift(1);
  if (total > 1) range.push(total);

  return range;
});

const hasVariableValues = (review) => {
  if (!review) return false;
  
  const manualVars = parseVariableValues(review.variable_values);
  const autoVars = parseVariableValues(review.automatic_variable_values);
  
  return manualVars.length > 0 || autoVars.length > 0;
};

const parseVariableValues = (variableData) => {
  if (!variableData) return [];
  
  try {
    // If it's already an array, return it
    if (Array.isArray(variableData)) {
      return variableData;
    }
    
    // If it's a JSON string, parse it
    if (typeof variableData === 'string') {
      const parsed = JSON.parse(variableData);
      return Array.isArray(parsed) ? parsed : [];
    }
    
    return [];
  } catch (error) {
    console.error('Error parsing variable values:', error);
    return [];
  }
};

const getVariableValues = (review) => {
  if (!review) return [];
  
  const manualVars = parseVariableValues(review.variable_values);
  const autoVars = parseVariableValues(review.automatic_variable_values);
  
  return [...manualVars, ...autoVars];
};

const formatVariableValue = (value) => {
  if (value === null || value === undefined) return 'N/A';
  
  // Convert to number if possible for better formatting
  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    // Format numbers with commas and limit decimal places
    return numValue.toLocaleString('en-US', {
      maximumFractionDigits: 4
    });
  }
  
  return String(value);
};

// Update the calculateSubmissionResult function to handle parsed values
const calculateSubmissionResult = (item) => {
  if (!item?.kpi?.formulaParts) return "";
  
  const allValues = getVariableValues(item);
  let expr = "";
  
  item.kpi?.formulaParts.forEach((part) => {
    if (part.type === "variable") {
      let varId = typeof part.variable === "object" ? part.variable.id : part.variable;
      const found = allValues.find((v) => v.id === varId);
      expr += found ? found.value : 0;
    } else if (part.type === "operator") {
      expr += ` ${part.value} `;
    } else if (part.type === "number") {
      expr += part.value;
    }
  });
  
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict";return (${expr})`)();
    return isNaN(result) ? "Invalid" : formatVariableValue(result);
  } catch {
    return "Error";
  }
};
// helpers
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
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return "N/A";
  }
};

const getSubmitterName = (userId) => {
  if(userId === 'system-auto') {
        return 'system-auto';
    }

    if(!userId) {
        return this.$t('kpi.Unknown');
    }
  const user = users.value.find((u) => u.id === userId);
  return user ? user.full_name : $t("kpi.Unknown");
};

const statusClass = (status) => {
  switch (status) {
    case "approved":
      return "status-approved";
    case "rejected":
      return "status-rejected";
    case "pending":
      return "status-pending";
    default:
      return "status-default";
  }
};

const statusIconClass = (status) => {
  switch (status) {
    case "approved":
      return "fas fa-check-circle";
    case "rejected":
      return "fas fa-times-circle";
    case "pending":
      return "fas fa-clock";
    default:
      return "fas fa-question-circle";
  }
};

// API calls
const loadUsers = async () => {
  try {
    const api = new usersApi();
    const response = await api.getAll({ select: "id|full_name" });
    users.value = Array.isArray(response) ? response : response?.data || [];
  } catch (error) {
    console.error("Error loading users:", error);
    users.value = [];
  }
};

const loadReviews = async (kpiId) => {
  loading.value = true;
  try {
    const api = new kpireviewer();
    const response = await api.getAll({
      filter: `kpi_id|${kpiId}&&status|pending|!=`,
      with: ["kpi", "kpi.kpiunit"],
    });
    reviews.value = Array.isArray(response) ? response : response?.data || [];
    // reset page if needed
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    reviews.value = [];
  } finally {
    loading.value = false;
  }
};

// public open/close for parent via ref
const openModal = async (kpiParam) => {
  // accept either prop kpi or parameter
  const kpiObj = kpiParam || props.kpi;
  if (!kpiObj || !kpiObj.id) {
    console.warn("openModal requires a KPI object with id");
    return;
  }
  // set kpi (we mutate local prop variable for template)
  // note: props are read-only — we'll keep a local ref if needed
  // but template references props.kpi, so to keep things simple we'll rely on passed param
  // set internal kpiRef for template usage
  internalKpi.value = kpiObj;

  showModal.value = true;
  currentPage.value = 1;
  await loadReviews(kpiObj.id);
};

const closeModal = () => {
  showModal.value = false;
  // emit close to parent if parent listens
  emit("close");
};

// view details
const viewReviewDetails = (review) => {
  selectedReview.value = review;
  showReviewDetails.value = true;
};

// formula & result helpers (kept from original)
const buildDisplayFormula = (formulaParts) => {
  if (!formulaParts || !Array.isArray(formulaParts)) return "";
  let display = "";
  formulaParts.forEach((part) => {
    if (part.type === "variable") {
      let varId =
        typeof part.variable === "object" && part.variable !== null
          ? part.variable.id || part.variable._id
          : part.variable;

      const varName = getVariableNameByIdSync(varId) || part.value || varId;
      let func = "";
      if (typeof part.variable === "object" && part.variable.function) {
        func = ` (${part.variable.function})`;
      }
      display += varName + func;
    } else if (part.type === "operator") {
      display += ` ${part.value} `;
    } else if (part.type === "number") {
      display += part.value;
    }
  });
  return display;
};

const getVariableNameByIdSync = (id) => {
  // placeholder (kept as original)
  return "";
};



// local internal kpi ref for template (so template shows KPI name & unit)
const internalKpi = ref(props.kpi || null);

// if parent passes kpi prop and toggles it, react to changes
watch(
  () => props.kpi,
  (val) => {
    if (val) internalKpi.value = val;
  }
);

// expose methods to parent via ref
defineExpose({
  openModal,
  closeModal,
});

// initial load
onMounted(() => {
  loadUsers();
});
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
.modal-title {
  font-weight: 700;
  color: #000;
}
.table th {
  font-size: 12px;
  color: #404040;
  font-weight: 500;
}

.table td {
  vertical-align: middle;
  font-size: 12px;
  color: #404040;
  font-weight: 500;
}

.page-link {
  border-radius: 50% !important;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #919191;
  font-weight: 600;
  border: 0;
}
.page-link.prev-next-btn {
  background: #43235c;
  height: 25px;
  color: #fff;
  width: 36px;
  border-radius: 6px;
}
.page-link:focus {
  box-shadow: unset !important;
}

.page-item.active .page-link {
  background-color: transparent;
  border-color: transparent;
  color: #43235c;
}

.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-content {
  border-radius: 0.75rem;
  background: #f5f5f5;
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

/* review detail styles */
.review-details-card {
  border-radius: 12px;
  overflow: hidden;
}

.info-item {
  margin-bottom: 16px;
}

.info-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 4px;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #000;
  font-weight: 500;
}

.status-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0px 8px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 10px;
}

.status-approved {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.status-rejected {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.status-pending {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
}

.status-default {
  background: rgba(156, 163, 175, 0.08);
  color: #9ca3af;
}

.comment-content {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 4px;
  border: 1px solid #eee;
}

.formula-container {
  background: #fff;
  padding: 12px;
  border-radius: 10px;
}

.formula-display {
  font-size: 12px;
  font-weight: 500;
  color: #404040;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 10px;
}

.variables-table {
  border-radius: 10px;
}
.variables-table td {
  vertical-align: middle;
  border-top: 0;
  border-radius: 10px;
}

.value-chip {
  font-weight: 600;
}

.result-label {
  font-size: 0.875rem;
  color: #8c8c8c;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-value {
  font-size: 20pxrem;
  font-weight: 700;
  color: #6e3894;
}
.formula-label {
  font-weigth: 500;
  font-size: 12px;
  color: #8c8c8c;
}
/* responsive tweaks */
@media (max-width: 960px) {
  .review-details-card {
    margin: 16px;
  }

  .formula-display {
    font-size: 13px;
  }

  .result-value {
    font-size: 1.125rem;
  }
}
</style>
