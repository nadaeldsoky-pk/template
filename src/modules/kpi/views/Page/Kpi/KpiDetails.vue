<template>
  <div class="kpi-details" v-if="kpi">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ $t('kpi.Loading') }}</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="loadError" class="alert alert-danger">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ $t('kpi.Error loading additional data') }}: {{ loadError.message }}
    </div>

    <!-- Main Content -->
    <div v-if="!isLoading && !loadError">
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card h-100 p-2">
            <div class="section-title mb-0 d-flex align-items-center">
              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="path-1-outside-1_444_23056" maskUnits="userSpaceOnUse" x="0" y="-0.5" width="18" height="18"
                  fill="black">
                  <rect fill="white" y="-0.5" width="18" height="18" />
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M9 1.73077C5.26146 1.73077 2.23077 4.76146 2.23077 8.5C2.23077 12.2385 5.26146 15.2692 9 15.2692C12.7385 15.2692 15.7692 12.2385 15.7692 8.5C15.7692 4.76146 12.7385 1.73077 9 1.73077ZM1 8.5C1 4.08172 4.58172 0.5 9 0.5C13.4183 0.5 17 4.08172 17 8.5C17 12.9183 13.4183 16.5 9 16.5C4.58172 16.5 1 12.9183 1 8.5Z" />
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M9 4.19231C9.33987 4.19231 9.61539 4.46782 9.61539 4.80769V9.11539C9.61539 9.45525 9.33987 9.73077 9 9.73077C8.66013 9.73077 8.38462 9.45525 8.38462 9.11539V4.80769C8.38462 4.46782 8.66013 4.19231 9 4.19231Z" />
                  <path
                    d="M9 12.8077C9.5098 12.8077 9.92308 12.3944 9.92308 11.8846C9.92308 11.3748 9.5098 10.9615 9 10.9615C8.4902 10.9615 8.07692 11.3748 8.07692 11.8846C8.07692 12.3944 8.4902 12.8077 9 12.8077Z" />
                </mask>
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M9 1.73077C5.26146 1.73077 2.23077 4.76146 2.23077 8.5C2.23077 12.2385 5.26146 15.2692 9 15.2692C12.7385 15.2692 15.7692 12.2385 15.7692 8.5C15.7692 4.76146 12.7385 1.73077 9 1.73077ZM1 8.5C1 4.08172 4.58172 0.5 9 0.5C13.4183 0.5 17 4.08172 17 8.5C17 12.9183 13.4183 16.5 9 16.5C4.58172 16.5 1 12.9183 1 8.5Z"
                  fill="#6E3894" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M9 4.19231C9.33987 4.19231 9.61539 4.46782 9.61539 4.80769V9.11539C9.61539 9.45525 9.33987 9.73077 9 9.73077C8.66013 9.73077 8.38462 9.45525 8.38462 9.11539V4.80769C8.38462 4.46782 8.66013 4.19231 9 4.19231Z"
                  fill="#6E3894" />
                <path
                  d="M9 12.8077C9.5098 12.8077 9.92308 12.3944 9.92308 11.8846C9.92308 11.3748 9.5098 10.9615 9 10.9615C8.4902 10.9615 8.07692 11.3748 8.07692 11.8846C8.07692 12.3944 8.4902 12.8077 9 12.8077Z"
                  fill="#6E3894" />
                <path
                  d="M2.23077 8.5H2.73077C2.73077 5.0376 5.5376 2.23077 9 2.23077V1.73077V1.23077C4.98531 1.23077 1.73077 4.48531 1.73077 8.5H2.23077ZM9 15.2692V14.7692C5.5376 14.7692 2.73077 11.9624 2.73077 8.5H2.23077H1.73077C1.73077 12.5147 4.98531 15.7692 9 15.7692V15.2692ZM15.7692 8.5H15.2692C15.2692 11.9624 12.4624 14.7692 9 14.7692V15.2692V15.7692C13.0147 15.7692 16.2692 12.5147 16.2692 8.5H15.7692ZM9 1.73077V2.23077C12.4624 2.23077 15.2692 5.0376 15.2692 8.5H15.7692H16.2692C16.2692 4.48531 13.0147 1.23077 9 1.23077V1.73077ZM9 0.5V0C4.30558 0 0.5 3.80558 0.5 8.5H1H1.5C1.5 4.35786 4.85786 1 9 1V0.5ZM17 8.5H17.5C17.5 3.80558 13.6944 0 9 0V0.5V1C13.1421 1 16.5 4.35786 16.5 8.5H17ZM9 16.5V17C13.6944 17 17.5 13.1944 17.5 8.5H17H16.5C16.5 12.6421 13.1421 16 9 16V16.5ZM1 8.5H0.5C0.5 13.1944 4.30558 17 9 17V16.5V16C4.85786 16 1.5 12.6421 1.5 8.5H1ZM9.61539 4.80769H10.1154C10.1154 4.19168 9.61601 3.69231 9 3.69231V4.19231V4.69231C9.06373 4.69231 9.11539 4.74397 9.11539 4.80769H9.61539ZM9.61539 9.11539H10.1154V4.80769H9.61539H9.11539V9.11539H9.61539ZM9 9.73077V10.2308C9.61601 10.2308 10.1154 9.73139 10.1154 9.11539H9.61539H9.11539C9.11539 9.17911 9.06373 9.23077 9 9.23077V9.73077ZM8.38462 9.11539H7.88462C7.88462 9.73139 8.38399 10.2308 9 10.2308V9.73077V9.23077C8.93628 9.23077 8.88462 9.17911 8.88462 9.11539H8.38462ZM8.38462 4.80769H7.88462V9.11539H8.38462H8.88462V4.80769H8.38462ZM9 4.19231V3.69231C8.38399 3.69231 7.88462 4.19168 7.88462 4.80769H8.38462H8.88462C8.88462 4.74397 8.93628 4.69231 9 4.69231V4.19231ZM9.92308 11.8846H9.42308C9.42308 12.1183 9.23366 12.3077 9 12.3077V12.8077V13.3077C9.78594 13.3077 10.4231 12.6706 10.4231 11.8846H9.92308ZM9 12.8077V12.3077C8.76634 12.3077 8.57692 12.1183 8.57692 11.8846H8.07692H7.57692C7.57692 12.6706 8.21406 13.3077 9 13.3077V12.8077ZM8.07692 11.8846H8.57692C8.57692 11.651 8.76634 11.4615 9 11.4615V10.9615V10.4615C8.21406 10.4615 7.57692 11.0987 7.57692 11.8846H8.07692ZM9 10.9615V11.4615C9.23366 11.4615 9.42308 11.651 9.42308 11.8846H9.92308H10.4231C10.4231 11.0987 9.78594 10.4615 9 10.4615V10.9615Z"
                  fill="#6E3894" mask="url(#path-1-outside-1_444_23056)" />
              </svg>
              <p class="mb-0 ms-2">{{ $t('kpi.basic_info') }}</p>
            </div>
            <div class="d-flex flex-column">
              <p class="mb-0 title-details">{{ $t('kpi.name') }}:</p>
              <p class="mb-0 des">{{ kpi.name }}</p>
            </div>
            <div class="d-flex flex-column">
              <p class="mb-0 title-details">{{ $t('kpi.description') }}:</p>
              <p class="mb-0 des" v-html="kpi.description"></p>
            </div>
            <div class="d-flex flex-column">
              <p class="mb-0 title-details">{{ $t('kpi.type') }}:</p>
              <p class="mb-0 des">{{ getKpiTypeName(kpi.type) }}</p>
            </div>

          </div>
        </div>

        <div class="col-md-6">
          <div class="card h-100 p-2">
            <div class="section-title mb-0 d-flex align-items-center">
              <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 17.5C14.4183 17.5 18 13.9183 18 9.5C18 5.08172 14.4183 1.5 10 1.5C5.58172 1.5 2 5.08172 2 9.5C2 13.9183 5.58172 17.5 10 17.5Z"
                  stroke="#6E3894" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M10 14.3C12.651 14.3 14.8 12.151 14.8 9.5C14.8 6.84903 12.651 4.7 10 4.7C7.34903 4.7 5.2 6.84903 5.2 9.5C5.2 12.151 7.34903 14.3 10 14.3Z"
                  stroke="#6E3894" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M10 11.1C10.8837 11.1 11.6 10.3837 11.6 9.5C11.6 8.61634 10.8837 7.9 10 7.9C9.11634 7.9 8.4 8.61634 8.4 9.5C8.4 10.3837 9.11634 11.1 10 11.1Z"
                  stroke="#6E3894" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p class="mb-0 ms-2">{{ $t('kpi.target_info') }}</p>
            </div>
            <div class="d-flex flex-column">
              <p class="mb-0 title-details">{{ $t('kpi.target_value') }}:</p>
              <p class="mb-0 des">{{ kpi.target_value }} {{ (kpi.kpiunit?.name) }}</p>
            </div>
            <div class="d-flex flex-column">
              <p class="mb-0 title-details">{{ $t('kpi.collection_method') }}:</p>
              <p class="mb-0 des">{{ formatCollectionMethod(kpi.collection_method) }}</p>
            </div>
            <div class="d-flex flex-column">
              <p class="mb-0 title-details">{{ $t('kpi.frequency') }}:</p>
              <p class="mb-0 des">{{ formatFrequency(kpi.frequency) }}</p>
            </div>
            <div class="d-flex flex-column">
              <p class="mb-0 title-details">{{ $t('kpi.created_at') }}:</p>
              <p class="mb-0 des">{{ formatDate(kpi.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="card p-2">
            <h5 class="section-title">
              <svg width="25" height="17" viewBox="0 0 25 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.2816 2.12643C5.76603 2.12643 3.72676 4.1289 3.72676 6.59909C3.72676 9.06927 5.76603 11.0717 8.2816 11.0717C10.7972 11.0717 12.8364 9.06927 12.8364 6.59909C12.8364 4.1289 10.7972 2.12643 8.2816 2.12643ZM2.07045 6.59909C2.07045 3.23066 4.85128 0.500004 8.2816 0.500004C11.7119 0.500004 14.4927 3.23066 14.4927 6.59909C14.4927 9.96752 11.7119 12.6982 8.2816 12.6982C4.85128 12.6982 2.07045 9.96752 2.07045 6.59909Z"
                  fill="#6E3894" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M16.7159 0.500008L16.7184 0.5C18.3657 0.500004 19.9455 1.14258 21.1103 2.28638C22.2752 3.43018 22.9295 4.98151 22.9295 6.59909C22.9295 8.21666 22.2752 9.76799 21.1103 10.9118C19.9455 12.0556 18.3657 12.6982 16.7184 12.6982C16.261 12.6982 15.8903 12.3341 15.8903 11.885C15.8903 11.4358 16.261 11.0717 16.7184 11.0717C17.9264 11.0717 19.085 10.6005 19.9392 9.76173C20.7934 8.92295 21.2732 7.78531 21.2732 6.59909C21.2732 5.41286 20.7934 4.27522 19.9392 3.43644C19.0853 2.59794 17.9272 2.12675 16.7197 2.12643C16.2994 2.12779 15.8812 2.18319 15.4756 2.29121C15.0341 2.40877 14.5792 2.15268 14.4595 1.71922C14.3398 1.28575 14.6006 0.839059 15.042 0.721496C15.5877 0.576162 16.1505 0.501698 16.7159 0.500008Z"
                  fill="#6E3894" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M8.2816 12.6982C6.95262 12.6982 5.64316 13.0119 4.46382 13.6135C3.28448 14.2151 2.26991 15.0866 1.5058 16.1543C1.24283 16.5217 0.726285 16.6103 0.352068 16.3521C-0.0221486 16.0938 -0.11233 15.5866 0.150643 15.2192C1.06757 13.9379 2.28506 12.8921 3.70026 12.1702C5.11547 11.4483 6.68682 11.0717 8.2816 11.0717C9.87637 11.0717 11.4477 11.4483 12.8629 12.1702C14.2781 12.8921 15.4956 13.9379 16.4125 15.2192C16.6755 15.5866 16.5853 16.0938 16.2111 16.3521C15.8369 16.6103 15.3204 16.5217 15.0574 16.1543C14.2933 15.0866 13.2787 14.2151 12.0994 13.6135C10.92 13.0119 9.61058 12.6982 8.2816 12.6982Z"
                  fill="#6E3894" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M20.5368 13.6125C19.3574 13.011 18.0473 12.6974 16.7184 12.6982C16.261 12.6982 15.8903 12.3341 15.8903 11.885C15.8903 11.4358 16.261 11.0717 16.7184 11.0717C18.3135 11.0708 19.8848 11.4472 21.3003 12.1692C22.7157 12.8912 23.9332 13.9375 24.8496 15.2195C25.1124 15.5871 25.0219 16.0943 24.6476 16.3523C24.2732 16.6104 23.7567 16.5215 23.4939 16.1539C22.7304 15.0858 21.7161 14.2141 20.5368 13.6125Z"
                  fill="#6E3894" />
              </svg>
              {{ $t('kpi.ownership') }}
            </h5>
            <div class="row">
              <div class="col-md-4 detail-item d-flex flex-column align-items-start ">
                <p class="title-details mb-0">{{ $t('kpi.owners') }}:</p>
                <!-- <ul class="list-unstyled">
                <li v-for="(owner, index) in kpi.owners" :key="index">
                 <p class="title-des mb-0 ms-2"> {{ getOwnerName(owner) }}</p>
                </li>
              </ul> -->
                <AvatarGroup :users="getMemberUsers2(kpi.owners)" :maxVisible="3" :spacing="20" />
              </div>
              <div class="col-md-4 detail-item d-flex flex-column align-items-start ">
                <p class="title-details mb-0">{{ $t('kpi.Stakeholders') }}:</p>
                <!-- <ul v-if="kpi.contributors && kpi.contributors.length" class="list-unstyled">
                <li v-for="(contributor, index) in kpi.contributors" :key="index">
                   <p class="title-des mb-0 ms-2"> {{ getUserName(contributor) }}</p>
                </li>
              </ul>
              <span v-else class="text-muted">{{ $t('kpi.Unknown') }}</span> -->
                <AvatarGroup :users="getMemberUsers(kpi.contributors)" :maxVisible="3" :spacing="20" />
              </div>
              <div class="col-md-4 detail-item d-flex flex-column align-items-start ">
                <p class="title-details mb-0">{{ $t('kpi.reviewers') }}:</p>
                <!-- <ul v-if="kpi.reviewers && kpi.reviewers.length" class="list-unstyled">
                <li v-for="(reviewer, index) in kpi.reviewers" :key="index">
                  <p class="title-des mb-0 ms-2">  {{ getUserName(reviewer) }}</p>
                </li>
              </ul>
              <span v-else class="text-muted">{{ $t('kpi.Unknown') }}</span> -->
                <AvatarGroup :users="getMemberUsers(kpi.reviewers)" :maxVisible="3" :spacing="20" />
                <!-- @click="openMemberEditModal(item)" -->
              </div>
            </div>
          </div>

          <!-- <div class="col-md-6">
          <h5 class="section-title">
            <i class="fas fa-project-diagram me-2"></i>
            {{ $t('kpi.linked_entities') }}
          </h5>
          <div class="detail-item">
            <label>{{ $t('kpi.linked_objectives') }}:</label>
            <ul v-if="kpi.objectives && kpi.objectives.length" class="list-unstyled">
              <li v-for="(objectiveId, index) in kpi.objectives" :key="index">
                <i class="fas fa-bullseye me-1"></i>
                {{ getObjectiveName(objectiveId) }}
              </li>
            </ul>
            <span v-else class="text-muted">N/A</span>
          </div>
          <div class="detail-item">
            <label>{{ $t('kpi.linked_initiatives') }}:</label>
            <ul v-if="kpi.initiatives && kpi.initiatives.length" class="list-unstyled">
              <li v-for="(initiativeId, index) in kpi.initiatives" :key="index">
                <i class="fas fa-tasks me-1"></i>
                {{ getInitiativeName(initiativeId) }}
              </li>
            </ul>
            <span v-else class="text-muted">N/A</span>
          </div>
          <div class="detail-item">
            <label>{{ $t('kpi.linked_departments') }}:</label>
            <ul v-if="kpi.departments && kpi.departments.length" class="list-unstyled">
              <li v-for="(department, index) in kpi.departments" :key="index">
                <i class="fas fa-building me-1"></i>
                {{ (department.name) }}
              </li>
            </ul>
            <span v-else class="text-muted">N/A</span>
          </div>
        </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from "@/API/User/User";
import positionApi from "@/API/Position/Position";
import AvatarGroup from "@/components/AvatarGroup.vue";
export default {
  components: {
    AvatarGroup
  },
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
    getMemberUsers2(arrOfObjects) {
      const memberIds = arrOfObjects?.map(obj => obj.id) || [];
      return this.allUsers.filter(u => memberIds.includes(u.id));
    }
    ,
    getMemberUsers(memberIds) {
      if (!Array.isArray(memberIds)) return [];
      return this.allUsers.filter(u => memberIds.includes(u.id));
    }
    ,
    getKpiTypeName(typeId) {
      const type = this.kpiTypes.find(t => t.id === typeId);
      return type ? type.name : this.$t('kpi.Unknown');
    },

    getKpiTypeColor(typeId) {
      const colors = {
        strategic: 'primary',
        initiative: 'info',
        data_quality: 'warning',
        departmental: 'success'
      };
      return colors[typeId] || 'secondary';
    },

    getUnitSymbol(unitId) {
      if (!this.units || this.units.length === 0) return '';
      const unit = this.units.find(u => u.id === unitId);
      return unit ? unit.name : '';
    },

    getOwnerName(owner) {
      if (!owner) return this.$t('kpi.Unknown');

      if (owner.type === 'user') {
        if (!this.allUsers || this.allUsers.length === 0) return this.$t('kpi.Unknown');
        const user = this.allUsers.find(u => u.id === owner.id);
        return user ? user.full_name : this.$t('kpi.Unknown');
      } else if (owner.type === 'position') {
        if (!this.allPositions || this.allPositions.length === 0) return this.$t('kpi.Unknown');
        const position = this.allPositions.find(p => p.id === owner.id);
        return position ? position.name : this.$t('kpi.Unknown');
      }
      return this.$t('kpi.Unknown');
    },

    getUserName(userId) {
      if (!userId) return this.$t('kpi.Unknown');
      const user = this.allUsers.find(u => u.id === userId);
      return user ? user.full_name || user.name : this.$t('kpi.Unknown');
    },

    getObjectiveName(objectiveId) {
      const objective = this.objectives.find(o => o.id === objectiveId);
      return objective ? objective.name : this.$t('kpi.Unknown');
    },


    getInitiativeName(initiativeId) {
      const initiative = this.initiatives.find(i => i.id === initiativeId);
      return initiative ? initiative.name : this.$t('kpi.Unknown');
    },

    getDepartmentName(departmentId) {
      const department = this.departments.find(d => d.id === departmentId);
      return department ? department.name : this.$t('kpi.Unknown');
    },

    formatCollectionMethod(method) {
      switch (method) {
        case 'manual': return this.$t('kpi.manual');
        case 'automatic': return this.$t('kpi.automatic');
        case 'hybrid': return this.$t('kpi.hybrid');
        default: return method;
      }
    },

    formatFrequency(frequency) {
      switch (frequency) {
        case 'one time': return this.$t('kpi.one time');
        case 'daily': return this.$t('kpi.daily');
        case 'weekly': return this.$t('kpi.weekly');
        case 'monthly': return this.$t('kpi.monthly');
        case 'quarterly': return this.$t('kpi.quarterly');
        case 'yearly': return this.$t('kpi.yearly');
        default: return frequency;
      }
    },

    formatDate(date) {
      // if (!date) return this.$t('kpi.Unknown');
      // return new Date(date).toLocaleDateString();
      if (!date) return "N/A";
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "N/A";
        const day = d.getDate().toString().padStart(2, "0");
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const year = d.getFullYear();
        const hours = d.getHours() % 12 || 12;
        // const hours = d.getUTCHours() % 12 || 12;
        const minutes = d.getMinutes().toString().padStart(2, "0");
        // const minutes = d.getUTCMinutes().toString().padStart(2, "0");
        const ampm = d.getHours() >= 12 ? "PM" : "AM";
        // const ampm = d.getUTCHours() >= 12 ? "PM" : "AM";
        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
      } catch {
        return "N/A";
      }
    }
  }
};
</script>

<style scoped>
.kpi-details {
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.section-title {
  color: #6E3894;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 15px;
  font-size: 1rem;
  font-weight: 700;
}


.list-unstyled {
  padding-left: 0;
  list-style: none;
}

.list-unstyled li {
  padding: 4px 0;
  display: flex;
  align-items: center;
}

.list-unstyled li i {
  margin-right: 8px;
  width: 16px;
  text-align: center;
  color: #4361ee;
}

.badge {
  font-weight: 500;
  padding: 5px 10px;
}

.bg-primary {
  background-color: #4361ee !important;
}

.bg-success {
  background-color: #4cc9f0 !important;
}

.bg-info {
  background-color: #4895ef !important;
}

.bg-warning {
  background-color: #f72585 !important;
}

.text-muted {
  color: #6c757d !important;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.title-details {
  font-weight: 500;
  font-size: 14px;
  color: #8C8C8C;
}

.title-des {
  font-weight: 500;
  font-size: 14px;
  color: #000000;
}
.des{
  color: #000000 !important;
}
</style>