<template>
  <!-- Main Page component where the layout and page structure are set -->
  <main-page
    ref="page"
    :isFlipped="isFlipped"
    :mainPage="$t('kpiunit.kpiunit')"
    :subPage="$t('kpiunit.kpiunit')"
    :titlePage="$t('kpiunit.kpiunit')"
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
        v-permission:show
      >
        <!-- Customizing the display of the 'Name' column in the table -->
        <template #Name="{ item }"> {{ item.name }} </template>
        <template #kpiunit.description="{ item }">
          <div 
            @click="showDescriptionModal(item.description)" 
            style="cursor: pointer; color: #7c3aed;"
            v-html="truncateDescription(item.description)"
          ></div>
        </template>
      </DataTable>
    </template>

    <!-- Slot for rendering the form -->
    <template #form>
      <Form
        :schema="fromFields"   
        :newItem="newItem"   
        :api="api"   
        :closeForm="closeForm"   
        :formData="true"   
      ></Form>
    </template>

    <!-- Description Modal -->
    <div 
      v-if="showModal" 
      class="modal-overlay" 
      @click="closeModal"
    >
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body" v-html="modalContent"></div>
      </div>
    </div>
  </main-page>
</template>

<script>
// Importing necessary components and API modules
import kpiunit from "@/modules/kpi/API/KPIUnit/KPIUnit";
import Form from "@/components/Form.vue";
import MainPage from "@/components/MainPage.vue";
import DataTable from "@/components/DataTable.vue";

export default {
  components: {
    MainPage,  // Main page layout component
    Form,      // Form component for adding/editing items
    DataTable, // DataTable component for displaying tabular data
  },

  setup() {
    // Initialize API and other required properties
    const api = new kpiunit();
    const apiParams = {};
    const tableColumns = [];  // Initialize table column definitions
    const fromFields = [];    // Initialize form fields

    // Return properties for setup to be used in the template
    return {
      api,
      apiParams,
      tableColumns,
      fromFields
    };
  },
 
  async mounted() {
     
      // Fetch roles
      //this.roles = await this.roleApi.getAll({ select: "id|name" });

      // Update options dynamically in the form field
      //const myOptionsField = this.fromFields.find((field) => field.name === "myOptions");
        //myOptionsField.options = this.roles.map((role) => ({
          //id: role.id,
          //name: role.name,
        //}));
      
  },
  data() {
    return {
      isFlipped: false, // To control form flip (show/hide form)
      isReadonly: false, // Whether the form fields are read-only
      newItem: {}, // Data object to store the currently selected item for editing or new item
      showModal: false, // Control modal visibility
      modalContent: '', // Content to display in modal
      modalTitle: 'Description', // Modal title
    };
  },

  created() {
    // Initialize the table columns and form fields when the component is created
    this.tableColumns = [
      { id: "kpiunit.name", title: this.$t("kpiunit.name"), data: "name", defaultContent: "N/A" },
      { id: "kpiunit.description", title:  this.$t("kpiunit.description"), data: "description", defaultContent: "N/A" },
    ];

    // Define the form fields schema with validation rules, types, and descriptions
    this.fromFields = [
      {
        name: "name",
        label: this.$t("kpiunit.Name"),
        type: "text", // Text input field
        rules: "required", // Validation rule: required field
        description: this.$t("kpiunit.Please enter name"), // Description for the field
        col: 12, // Column size in the form layout
      },
      
      {
        name: "description",
        label: this.$t("kpiunit.Description"),
        type: "textarea", // Multi-line text field
        rules: "required", // Validation rule: required field
        description: this.$t("kpiunit.Provide a description"), // Description for the field
        col: 12,
      },
    ];
  },

  methods: {
    // Truncate description to first 7 words
    truncateDescription(description) {
      if (!description) return 'N/A';
      
      // Remove HTML tags for word counting
      const plainText = description.replace(/<[^>]*>/g, ' ').trim();
      const words = plainText.split(/\s+/);
      
      if (words.length <= 7) {
        return description;
      }
      
      // Get first 7 words with original HTML preserved
      const truncated = words.slice(0, 7).join(' ') + '...';
      return truncated;
    },

    // Show description modal
    showDescriptionModal(description) {
      this.modalContent = description || 'No description available';
      this.modalTitle = this.$t('kpiunit.description') || 'Description';
      this.showModal = true;
    },

    // Close modal
    closeModal() {
      this.showModal = false;
      this.modalContent = '';
    },

    // Open the form for adding or editing an item
    openForm() {
      this.isFlipped = true;  // Show the form
    },

    // Close the form after submitting or canceling
    closeForm() {
      this.isFlipped = false;  // Hide the form
      this.$refs.table.refreshTable();  // Refresh the table data
      this.newItem = {};  // Clear the current item data
    },

    // Set the item data for editing
    editItem(data) {
      this.newItem = data;  // Set the current item to edit
      this.isFlipped = true; // Show the form for editing
    },
  },
};
</script>

<style scoped>
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Modal container */
.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Modal header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

/* Close button */
.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

/* Modal body */
.modal-body {
  padding: 20px;
  overflow-y: auto;
  color: #374151;
  line-height: 1.6;
}
</style>