<template>
  <!-- Main Page component -->
  <main-page
    ref="page"
    :isFlipped="false"
    :mainPage="$t('formulavariable.formulavariable')"
    :subPage="$t('formulavariable.formulavariable')"
    :titlePage="$t('formulavariable.formulavariable')"
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
        :hideActions="hideActions"
      >
        <template #Name="{ item }">{{ item.name }}</template>
        <template #formulavariable.description="{ item }">
          <p v-html="item.description"></p>
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
          {{ isEditMode ? "Edit Formula Variable" : "New Formula Variable" }}
        </h2>
        <button class="figma-close-button" @click="closedialog">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="figma-dialog-content">
        <v-form ref="form" class="row" lazy-validation>
          <!-- Name Field -->
          <div class="figma-form-field col-6">
            <label class="figma-form-label rtl">
              Name<span class="figma-asterisk">*</span>
            </label>
            <input
              v-model="newItem.name"
              type="text"
              class="figma-input"
              :class="{ 'figma-input-error': nameError }"
              placeholder=""
              @blur="validateName"
              @input="nameError = ''"
            />
            <span v-if="nameError" class="figma-error-text">{{ nameError }}</span>
          </div>

          <!-- Type Field -->
          <div class="figma-form-field  col-6">
            <label class="figma-form-label rtl">
              Type<span class="figma-asterisk">*</span>
            </label>
            <div class="figma-select-container" @click="toggleTypeDropdown">
              <div class="figma-select-content">
                <span v-if="newItem.type" class="figma-selected-text">
                  {{ getTypeName(newItem.type) }}
                </span>
                <span v-else class="figma-select-placeholder">Select Type</span>
              </div>
              <svg class="figma-dropdown-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            
            <div v-if="typeDropdownOpen" class="figma-dropdown-menu">
              <div
                v-for="type in typeOptions"
                :key="type.id"
                class="figma-dropdown-item"
                @click="selectType(type.id)"
              >
                <span class="figma-dropdown-text">{{ type.name }}</span>
              </div>
            </div>
            <span v-if="typeError" class="figma-error-text">{{ typeError }}</span>
          </div>

          <!-- Module Field (for automatic type) -->
          <div v-if="newItem.type === 'automatic'" class="figma-form-field  col-6">
            <label class="figma-form-label rtl">
              Module<span class="figma-asterisk">*</span>
            </label>
            <div class="figma-select-container" @click="toggleModuleDropdown">
              <div class="figma-select-content">
                <span v-if="selectedModule" class="figma-selected-text">
                  {{ selectedModule.name }}
                </span>
                <span v-else class="figma-select-placeholder">Select Module</span>
              </div>
              <svg class="figma-dropdown-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            
            <div v-if="moduleDropdownOpen" class="figma-dropdown-menu">
              <div
                v-for="module in moduleOptions"
                :key="module.id"
                class="figma-dropdown-item"
                @click="selectModule(module)"
              >
                <span class="figma-dropdown-text">{{ module.name }}</span>
              </div>
            </div>
            <span v-if="moduleError" class="figma-error-text">{{ moduleError }}</span>
          </div>

          <!-- Fillable Field (for automatic type with module) -->
          <div v-if="newItem.type === 'automatic' && selectedModule" class="figma-form-field  col-6">
            <label class="figma-form-label rtl">
              Fillable<span class="figma-asterisk">*</span>
            </label>
            <div class="figma-select-container" @click="toggleFillableDropdown">
              <div class="figma-select-content">
                <span v-if="newItem.fillable" class="figma-selected-text">
                  {{ newItem.fillable }}
                </span>
                <span v-else class="figma-select-placeholder">Select Fillable</span>
              </div>
              <svg class="figma-dropdown-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            
            <div v-if="fillableDropdownOpen" class="figma-dropdown-menu">
              <div
                v-for="fillable in fillableOptions"
                :key="fillable.name"
                class="figma-dropdown-item"
                @click="selectFillable(fillable.name)"
              >
                <span class="figma-dropdown-text">{{ fillable.name }}</span>
              </div>
            </div>
            <span v-if="fillableError" class="figma-error-text">{{ fillableError }}</span>
          </div>

          <!-- Function Field (for automatic type with fillable) -->
          <div v-if="newItem.type === 'automatic' && newItem.fillable" class="figma-form-field  col-6">
            <label class="figma-form-label rtl">
              Function<span class="figma-asterisk">*</span>
            </label>
            <div class="figma-select-container" @click="toggleFunctionDropdown">
              <div class="figma-select-content">
                <span v-if="newItem.function" class="figma-selected-text">
                  {{ newItem.function }}
                </span>
                <span v-else class="figma-select-placeholder">Select Function</span>
              </div>
              <svg class="figma-dropdown-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            
            <div v-if="functionDropdownOpen" class="figma-dropdown-menu">
              <div
                v-for="func in functionOptions"
                :key="func.id"
                class="figma-dropdown-item"
                @click="selectFunction(func.id)"
              >
                <span class="figma-dropdown-text">{{ func.name }}</span>
              </div>
            </div>
            <span v-if="functionError" class="figma-error-text">{{ functionError }}</span>
          </div>

          <!-- Description Field -->
          <div class="figma-form-field  col-12">
            <label class="figma-form-label rtl">Description</label>
            <textarea
              v-model="newItem.description"
              class="figma-textarea"
              rows="4"
              placeholder=""
            ></textarea>
          </div>
        </v-form>
      </div>

      <!-- Footer -->
      <div class="figma-dialog-footer">
        <button class="figma-button figma-button-cancel" @click="closedialog">
          Cancel
        </button>
        <button 
          class="figma-button figma-button-save" 
          @click="handleSubmit" 
          :disabled="isSaving"
        >
          <span v-if="isSaving" class="figma-spinner"></span>
          <span v-else>Save</span>
        </button>
      </div>
    </div>
  </v-dialog>

  <!-- Overlay for dropdowns -->
  <div 
    v-if="typeDropdownOpen || moduleDropdownOpen || fillableDropdownOpen || functionDropdownOpen" 
    class="figma-dropdown-overlay" 
    @click="closeAllDropdowns"
  ></div>
</template>

<script>
import formulavariable from "@/modules/kpi/API/FormulaVariable/FormulaVariable";
import MainPage from "@/components/MainPage.vue";
import DataTable from "@/components/DataTable.vue";
import kpi from "@/modules/kpi/API/Kpi/Kpi";

export default {
  components: {
    MainPage,
    DataTable,
  },

  setup() {
    const api = new formulavariable();
    const apiParams = { filter: "" };
    const tableColumns = [];
    const kpiApi = new kpi();

    return {
      api,
      apiParams,
      tableColumns,
      kpiApi,
    };
  },

  async mounted() {
    try {
      this.isLoadingModules = true;
      this.moduleOptions = await this.fetchModuleOptions();
      if (this.moduleOptions.length === 0) {
        this.moduleOptions = [];
        this.moduleError = "Using default modules";
      }

      this.kpiData = await this.kpiApi.getAll({
        select: "id|formulaVariables",
      });
    } catch (error) {
      console.error("Failed to load modules:", error);
      this.moduleError = "Failed to load modules";
      this.moduleOptions = [];
    } finally {
      this.isLoadingModules = false;
    }
  },

  data() {
    return {
      showDialog: false,
      isEditMode: false,
      isSaving: false,
      typeDropdownOpen: false,
      moduleDropdownOpen: false,
      fillableDropdownOpen: false,
      functionDropdownOpen: false,
      newItem: {
        name: "",
        type: "",
        module: "",
        fillable: "",
        function: "",
        description: "",
        module_path_type: "",
      },
      moduleOptions: [],
      selectedModule: null,
      typeOptions: [
        { id: "automatic", name: "Automatic" },
        { id: "manual", name: "Manual" },
      ],
      fillableOptions: [],
      selectedFillableType: null,
      allFunctionOptions: [
        { id: "COUNT", name: "COUNT" },
        { id: "SUM", name: "SUM" },
        { id: "AVG", name: "AVG" },
        { id: "MIN", name: "MIN" },
        { id: "MAX", name: "MAX" },
      ],
      isLoadingModules: false,
      moduleError: null,
      kpiData: [],
      nameError: "",
      typeError: "",
      moduleError: "",
      fillableError: "",
      functionError: "",
    };
  },

  computed: {
    hideActions() {
      return (row) => {
        return {
          edit: !row.can_edit,
          delete: !row.can_delete,
          allActions: !row.can_edit && !row.can_delete
        };
      };
    },

    functionOptions() {
      if (!this.selectedFillableType) return [];

      if (this.selectedFillableType === "string") {
        return this.allFunctionOptions.filter((f) => f.id === "COUNT");
      } else {
        return this.allFunctionOptions;
      }
    },
  },

  watch: {
    "newItem.fillable": function (newFillable) {
      if (newFillable) {
        const selected = this.fillableOptions.find((f) => f.name === newFillable);
        if (selected) {
          this.selectedFillableType = selected.type;
        }
      } else {
        this.selectedFillableType = null;
      }
    },

    "newItem.type": function (newType) {
      if (newType !== "automatic") {
        this.newItem.module = "";
        this.newItem.fillable = "";
        this.newItem.function = "";
        this.selectedModule = null;
        this.selectedFillableType = null;
      }
    },
  },

  created() {
    this.tableColumns = [
      {
        id: "formulavariable.name",
        title: this.$t("formulavariable.name"),
        data: "name",
        defaultContent: "N/A",
      },
      {
        id: "formulavariable.description",
        title: this.$t("formulavariable.description"),
        data: "description",
        defaultContent: "N/A",
      },
      {
        id: "formulavariable.type",
        title: this.$t("formulavariable.type"),
        data: "type",
        defaultContent: "N/A",
        render: (data) => {
          return data === "automatic" ? "Automatic" : "Manual";
        },
      },
      {
        id: "formulavariable.module",
        title: this.$t("formulavariable.module"),
        data: "module",
        defaultContent: "N/A",
        render: (data) => {
          if (!data) return "N/A";
          const module = this.moduleOptions.find((m) => m.id === data);
          return module ? module.name : data;
        },
      },
      {
        id: "formulavariable.fillable",
        title: this.$t("formulavariable.fillable"),
        data: "fillable",
        defaultContent: "N/A",
      },
      {
        id: "formulavariable.function",
        title: this.$t("formulavariable.function"),
        data: "function",
        defaultContent: "N/A",
      },
    ];
  },

  methods: {
    getTypeName(typeId) {
      const type = this.typeOptions.find(t => t.id === typeId);
      return type ? type.name : '';
    },

    toggleTypeDropdown() {
      this.typeDropdownOpen = !this.typeDropdownOpen;
      this.moduleDropdownOpen = false;
      this.fillableDropdownOpen = false;
      this.functionDropdownOpen = false;
    },

    toggleModuleDropdown() {
      this.moduleDropdownOpen = !this.moduleDropdownOpen;
      this.typeDropdownOpen = false;
      this.fillableDropdownOpen = false;
      this.functionDropdownOpen = false;
    },

    toggleFillableDropdown() {
      this.fillableDropdownOpen = !this.fillableDropdownOpen;
      this.typeDropdownOpen = false;
      this.moduleDropdownOpen = false;
      this.functionDropdownOpen = false;
    },

    toggleFunctionDropdown() {
      this.functionDropdownOpen = !this.functionDropdownOpen;
      this.typeDropdownOpen = false;
      this.moduleDropdownOpen = false;
      this.fillableDropdownOpen = false;
    },

    closeAllDropdowns() {
      this.typeDropdownOpen = false;
      this.moduleDropdownOpen = false;
      this.fillableDropdownOpen = false;
      this.functionDropdownOpen = false;
    },

    selectType(typeId) {
      this.newItem.type = typeId;
      this.typeError = "";
      this.closeAllDropdowns();
    },

    selectModule(module) {
      this.selectedModule = module;
      this.newItem.module = module.id;
      this.newItem.module_path_type =
        String(module.pathType).trim().toUpperCase() === "BASEPATH"
          ? "NDMO"
          : module.pathType;
      this.fetchFillableOptions(module.id, module.pathType);
      this.moduleError = "";
      this.closeAllDropdowns();
    },

    selectFillable(fillableName) {
      this.newItem.fillable = fillableName;
      this.fillableError = "";
      this.closeAllDropdowns();
    },

    selectFunction(functionId) {
      this.newItem.function = functionId;
      this.functionError = "";
      this.closeAllDropdowns();
    },

    validateName() {
      if (!this.newItem.name || this.newItem.name.trim() === '') {
        this.nameError = 'Name is required';
        return false;
      }
      this.nameError = '';
      return true;
    },

    validateType() {
      if (!this.newItem.type) {
        this.typeError = 'Type is required';
        return false;
      }
      this.typeError = '';
      return true;
    },

    validateModule() {
      if (this.newItem.type === 'automatic' && !this.selectedModule) {
        this.moduleError = 'Module is required';
        return false;
      }
      this.moduleError = '';
      return true;
    },

    validateFillable() {
      if (this.newItem.type === 'automatic' && this.selectedModule && !this.newItem.fillable) {
        this.fillableError = 'Fillable is required';
        return false;
      }
      this.fillableError = '';
      return true;
    },

    validateFunction() {
      if (this.newItem.type === 'automatic' && this.newItem.fillable && !this.newItem.function) {
        this.functionError = 'Function is required';
        return false;
      }
      this.functionError = '';
      return true;
    },

    async fetchFillableOptions(moduleName, pathType) {
      if (!moduleName) return;

      try {
        const response = await this.api.getFillable(moduleName, pathType);
        this.fillableOptions = response.data;
      } catch (error) {
        console.error("Failed to fetch fillable options:", error);
        this.fillableOptions = [];
      }
    },

    async fetchModuleOptions() {
      try {
        const files = require.context("@/API/", true, /\.ts$/i).keys();
        const moduleMap = new Map();

        files.forEach((filePath) => {
          const parts = filePath.replace(/^\.\//, "").split("/");
          if (parts.length > 1) {
            const moduleName = parts[0];
            if (moduleName && moduleName !== "components") {
              const fileContent = require(`@/API/${filePath.replace(/^\.\//, "")}`);
              const defaultExport = fileContent.default;

              let pathType = "BASEPATH";

              if (defaultExport && defaultExport.toString().includes("USERSERVICE")) {
                pathType = "USERSERVICE";
              } else if (defaultExport && defaultExport.toString().includes("DASESCHEMANODE")) {
                pathType = "DASESCHEMANODE";
              } else if (defaultExport && defaultExport.toString().includes("GRCSERVICE")) {
                pathType = "GRCSERVICE";
              } else if (defaultExport && defaultExport.toString().includes("ITSMSERVICE")) {
                pathType = "ITSMSERVICE";
              } else if (defaultExport && defaultExport.toString().includes("LogAndNotification")) {
                pathType = "LogAndNotification";
              } else if (defaultExport && defaultExport.toString().includes("kPISERVICE")) {
                pathType = "kPISERVICE";
              }

              moduleMap.set(moduleName, {
                id: moduleName,
                name: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
                pathType: pathType,
              });
            }
          }
        });

        return Array.from(moduleMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      } catch (error) {
        console.error("Module extraction failed:", error);
        throw error;
      }
    },

    openForm() {
      this.isEditMode = false;
      this.resetForm();
      this.showDialog = true;
    },

    async closeForm() {
      this.showDialog = false;
      this.closeAllDropdowns();
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.resetForm();
      this.$refs.table.refreshTable();
    },

    async closedialog() {
      this.showDialog = false;
      this.closeAllDropdowns();
    },

    resetForm() {
      this.newItem = {
        name: "",
        type: "",
        module: "",
        fillable: "",
        function: "",
        description: "",
        module_path_type: "",
      };
      this.selectedModule = null;
      this.selectedFillableType = null;
      this.fillableOptions = [];
      this.nameError = "";
      this.typeError = "";
      this.moduleError = "";
      this.fillableError = "";
      this.functionError = "";
    },

    editItem(data) {
      this.isEditMode = true;
      this.newItem = { ...data };

      if (data.module) {
        this.selectedModule = this.moduleOptions.find((m) => m.id === data.module);
      }

      this.showDialog = true;
    },

    async handleSubmit() {
      const nameValid = this.validateName();
      const typeValid = this.validateType();
      const moduleValid = this.validateModule();
      const fillableValid = this.validateFillable();
      const functionValid = this.validateFunction();

      if (!nameValid || !typeValid || !moduleValid || !fillableValid || !functionValid) {
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
/* Import all styles from KPI Types dialog */
.figma-dialog-wrapper {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}

.figma-dialog {
  width: 500px;
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

.figma-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
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
  color: #6B7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.figma-close-button:hover {
  color: #111827;
}

.figma-dialog-content {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
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
  color: #DC2626;
  margin-left: 0;
}

.figma-input,
.figma-textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: #111827;
  background: #FFFFFF;
  border: 1px solid #D1D5DB;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.figma-input:hover,
.figma-textarea:hover {
  border-color: #9CA3AF;
}

.figma-input:focus,
.figma-textarea:focus {
  border-color: #6E3894;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.figma-input-error {
  border-color: #DC2626 !important;
}

.figma-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.figma-error-text {
  display: block;
  font-size: 12px;
  color: #DC2626;
  margin-top: 4px;
}

.figma-select-container {
  width: 100%;
  min-height: 42px;
  padding: 6px 36px 6px 12px;
  background: #FFFFFF;
  border: 1px solid #D1D5DB;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.figma-select-container:hover {
  border-color: #9CA3AF;
}

.figma-select-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.figma-select-placeholder {
  color: #9CA3AF;
  font-size: 14px;
}

.figma-selected-text {
  color: #111827;
  font-size: 14px;
}

.figma-dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6B7280;
  pointer-events: none;
}

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
  background: #FFFFFF;
  border: 1px solid #D1D5DB;
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
  background: #F3F4F6;
}

.figma-dropdown-text {
  font-size: 14px;
  color: #111827;
}

.figma-dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #E5E7EB;
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
  background: #FFFFFF;
  color: #374151;
  border: 1px solid #6E3894;
}

.figma-button-cancel:hover {
  background: #F9FAFB;
  border-color: #6E3894;
}

.figma-button-save {
  background: #6E3894;
  color: #FFFFFF;
}

.figma-button-save:hover:not(:disabled) {
  background: #6D28D9;
}

.figma-button-save:disabled {
  background: #D1D5DB;
  cursor: not-allowed;
}

.figma-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.figma-dialog-content::-webkit-scrollbar,
.figma-dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.figma-dialog-content::-webkit-scrollbar-track,
.figma-dropdown-menu::-webkit-scrollbar-track {
  background: #F3F4F6;
}

.figma-dialog-content::-webkit-scrollbar-thumb,
.figma-dropdown-menu::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 3px;
}

.figma-dialog-content::-webkit-scrollbar-thumb:hover,
.figma-dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}

@media (max-width: 540px) {
  .figma-dialog {
    width: calc(100vw - 32px);
    max-width: 500px;
  }
}
.modal-header {
    justify-content: space-between;
}
[dir="rtl"] .modal-header ,[dir="rtl"] .dropdown-item {
    flex-direction: row-reverse;
}
[dir="rtl"] .modal-body .row{
text-align: end;
}
[dir="rtl"] button,[dir="rtl"] input,[dir="rtl"] optgroup,
[dir="rtl"] select,[dir="rtl"] textarea,[dir="rtl"] .figma-error-text {
    text-align: end;
}
.modal-header {
    justify-content: space-between;
}
[dir="rtl"] .modal-header ,[dir="rtl"] .dropdown-item {
  display: flex;
    flex-direction: row-reverse;
}
[dir="rtl"] .modal-body .row{
text-align: end;
}
</style>