<template>
  <v-dialog 
    :model-value="showModal" 
    @update:model-value="$emit('close')" 
    max-width="900px" 
    persistent
  >
    <v-card class="kpi-modal-card" style="background: #f5f5f5">
      <!-- Header -->
      <v-card-title class="modal-header">
        <span class="modal-title">{{ $t('kpi.frequency_settings') }}</span>
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
          <!-- Weekly Repeater -->
          <div v-if="frequencyType === 'weekly'" class="frequency-section">
            <h6 class="section-label">{{ $t('kpi.weekly_values') }}</h6>
            <div class="table-wrapper">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>{{ $t('kpi.week') }}</th>
                    <th>{{ $t('kpi.date') }}</th>
                    <th>{{ $t('kpi.target_value') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(week, index) in weeklyData" :key="'week-' + index">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <v-text-field
                        v-model="week.date"
                        type="date"
                        variant="outlined"
                        density="compact"
                        disabled
                        class="custom-text-field"
                        hide-details
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="week.value"
                        type="number"
                        variant="outlined"
                        density="compact"
                        step="0.01"
                        class="custom-text-field"
                        hide-details
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Monthly Repeater -->
          <div v-else-if="frequencyType === 'monthly'" class="frequency-section">
            <h6 class="section-label">{{ $t('kpi.monthly_values') }}</h6>
            <div class="table-wrapper">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>{{ $t('kpi.month') }}</th>
                    <th>{{ $t('kpi.date') }}</th>
                    <th>{{ $t('kpi.target_value') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(month, index) in monthlyData" :key="'month-' + index">
                    <td>{{ getMonthName(month.date) }}</td>
                    <td>
                      <v-text-field
                        v-model="month.date"
                        type="date"
                        variant="outlined"
                        density="compact"
                        disabled
                        class="custom-text-field"
                        hide-details
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="month.value"
                        type="number"
                        variant="outlined"
                        density="compact"
                        step="0.01"
                        class="custom-text-field"
                        hide-details
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Quarterly Repeater -->
          <div v-else-if="frequencyType === 'quarterly'" class="frequency-section">
            <h6 class="section-label">{{ $t('kpi.quarterly_values') }}</h6>
            <div class="table-wrapper">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>{{ $t('kpi.quarter') }}</th>
                    <th>{{ $t('kpi.date') }}</th>
                    <th>{{ $t('kpi.target_value') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(quarter, index) in quarterlyData" :key="'quarter-' + index">
                    <td>{{ getQuarterName(quarter.date) }}</td>
                    <td>
                      <v-text-field
                        v-model="quarter.date"
                        type="date"
                        variant="outlined"
                        density="compact"
                        disabled
                        class="custom-text-field"
                        hide-details
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="quarter.value"
                        type="number"
                        variant="outlined"
                        density="compact"
                        step="0.01"
                        class="custom-text-field"
                        hide-details
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Yearly Repeater -->
          <div v-else-if="frequencyType === 'yearly'" class="frequency-section">
            <h6 class="section-label">{{ $t('kpi.yearly_values') }}</h6>
            <div class="table-wrapper">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>{{ $t('kpi.year') }}</th>
                    <th>{{ $t('kpi.date') }}</th>
                    <th>{{ $t('kpi.target_value') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(year, index) in yearlyData" :key="'year-' + index">
                    <td>{{ new Date(year.date).getFullYear() }}</td>
                    <td>
                      <v-text-field
                        v-model="year.date"
                        type="date"
                        variant="outlined"
                        density="compact"
                        disabled
                        class="custom-text-field"
                        hide-details
                      />
                    </td>
                    <td>
                      <v-text-field
                        v-model="year.value"
                        type="number"
                        variant="outlined"
                        density="compact"
                        step="0.01"
                        class="custom-text-field"
                        hide-details
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Footer Actions -->
      <v-card-actions class="modal-actions">
        <button class="cancel-btn" @click="closeModal">
          {{ $t('kpi.cancel') }}
        </button>
        <button class="save-btn" @click="saveFrequencyData">
          {{ $t('kpi.save') }}
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    frequencyType: String,
    initialData: Array,
    startDate: String,
    endDate: String,
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      weeklyData: [],
      monthlyData: [],
      quarterlyData: [],
      yearlyData: []
    };
  },
  computed: {
    startDateComputed() {
      return new Date().toISOString().split('T')[0];
    },
    endDateComputed() {
      if (this.endDate) {
        const endDate = new Date(this.endDate);
        const today = new Date();
        return endDate >= today ? this.endDate : today.toISOString().split('T')[0];
      }
      
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      return oneYearFromNow.toISOString().split('T')[0];
    }
  },
  methods: {
    initializeFrequencyData() {
      const startDate = new Date();
      const endDate = new Date(this.endDateComputed);
      
      this.weeklyData = [];
      this.monthlyData = [];
      this.quarterlyData = [];
      this.yearlyData = [];
      
      if (this.frequencyType === 'weekly') {
        this.generateWeeklyData(startDate, endDate);
      } else if (this.frequencyType === 'monthly') {
        this.generateMonthlyData(startDate, endDate);
      } else if (this.frequencyType === 'quarterly') {
        this.generateQuarterlyData(startDate, endDate);
      } else if (this.frequencyType === 'yearly') {
        this.generateYearlyData(startDate, endDate);
      }
    },
    
    generateWeeklyData(startDate, endDate) {
      let currentDate = new Date(startDate);
      
      if (currentDate < new Date()) {
        currentDate = new Date();
      }
      
      let weekCounter = 1;
      
      while (currentDate <= endDate) {
        this.weeklyData.push({
          date: currentDate.toISOString().split('T')[0],
          value: 0
        });
        
        currentDate.setDate(currentDate.getDate() + 7);
        weekCounter++;
      }
    },
    
    generateMonthlyData(startDate, endDate) {
      let currentDate = new Date(startDate);
      
      if (currentDate < new Date()) {
        currentDate = new Date();
      }
      
      const currentDay = currentDate.getDate();
      
      while (currentDate <= endDate) {
        this.monthlyData.push({
          date: currentDate.toISOString().split('T')[0],
          value: 0
        });
        
        currentDate.setMonth(currentDate.getMonth() + 1);
        
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        currentDate.setDate(Math.min(currentDay, daysInMonth));
      }
    },
    
    generateQuarterlyData(startDate, endDate) {
      let currentDate = new Date(startDate);
      
      if (currentDate < new Date()) {
        currentDate = new Date();
      }
      
      const currentDay = currentDate.getDate();
      
      while (currentDate <= endDate) {
        this.quarterlyData.push({
          date: currentDate.toISOString().split('T')[0],
          value: 0
        });
        
        currentDate.setMonth(currentDate.getMonth() + 3);
        
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        currentDate.setDate(Math.min(currentDay, daysInMonth));
      }
    },
    
    generateYearlyData(startDate, endDate) {
      let currentDate = new Date(startDate);
      
      if (currentDate < new Date()) {
        currentDate = new Date();
      }
      
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.getMonth();
      
      this.yearlyData.push({
        date: currentDate.toISOString().split('T')[0],
        value: 0
      });
      
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      
      const daysInMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();
      currentDate.setDate(Math.min(currentDay, daysInMonth));
      currentDate.setMonth(currentMonth);
      
      while (currentDate <= endDate) {
        this.yearlyData.push({
          date: currentDate.toISOString().split('T')[0],
          value: 0
        });
        
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        
        const daysInNextMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();
        currentDate.setDate(Math.min(currentDay, daysInNextMonth));
        currentDate.setMonth(currentMonth);
      }
    },
    
    getMonthName(dateString) {
      const date = new Date(dateString);
      const months = [
        this.$t('kpi.january'), this.$t('kpi.february'), this.$t('kpi.march'),
        this.$t('kpi.april'), this.$t('kpi.may'), this.$t('kpi.june'),
        this.$t('kpi.july'), this.$t('kpi.august'), this.$t('kpi.september'),
        this.$t('kpi.october'), this.$t('kpi.november'), this.$t('kpi.december')
      ];
      return months[date.getMonth()];
    },
    
    getQuarterName(dateString) {
      const date = new Date(dateString);
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `${this.$t('kpi.quarter')} ${quarter} (${date.getFullYear()})`;
    },
    
    closeModal() {
      this.$emit('close');
    },
    
    saveFrequencyData() {
      let data;
      switch(this.frequencyType) {
        case 'weekly':
          data = this.weeklyData;
          break;
        case 'monthly':
          data = this.monthlyData;
          break;
        case 'quarterly':
          data = this.quarterlyData;
          break;
        case 'yearly':
          data = this.yearlyData;
          break;
        default:
          data = [];
      }
      this.$emit('save', data);
      this.closeModal();
    }
  },
  watch: {
    frequencyType: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.initializeFrequencyData();
        }
      }
    },
    initialData: {
      immediate: true,
      handler(newVal) {
        if (this.isEditing && Array.isArray(newVal) && newVal.length) {
          const cloned = newVal.map(i => ({ date: i.date, value: i.value }));
          
          if (this.frequencyType === 'weekly') {
            this.weeklyData = cloned;
          } else if (this.frequencyType === 'monthly') {
            this.monthlyData = cloned;
          } else if (this.frequencyType === 'quarterly') {
            this.quarterlyData = cloned;
          } else if (this.frequencyType === 'yearly') {
            this.yearlyData = cloned;
          }
        } else {
          this.initializeFrequencyData();
        }
      }
    }
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
  font-size: 16px;
  font-weight: 700;
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
/* FREQUENCY SECTION */
/* ============================================ */
.frequency-section {
  width: 100%;
}

.section-label {
  font-size: 14px;
  font-weight: 700;
  color: #000;
  margin-bottom: 12px;
}

/* ============================================ */
/* TABLE STYLES */
/* ============================================ */
.table-wrapper {
  max-height: 450px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
}

.custom-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #F9FAFB;
}

.custom-table thead th {
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #E5E7EB;
  background: #F9FAFB;
}

.custom-table tbody tr {
  transition: background 0.2s;
}

.custom-table tbody tr:hover {
  background: #F9FAFB;
}

.custom-table tbody td {
  padding: 8px 16px;
  font-size: 14px;
  color: #111827;
  border-bottom: 1px solid #F3F4F6;
  vertical-align: middle;
}

.custom-table tbody tr:last-child td {
  border-bottom: none;
}

/* First column (Week/Month/Quarter/Year number) */
.custom-table tbody td:first-child {
  font-weight: 600;
  color: #6E3894;
  min-width: 80px;
}

/* Second column (Date) */
.custom-table tbody td:nth-child(2) {
  min-width: 180px;
}

/* Third column (Target Value) */
.custom-table tbody td:nth-child(3) {
  min-width: 180px;
}

/* ============================================ */
/* TEXT FIELD STYLES */
/* ============================================ */
:deep(.custom-text-field .v-field) {
  border-radius: 8px !important;
  background-color: #ffffff;
  min-height: 38px !important;
}

:deep(.custom-text-field .v-field__input) {
  padding: 8px 12px;
  font-size: 14px;
  min-height: 38px !important;
}

:deep(.custom-text-field.v-input--disabled .v-field) {
  background-color: #F9FAFB;
  opacity: 1;
}

:deep(.custom-text-field.v-input--disabled .v-field__input) {
  color: #6B7280;
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
.table-wrapper::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track,
.table-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb,
.table-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover,
.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */
@media (max-width: 768px) {
  .modal-header {
    padding: 12px 16px 0 !important;
  }

  .modal-content {
    padding: 0 12px !important;
  }

  .modal-actions {
    padding: 12px 16px !important;
  }

  .table-wrapper {
    max-height: 350px;
  }

  .custom-table thead th {
    padding: 10px 12px;
    font-size: 12px;
  }

  .custom-table tbody td {
    padding: 6px 12px;
    font-size: 13px;
  }

  .custom-table tbody td:first-child {
    min-width: 60px;
  }

  .custom-table tbody td:nth-child(2),
  .custom-table tbody td:nth-child(3) {
    min-width: 140px;
  }
}

@media (max-width: 640px) {
  .modal-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
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
</style>