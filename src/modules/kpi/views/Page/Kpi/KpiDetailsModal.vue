<template>
  <!-- KPI Details Modal -->
  <div v-if="showModal" class="modal-backdrop fade show"></div>
  <div 
    v-if="showModal"
    class="modal fade show"
    tabindex="-1"
    style="display: block;"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Details</h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <KpiDetails 
            v-if="kpi" 
            :kpi="kpi" 
            :kpiTypes="kpiTypes"
            :units="units"
            :objectives="objectives"
            :initiatives="initiatives"
            :departments="departments"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import KpiDetails from "./KpiDetails.vue";

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  kpi: {
    type: Object,
    default: null
  },
  kpiTypes: {
    type: Array,
    default: () => []
  },
  units: {
    type: Array,
    default: () => []
  },
  objectives: {
    type: Array,
    default: () => []
  },
  initiatives: {
    type: Array,
    default: () => []
  },
  departments: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-title{
  font-weight:700px;
  font-size:16px;
  color:#000000 !important;
}
.modal-header{
    border-bottom: 0px;
    background: #F5F5F5;
}
.modal-body{
    background: #f5f5f5;
    padding-top:0px;
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
</style>