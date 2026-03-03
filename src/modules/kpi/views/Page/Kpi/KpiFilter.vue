<template>
  <div class="card mb-3">
    <div class="card-header">{{ $t("kpi.filters") }}</div>
    <div class="card-body">
      <div class="row">
        <!-- Initiatives Multi-Select -->
        <div class="col-md-4 mb-3">
          <label class="form-label">{{ $t('kpi.linked_initiatives') }}</label>
          <multiselect
            v-model="filters.initiatives"
            :options="initiatives"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :placeholder="$t('kpi.select')"
            label="name"
            track-by="id"
            :searchable="true"
          >
            <template slot="selection" slot-scope="{ values, search, isOpen }">
              <span v-if="values.length && !isOpen" class="multiselect__single">
                {{ values.length }} {{ $t('kpi.selected') }}
              </span>
            </template>
            <span slot="noResult">{{ $t('kpi.no_results') }}</span>
          </multiselect>
        </div>

        <!-- Objectives Multi-Select -->
        <div class="col-md-4 mb-3">
          <label class="form-label">{{ $t('kpi.linked_objectives') }}</label>
          <multiselect
            v-model="filters.objectives"
            :options="objectives"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :placeholder="$t('kpi.select')"
            label="name"
            track-by="id"
            :searchable="true"
          >
            <template slot="selection" slot-scope="{ values, search, isOpen }">
              <span v-if="values.length && !isOpen" class="multiselect__single">
                {{ values.length }} {{ $t('kpi.selected') }}
              </span>
            </template>
            <span slot="noResult">{{ $t('kpi.no_results') }}</span>
          </multiselect>
        </div>

        <!-- Departments Multi-Select -->
        <div class="col-md-4 mb-3">
          <label class="form-label">{{ $t('kpi.linked_departments') }}</label>
          <multiselect
            v-model="filters.departments"
            :options="departments"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :placeholder="$t('kpi.select')"
            label="name"
            track-by="id"
            :searchable="true"
          >
            <template slot="selection" slot-scope="{ values, search, isOpen }">
              <span v-if="values.length && !isOpen" class="multiselect__single">
                {{ values.length }} {{ $t('kpi.selected') }}
              </span>
            </template>
            <span slot="noResult">{{ $t('kpi.no_results') }}</span>
          </multiselect>
        </div>

        <!-- Datasets Multi-Select -->
        <div class="col-md-4 mb-3">
          <label class="form-label">{{ $t('kpi.linked_datasets') }}</label>
          <multiselect
            v-model="filters.datasets"
            :options="datasets"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :placeholder="$t('kpi.select')"
            label="name"
            track-by="id"
            :searchable="true"
          >
            <template slot="selection" slot-scope="{ values, search, isOpen }">
              <span v-if="values.length && !isOpen" class="multiselect__single">
                {{ values.length }} {{ $t('kpi.selected') }}
              </span>
            </template>
            <span slot="noResult">{{ $t('kpi.no_results') }}</span>
          </multiselect>
        </div>

        <!-- KPI Types Multi-Select -->
        <div class="col-md-4 mb-3">
          <label class="form-label">{{ $t('kpi.type') }}</label>
          <multiselect
            v-model="filters.kpiTypes"
            :options="kpiTypes"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :placeholder="$t('kpi.select')"
            label="name"
            track-by="id"
            :searchable="true"
          >
            <template slot="selection" slot-scope="{ values, search, isOpen }">
              <span v-if="values.length && !isOpen" class="multiselect__single">
                {{ values.length }} {{ $t('kpi.selected') }}
              </span>
            </template>
            <span slot="noResult">{{ $t('kpi.no_results') }}</span>
          </multiselect>
        </div>

        <!-- Status Single Select -->
        <div class="col-md-4 mb-3">
          <label for="filterStatus" class="form-label">{{ $t('kpi.status') }}</label>
          <select id="filterStatus" class="form-select" v-model="filters.status">
            <option :value="null">{{ $t('kpi.all') }}</option>
            <option value="true">{{ $t('kpi.active') }}</option>
            <option value="false">{{ $t('kpi.inactive') }}</option>
          </select>
        </div>

        <!-- Date Range Filters -->
        <div class="col-md-4 mb-3">
          <label for="filterStartDate" class="form-label">{{ $t('kpi.start_date') }}</label>
          <input type="date" id="filterStartDate" class="form-control" v-model="filters.startDate">
        </div>
        <div class="col-md-4 mb-3">
          <label for="filterEndDate" class="form-label">{{ $t('kpi.end_date') }}</label>
          <input type="date" id="filterEndDate" class="form-control" v-model="filters.endDate">
        </div>

        <!-- Action Buttons -->
        <div class="col-12 text-end">
          <button class="btn btn-secondary me-2" @click="resetFilters">
            {{ $t('kpi.reset') }}
          </button>
          <button class="btn btn-primary" @click="applyFilters">
            {{ $t('kpi.filter') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';
import Multiselect from 'vue-multiselect';

interface FilterState {
  initiatives: any[];
  objectives: any[];
  departments: any[];
  datasets: any[];
  kpiTypes: any[];
  status: boolean | null;
  startDate: string | null;
  endDate: string | null;
}

export default defineComponent({
  name: 'KpiFilter',
  components: {
    Multiselect,
  },
  props: {
    initialFilters: {
      type: Object as PropType<FilterState>,
      required: true,
    },
    initiatives: {
      type: Array as PropType<any[]>,
      required: true,
    },
    objectives: {
      type: Array as PropType<any[]>,
      required: true,
    },
    departments: {
      type: Array as PropType<any[]>,
      required: true,
    },
    datasets: {
      type: Array as PropType<any[]>,
      required: true,
    },
    kpiTypes: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const filters = ref<FilterState>({ ...props.initialFilters });

    watch(
      () => props.initialFilters,
      (newVal) => {
        filters.value = { ...newVal };
      },
      { deep: true }
    );

    const resetFilters = () => {
      filters.value = {
        initiatives: [],
        objectives: [],
        departments: [],
        datasets: [],
        kpiTypes: [],
        status: null,
        startDate: null,
        endDate: null,
      };
      emit('apply-filters', filters.value);
    };

    const applyFilters = () => {
      emit('apply-filters', filters.value);
    };

    return {
      filters,
      resetFilters,
      applyFilters,
    };
  },
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>