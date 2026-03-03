<template>
  <main-page 
    ref="page" 
    :isFlipped="isFlipped" 
    :mainPage="'kpi.kpi'" 
    :subPage="'kpi.kpi'" 
    :titlePage="'kpi.kpi'"
  >
    <!-- Your existing datatable and form templates remain the same -->
    
    <!-- Add this modal markup at the bottom of your template -->
    <div v-if="showDetailsModal" class="modal-backdrop fade show"></div>
    
    <div 
      v-if="showDetailsModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block;"
      @click.self="showDetailsModal = false"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedKpi.name }}</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="showDetailsModal = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <KpiDetails :kpi="selectedKpi" />
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn text-light btn-secondary" 
              @click="showDetailsModal = false"
            >
              {{ $t('kpi.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main-page>
</template>

<script>
// Your existing imports remain the same
import KpiDetails from "@/modules/kpi/views/Page/Kpi/KpiDetails.vue";

export default {
  components: {
    // Your existing components remain
    KpiDetails
  },
  // Rest of your script remains the same
};
</script>

<style scoped>
/* Add these styles to your existing scoped styles */
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
  outline: 0;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 1.75rem auto;
  pointer-events: none;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  border-bottom-right-radius: 0.3rem;
  border-bottom-left-radius: 0.3rem;
}

.btn-close {
  padding: 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto;
  background-color: transparent;
  border: 0;
  appearance: none;
  opacity: 0.5;
}

.btn-close:hover {
  opacity: 0.75;
}
.modal-header {
    justify-content: space-between;
}
[dir="rtl"] .modal-header ,[dir="rtl"] .dropdown-item ,[dir="rtl"] .children-modal-header{
    flex-direction: row-reverse;
}
[dir="rtl"] .modal-body .row{
text-align: end;
}
/* Your existing styles remain */
</style>