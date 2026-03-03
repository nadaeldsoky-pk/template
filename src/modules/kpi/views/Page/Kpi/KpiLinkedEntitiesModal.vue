<template>
  <!-- Linked Entities Modal -->
  <div v-if="showModal" class="modal-backdrop fade show"></div>
  <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;" @click.self="closeModal">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t('kpi.linked_entities') }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="card-custom mb-0">
            <div class="custom-tabs-header">
              <button v-if="currentLinkedEntityTab == 'objectives'" class="custom-tab ">
                {{ $t('kpi.linked_objectives') }}
              </button>

              <button v-if="currentLinkedEntityTab == 'initiatives'" class="custom-tab">
                {{ $t('kpi.linked_initiatives') }}
              </button>

              <button v-if="currentLinkedEntityTab == 'departments'" class="custom-tab ">
                {{ $t('kpi.linked_departments') }}
              </button>

              <button v-if="currentLinkedEntityTab == 'datasets'" class="custom-tab">
                {{ $t('kpi.linked_datasets') }}
              </button>

              <button v-if="currentLinkedEntityTab == 'domains'" class="custom-tab">
                {{ $t('kpi.linked_domains') }}
              </button>

              <button v-if="currentLinkedEntityTab == 'linked_users'" class="custom-tab">
                {{ $t('kpi.linked_users') }}
              </button>
            </div>

            <div v-if="kpi">
              <div v-show="currentLinkedEntityTab === 'objectives'">
                <ul class="list-group">
                  <li v-for="objId in kpi.objectives" :key="objId" class="list-group-item mb-2">
                    {{ getObjectiveName(objId) }}
                  </li>
                </ul>
              </div>
              <div v-show="currentLinkedEntityTab === 'initiatives'">
                <ul class="list-group">
                  <li v-for="initId in kpi.initiatives" :key="initId" class="list-group-item mb-2">
                    {{ getInitiativeName(initId) }}
                  </li>
                </ul>
              </div>
              <div v-show="currentLinkedEntityTab === 'departments'">
                <ul class="list-group">
                  <li v-for="department in kpi.departments" :key="department.id" class="list-group-item mb-2">
                    {{ getDepartmentName(department) }}
                  </li>
                </ul>
              </div>
              <div v-show="currentLinkedEntityTab === 'datasets'">
                <ul class="list-group">
                  <li v-for="dataset in kpi.datasets" :key="dataset" class="list-group-item mb-2">
                    {{ dataset.name }}
                  </li>
                </ul>
              </div>
              <div v-show="currentLinkedEntityTab === 'domains'">
                <ul class="list-group">
                  <li v-for="domId in kpi.domains" :key="domId" class="list-group-item mb-2">
                    {{ getDomainName(domId) }}
                  </li>
                </ul>
              </div>
              <div v-show="currentLinkedEntityTab === 'linked_users'">
                <ul class="list-group">
                  <li v-for="user in kpi.linked_users" :key="user"
                    class="list-group-item d-flex align-items-center mb-2">
                    <img v-if="user && user.fullImagePath" :src="user.fullImagePath" alt="User Image"
                      class="rounded-circle me-2" style="width: 30px; height: 30px;">
                    {{ getUserName(user) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  kpi: {
    type: Object,
    default: null
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
  },
  datasets: {
    type: Array,
    default: () => []
  },
  domains: {
    type: Array,
    default: () => []
  },
  users: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close']);

// Set initial tab based on kpi.linkedType
const currentLinkedEntityTab = ref(getDefaultTab());

// Watch for changes in kpi.linkedType and update the tab
watch(() => props.kpi?.linkedType, (newLinkedType) => {
  if (newLinkedType) {
    currentLinkedEntityTab.value = newLinkedType;
  }
});

function getDefaultTab() {
  if (!props.kpi?.linkedType) return 'objectives';

  const validTabs = ['objectives', 'initiatives', 'departments', 'datasets', 'domains', 'linked_users'];

  // Check if the linkedType is a valid tab
  if (validTabs.includes(props.kpi.linkedType)) {
    return props.kpi.linkedType;
  }

  return 'objectives'; // fallback
}

const closeModal = () => {
  emit('close');
};

const getObjectiveName = (id) => {
  const obj = props.objectives.find(o => o.id === id);
  return obj ? obj.name : id;
};

const getInitiativeName = (id) => {
  const init = props.initiatives.find(i => i.id === id);
  return init ? init.name : id;
};

const getDatasetName = (id) => {
  const ds = props.datasets.find(d => d.id === id);
  return ds ? ds.name : id;
};

const getDomainName = (id) => {
  const dom = props.domains.find(d => d.id === id);
  return dom ? dom.name : id;
};
</script>

<script>
import userApi from "@/API/User/User";
import positionApi from "@/API/Position/Position";

export default {
  props: {
    kpi: {
      type: Object,
      required: true
    },
    kpiTypes: {
      type: Array,
      default: () => []
    },
    objectives: {
      type: Array,
      default: () => []
    },
    units: {
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
  },

  data() {
    return {
      allUsers: [],
      allPositions: [],
      units: [],
      isLoading: false,
      loadError: null
    };
  },

  async created() {
    const usersApi = new userApi();
    const usersResponse = await usersApi.getAll();
    this.allUsers = usersResponse;

    const positionsApi = new positionApi();
    const positionsResponse = await positionsApi.getAll();
    this.allPositions = positionsResponse;
  },

  methods: {
    getUserName(userId) {
      if (!userId) return this.$t('kpi.Unknown');
      const user = this.allUsers.find(u => u.id === userId);
      return user ? user.full_name || user.name : this.$t('kpi.Unknown');
    },

    getDepartmentName(departmentId) {
      const department = this.departments.find(d => d.id === departmentId);
      return department ? department.name : this.$t('kpi.Unknown');
    },
  }
};
</script>

<style scoped>
.card-custom{
  border-radius:10px;
  padding:8px;
  background:#FFFFFF;
}

.modal-title {
  font-weight: 700 !important;
  font-size: 16px !important;
}

.modal-content {
  background-color: #f5f5f5;
}

.modal-header {
  border-bottom: 0 solid transparent !important;
}

.modal-body {
  padding: 0px 1rem 1rem !important;
}

.list-group-item {
  padding:0px  8px;
  border: var(--bs-list-group-border-width) solid var(--bs-list-group-border-color);
  color:#404040 !important;
}


.list-group-item+.list-group-item {
  border-top-width: 1px !important;
  border-radius: inherit !important;
}

/* Custom Tabs Styles */
.custom-tabs-header {
  display: flex;
  background: #fff;
}

.custom-tab {
  flex: 1;
  border: none;
  background: transparent;
  color: #6E3894;
  font-weight: 500;
  font-size:14px;
  cursor: default;
  pointer-events: none;
  text-align:start;
}

.custom-tab.text-start {
  text-align: start !important;
}
.list-group-item:first-child {
    border-radius: 10px;
}
.modal-dialog {
    margin-top: 15% !important;
}
</style>