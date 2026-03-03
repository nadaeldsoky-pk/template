<template>
  <!-- Main Page component -->
  <main-page
    ref="page"
    :isFlipped="false"
    :mainPage="$t('kpitype.kpitype')"
    :subPage="$t('kpitype.kpitype')"
    :titlePage="$t('kpitype.kpitype')"
    v-permission:show
  >
    <div v-permission:update v-permission:delete></div>

    <!-- Slot for rendering the DataTable -->
    <template #datatable>
      <DataTable
        ref="table"
        id="example-table"
        :tableClass="'table table-striped table-bordered'"
        :columns="tableColumns"
        :api="api"
        :apiParams="apiParams"
        :editItem="editItem"
        :openForm="openForm"
      >
        <template #kpitype.reviewers="{ item }">
          <AvatarGroup
            :users="getReviewersForAvatar(item?.reviewer_ids)"
            :maxVisible="3"
            :spacing="20"
            :clickable="false"
            emptyText="N/A"
          />
        </template>

        <template #kpitype.description="{ item }">
          <div v-html="item.description"></div>
        </template>
      </DataTable>
    </template>
  </main-page>

  <v-dialog
    v-model="showDialog"
    max-width="500px"
    persistent
    content-class="figma-dialog-wrapper"
  >
    <div class="figma-dialog">
      <!-- Header -->
      <div class="figma-dialog-header rtl">
        <h2 class="figma-dialog-title">
          {{ isEditMode ? $t("kpitype.edit_kpi_type") : $t("kpitype.new_kpi_type") }}
        </h2>
        <button class="figma-close-button" @click="closedialog">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="figma-dialog-content">
        <v-form ref="form" lazy-validation>
          <!-- Name Field -->
          <div class="figma-form-field">
            <label class="figma-form-label rtl">
              {{ $t("kpitype.name") }}<span class="figma-asterisk">*</span>
            </label>
            <input
              v-model="newItem.name"
              type="text"
              class="figma-input"
              :class="{ 'figma-input-error': nameError }"
              :placeholder="$t('kpitype.name_placeholder')"
              @blur="validateName"
              @input="nameError = ''"
            />
            <span v-if="nameError" class="figma-error-text">{{ nameError }}</span>
          </div>

          <!-- Reviewers Field -->
          <div class="figma-form-field">
            <label class="figma-form-label rtl">
              {{ $t("kpitype.reviewers") }}<span class="figma-asterisk">*</span>
            </label>

            <!-- استخدم UserSelect component -->
            <UserSelect
              v-model="newItem.reviewer_ids"
              :multiple="true"
              :placeholder="$t('kpitype.select_reviewers')"
              class="user-select-reviewers"
              @update:modelValue="handleReviewersChange"
            />

            <span v-if="usersError" class="figma-error-text">{{ usersError }}</span>
          </div>

          <!-- Description Field -->
          <div class="figma-form-field">
            <label class="figma-form-label rtl">
              {{ $t("kpitype.description") }}<span class="figma-asterisk">*</span>
            </label>
            <textarea
              v-model="newItem.description"
              class="figma-textarea"
              :class="{ 'figma-input-error': descriptionError }"
              rows="4"
              :placeholder="$t('kpitype.description_placeholder')"
              @blur="validateDescription"
              @input="descriptionError = ''"
            ></textarea>
            <span v-if="descriptionError" class="figma-error-text">{{
              descriptionError
            }}</span>
          </div>
        </v-form>
      </div>

      <!-- Footer -->
      <div class="figma-dialog-footer">
        <button class="figma-button figma-button-cancel" @click="closedialog">
          {{ $t("common.cancel") }}
        </button>
        <button
          class="figma-button figma-button-save"
          @click="handleSubmit"
          :disabled="isSaving"
        >
          <span v-if="isSaving" class="figma-spinner"></span>
          <span v-else>{{ $t("common.save") }}</span>
        </button>
      </div>
    </div>
  </v-dialog>

  <!-- Overlay for dropdown -->
  <div
    v-if="dropdownOpen"
    class="figma-dropdown-overlay"
    @click="dropdownOpen = false"
  ></div>
</template>

<script>
import kpitype from "@/modules/kpi/API/KPIType/KPIType";
import MainPage from "@/components/MainPage.vue";
import DataTable from "@/components/DataTable.vue";
import AvatarGroup from "@/components/AvatarGroup.vue";
import user from "@/API/User/User";
import UserSelect from "@/components/UserSelect.vue";
export default {
  components: {
    MainPage,
    DataTable,
    AvatarGroup,
    UserSelect,
  },

  setup() {
    const api = new kpitype();
    const apiParams = {};
    const tableColumns = [];
    const userApi = new user();

    return {
      api,
      apiParams,
      tableColumns,
      userApi,
    };
  },

  async mounted() {
    try {
      this.reviewers = await this.userApi.getAll({ select: "id|full_name" });
    } catch (error) {
      console.error("Failed to load reviewers:", error);
      this.reviewers = [];
    }
  },

  data() {
    return {
      showDialog: false,
      isEditMode: false,
      isSaving: false,
      dropdownOpen: false,
      newItem: {
        name: "",
        reviewer_ids: [],
        description: "",
      },
      reviewers: [],
      nameError: "",
      usersError: "",
      descriptionError: "",
    };
  },

  created() {
    this.tableColumns = [
      {
        id: "kpitype.name",
        title: this.$t("kpitype.name"),
        data: "name",
        defaultContent: "N/A",
      },
      {
        id: "kpitype.reviewers",
        title: this.$t("kpitype.reviewers"),
        data: "_USERSERVICE._User.reviewer_ids.full_name",
        defaultContent: "N/A",
      },
      {
        id: "kpitype.description",
        title: this.$t("kpitype.description"),
        data: "description",
        defaultContent: "N/A",
      },
    ];
  },

  methods: {
    getInitials(name) {
      if (!name) return "U";
      const words = name.trim().split(" ");
      if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
      }
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    },

    handleReviewersChange(value) {
      this.newItem.reviewer_ids = value;
      this.usersError = ""; // مسح الخطأ عند التحديد
    },
    getReviewerName(userId) {
      const reviewer = this.reviewers.find((r) => r.id === userId);
      return reviewer ? reviewer.full_name : "Unknown";
    },

    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },

    toggleReviewer(userId) {
      const index = this.newItem.reviewer_ids.indexOf(userId);
      if (index > -1) {
        this.newItem.reviewer_ids.splice(index, 1);
      } else {
        this.newItem.reviewer_ids.push(userId);
      }
      this.usersError = "";
    },

    removeReviewer(index) {
      this.newItem.reviewer_ids.splice(index, 1);
    },

    validateName() {
      if (!this.newItem.name || this.newItem.name.trim() === "") {
        this.nameError = "Name is required";
        return false;
      }
      this.nameError = "";
      return true;
    },

    validateUsers() {
      if (!this.newItem.reviewer_ids || this.newItem.reviewer_ids.length === 0) {
        this.usersError = "At least one user is required";
        return false;
      }
      this.usersError = "";
      return true;
    },

    validateDescription() {
      if (!this.newItem.description || this.newItem.description.trim() === "") {
        this.descriptionError = "Description is required";
        return false;
      }
      this.descriptionError = "";
      return true;
    },

    openForm() {
      this.isEditMode = false;
      this.resetForm();
      this.showDialog = true;
    },

    async closeForm() {
      this.showDialog = false;
      this.dropdownOpen = false;
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.resetForm();
      this.$refs.table.refreshTable();
    },

    async closedialog() {
      this.showDialog = false;
      this.dropdownOpen = false;
    },

    resetForm() {
      this.newItem = {
        name: "",
        reviewer_ids: [],
        description: "",
      };
      this.nameError = "";
      this.usersError = "";
      this.descriptionError = "";
    },

    editItem(data) {
      this.isEditMode = true;
      this.newItem = { ...data };
      this.showDialog = true;
    },

    getReviewersForAvatar(reviewerIds) {
      if (!reviewerIds || !Array.isArray(reviewerIds)) return [];

      return reviewerIds
        .map((userId) => {
          const reviewer = this.reviewers.find((u) => u.id === userId);
          return {
            id: userId,
            full_name: reviewer ? reviewer.full_name : this.$t("kpitype.Unknown"),
            name: reviewer ? reviewer.full_name : this.$t("kpitype.Unknown"),
          };
        })
        .filter((reviewer) => reviewer.full_name !== this.$t("kpitype.Unknown"));
    },

    async handleSubmit() {
      // Validate all fields
      const nameValid = this.validateName();
      const usersValid = this.validateUsers();
      const descriptionValid = this.validateDescription();

      if (!nameValid || !usersValid || !descriptionValid) {
        return;
      }

      this.isSaving = true;

      try {
        let response;
        if (this.isEditMode) {
          response = await this.api.update(this.newItem);
        } else {
          response = await this.api.insert(this.newItem);
        }

        if (response.status == "success") {
          this.api.poup(response, response.message);
          this.closeForm();
        } else {
          this.api.poup({ status: false, message: response.message }, "Error");
        }
      } catch (error) {
        console.error("Failed to save:", error);
        this.api.poup(
          { status: false, message: "An error occurred while saving data." },
          "Error"
        );
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>

<style scoped>
/* ============================================ */
/* FIGMA EXACT - DIALOG WRAPPER */
/* ============================================ */
.figma-dialog-wrapper {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.figma-dialog {
  width: 500px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

/* ============================================ */
/* HEADER - Exact Figma Match */
/* ============================================ */
.figma-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.figma-dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

.figma-close-button {
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.figma-close-button:hover {
  color: #111827;
}

/* ============================================ */
/* CONTENT - Exact Spacing */
/* ============================================ */
.figma-dialog-content {
  padding: 16px;
}

.figma-form-field {
  margin-bottom: 16px;
  position: relative;
}

.figma-form-field:last-child {
  margin-bottom: 0;
}

.figma-form-label {
  display: flex;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 4px;
  line-height: 1.5;
}

.figma-asterisk {
  color: #dc2626;
  margin-left: 0;
}

/* ============================================ */
/* INPUT FIELDS - Figma Exact */
/* ============================================ */
.figma-input,
.figma-textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: #111827;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.figma-input:hover,
.figma-textarea:hover {
  border-color: #9ca3af;
}

.figma-input:focus,
.figma-textarea:focus {
  border-color: #6e3894;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.figma-input-error {
  border-color: #dc2626 !important;
}

.figma-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.figma-error-text {
  display: block;
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;
}

/* ============================================ */
/* SELECT CONTAINER - Custom Dropdown */
/* ============================================ */
.figma-select-container {
  width: 100%;
  min-height: 42px;
  padding: 6px 36px 6px 12px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.figma-select-container:hover {
  border-color: #9ca3af;
}

.figma-select-content {
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.figma-select-placeholder {
  color: #9ca3af;
  font-size: 14px;
}

.figma-dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  pointer-events: none;
}

/* ============================================ */
/* CHIPS - Yellow Avatar Style */
/* ============================================ */
.figma-chips-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.figma-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 4px 8px 4px 4px;
  height: 28px;
}

.figma-chip-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ebdcb3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: #c4951b;
  flex-shrink: 0;
}

.figma-chip-text {
  font-size: 12px;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
}

.figma-chip-close {
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.figma-chip-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #111827;
}

/* ============================================ */
/* DROPDOWN MENU */
/* ============================================ */
.figma-dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.figma-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1001;
}

.figma-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.figma-dropdown-item:hover {
  background: #f3f4f6;
}

.figma-checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid #d1d5db;
  border-radius: 3px;
  cursor: pointer;
  flex-shrink: 0;
}

.figma-checkbox:checked {
  background: #6e3894;
  border-color: #6e3894;
}

.figma-dropdown-text {
  font-size: 14px;
  color: #111827;
}

/* ============================================ */
/* FOOTER - Exact Button Layout */
/* ============================================ */
.figma-dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
}

.figma-button {
  width: 74px;
  height: 30px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.figma-button-cancel {
  background: #ffffff;
  color: #374151;
  border: 1px solid #6e3894;
}

.figma-button-cancel:hover {
  background: #f9fafb;
  border-color: #6e3894;
}

.figma-button-save {
  background: #6e3894;
  color: #ffffff;
}

.figma-button-save:hover:not(:disabled) {
  background: #6d28d9;
}

.figma-button-save:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* ============================================ */
/* LOADING SPINNER */
/* ============================================ */
.figma-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ============================================ */
/* SCROLLBAR */
/* ============================================ */
.figma-dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.figma-dropdown-menu::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.figma-dropdown-menu::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.figma-dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */
@media (max-width: 540px) {
  .figma-dialog {
    width: calc(100vw - 32px);
    max-width: 500px;
  }
}
.modal-header {
  justify-content: space-between;
}
[dir="rtl"] .modal-header,
[dir="rtl"] .dropdown-item {
  flex-direction: row-reverse;
}
[dir="rtl"] .modal-body .row {
  text-align: end;
}
</style>
