<template>
  <!-- Main Page component where the layout and page structure are set -->
  <main-page
    ref="page"
    :isFlipped="isFlipped"
    :mainPage="$t('kpisubmission.kpisubmission')"
    :subPage="$t('kpisubmission.kpisubmission')"
    :titlePage="$t('kpisubmission.kpisubmission')"
    v-permission:show
  >
    <div v-permission:update v-permission:delete></div>

    <!-- Slot for rendering the DataTable -->
    <template #datatable>
      <div class="container">
        <v-app>
          <!-- Custom Tabs Component -->
          <TabsComponent
            v-model="tab"
            :tabs="tabsConfig"
            @update:modelValue="changeTab"
          />

          <!-- Tab content -->
          <div class="tab-content">
            <!-- Details Tab -->
            <DataTable
              ref="table"
              id="example-table"
              :tableClass="'table table-striped table-bordered'"
              :columns="tableColumns"
              :api="api"
              :apiParams="apiParams"
              :editItem="editItem"
              :openForm="openForm"
              :hideActionsColumn="true"
              :hideAddNewButton="true"
              :hideActions="hideActions"
              v-permission:show
            >
              <template #kpisubmission.target_value="{ item }">
                {{ item.target_value }} {{ item.kpiunit?.name }}
              </template>
              <template #kpisubmission.SubmissionValue="{ item }">
                <span v-if="item.last_submission && !canSubmitKPI(item)"
                  >{{ item.last_submission?.calculated_result }}
                  {{ item.kpiunit?.name }}</span
                >
              </template>

              <template #addAction="{ item }" class="me-4">
                <div class="custom-dropdown">
                  <a
                    href="javascript:void(0)"
                    class="dropdown-item"
                    @click.prevent="openKpiSubmissionReAssignModal(item)"
                  >
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="path-1-outside-1_448_11459"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="17"
                        height="16"
                        fill="black"
                      >
                        <rect fill="white" width="17" height="16" />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.5 2.11999C6.29089 2.11999 4.50005 3.87502 4.50005 6.03997C4.50005 8.20491 6.29089 9.95994 8.5 9.95994C10.7091 9.95994 12.4999 8.20491 12.4999 6.03997C12.4999 3.87502 10.7091 2.11999 8.5 2.11999ZM3.35721 6.03997C3.35721 3.25647 5.65971 1 8.5 1C11.3403 1 13.6428 3.25647 13.6428 6.03997C13.6428 8.82346 11.3403 11.0799 8.5 11.0799C5.65971 11.0799 3.35721 8.82346 3.35721 6.03997Z"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.5 11.0799C7.19591 11.0799 5.91481 11.4157 4.78547 12.0548C3.65612 12.6939 2.71835 13.613 2.06641 14.7199C1.90864 14.9877 1.55917 15.0795 1.28585 14.9249C1.01253 14.7703 0.918857 14.4278 1.07663 14.16C1.82886 12.8828 2.91091 11.8223 4.214 11.0849C5.51708 10.3475 6.99529 9.95994 8.5 9.95994C10.0047 9.95994 11.4829 10.3475 12.786 11.0849C14.0891 11.8223 15.1711 12.8828 15.9234 14.16C16.0811 14.4278 15.9875 14.7703 15.7141 14.9249C15.4408 15.0795 15.0914 14.9877 14.9336 14.7199C14.2817 13.613 13.3439 12.6939 12.2145 12.0548C11.0852 11.4157 9.80409 11.0799 8.5 11.0799Z"
                        />
                      </mask>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.5 2.11999C6.29089 2.11999 4.50005 3.87502 4.50005 6.03997C4.50005 8.20491 6.29089 9.95994 8.5 9.95994C10.7091 9.95994 12.4999 8.20491 12.4999 6.03997C12.4999 3.87502 10.7091 2.11999 8.5 2.11999ZM3.35721 6.03997C3.35721 3.25647 5.65971 1 8.5 1C11.3403 1 13.6428 3.25647 13.6428 6.03997C13.6428 8.82346 11.3403 11.0799 8.5 11.0799C5.65971 11.0799 3.35721 8.82346 3.35721 6.03997Z"
                        fill="#404040"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.5 11.0799C7.19591 11.0799 5.91481 11.4157 4.78547 12.0548C3.65612 12.6939 2.71835 13.613 2.06641 14.7199C1.90864 14.9877 1.55917 15.0795 1.28585 14.9249C1.01253 14.7703 0.918857 14.4278 1.07663 14.16C1.82886 12.8828 2.91091 11.8223 4.214 11.0849C5.51708 10.3475 6.99529 9.95994 8.5 9.95994C10.0047 9.95994 11.4829 10.3475 12.786 11.0849C14.0891 11.8223 15.1711 12.8828 15.9234 14.16C16.0811 14.4278 15.9875 14.7703 15.7141 14.9249C15.4408 15.0795 15.0914 14.9877 14.9336 14.7199C14.2817 13.613 13.3439 12.6939 12.2145 12.0548C11.0852 11.4157 9.80409 11.0799 8.5 11.0799Z"
                        fill="#404040"
                      />
                      <path
                        d="M4.78547 12.0548L4.93321 12.3159L4.78547 12.0548ZM2.06641 14.7199L2.3249 14.8721V14.8721L2.06641 14.7199ZM1.28585 14.9249L1.43356 14.6638H1.43356L1.28585 14.9249ZM1.07663 14.16L0.818132 14.0077H0.818132L1.07663 14.16ZM4.214 11.0849L4.06625 10.8238L4.214 11.0849ZM12.786 11.0849L12.9337 10.8238L12.786 11.0849ZM15.9234 14.16L16.1819 14.0077L15.9234 14.16ZM15.7141 14.9249L15.5664 14.6638H15.5664L15.7141 14.9249ZM14.9336 14.7199L14.6751 14.8721L14.9336 14.7199ZM12.2145 12.0548L12.0668 12.3159H12.0668L12.2145 12.0548ZM4.50005 6.03997H4.80005C4.80005 4.04639 6.45083 2.41999 8.5 2.41999V2.11999V1.81999C6.13094 1.81999 4.20005 3.70366 4.20005 6.03997H4.50005ZM8.5 9.95994V9.65994C6.45083 9.65994 4.80005 8.03354 4.80005 6.03997H4.50005H4.20005C4.20005 8.37628 6.13094 10.2599 8.5 10.2599V9.95994ZM12.4999 6.03997H12.1999C12.1999 8.03354 10.5492 9.65994 8.5 9.65994V9.95994V10.2599C10.8691 10.2599 12.7999 8.37628 12.7999 6.03997H12.4999ZM8.5 2.11999V2.41999C10.5492 2.41999 12.1999 4.04639 12.1999 6.03997H12.4999H12.7999C12.7999 3.70366 10.8691 1.81999 8.5 1.81999V2.11999ZM8.5 1V0.7C5.49977 0.7 3.05721 3.0851 3.05721 6.03997H3.35721H3.65721C3.65721 3.42784 5.81966 1.3 8.5 1.3V1ZM13.6428 6.03997H13.9428C13.9428 3.0851 11.5002 0.7 8.5 0.7V1V1.3C11.1803 1.3 13.3428 3.42784 13.3428 6.03997H13.6428ZM8.5 11.0799V11.3799C11.5002 11.3799 13.9428 8.99483 13.9428 6.03997H13.6428H13.3428C13.3428 8.65209 11.1803 10.7799 8.5 10.7799V11.0799ZM3.35721 6.03997H3.05721C3.05721 8.99483 5.49977 11.3799 8.5 11.3799V11.0799V10.7799C5.81966 10.7799 3.65721 8.65209 3.65721 6.03997H3.35721ZM4.78547 12.0548L4.93321 12.3159C6.01717 11.7025 7.24733 11.3799 8.5 11.3799V11.0799V10.7799C7.1445 10.7799 5.81245 11.129 4.63772 11.7937L4.78547 12.0548ZM2.06641 14.7199L2.3249 14.8721C2.94983 13.8111 3.84921 12.9293 4.93321 12.3159L4.78547 12.0548L4.63772 11.7937C3.46304 12.4584 2.48686 13.4149 1.80791 14.5676L2.06641 14.7199ZM1.28585 14.9249L1.13814 15.186C1.55147 15.4198 2.08268 15.2834 2.3249 14.8721L2.06641 14.7199L1.80791 14.5676C1.7346 14.6921 1.56688 14.7392 1.43356 14.6638L1.28585 14.9249ZM1.07663 14.16L0.818132 14.0077C0.57375 14.4226 0.721382 14.9503 1.13814 15.186L1.28585 14.9249L1.43356 14.6638C1.30368 14.5903 1.26396 14.433 1.33512 14.3122L1.07663 14.16ZM4.214 11.0849L4.06625 10.8238C2.71783 11.5868 1.59738 12.6847 0.818132 14.0077L1.07663 14.16L1.33512 14.3122C2.06035 13.0809 3.104 12.0577 4.36174 11.346L4.214 11.0849ZM8.5 9.95994V9.65994C6.94386 9.65994 5.41471 10.0607 4.06625 10.8238L4.214 11.0849L4.36174 11.346C5.61946 10.6343 7.04671 10.2599 8.5 10.2599V9.95994ZM12.786 11.0849L12.9337 10.8238C11.5853 10.0607 10.0561 9.65994 8.5 9.65994V9.95994V10.2599C9.95329 10.2599 11.3805 10.6343 12.6383 11.346L12.786 11.0849ZM15.9234 14.16L16.1819 14.0077C15.4026 12.6847 14.2822 11.5868 12.9337 10.8238L12.786 11.0849L12.6383 11.346C13.896 12.0577 14.9397 13.0809 15.6649 14.3122L15.9234 14.16ZM15.7141 14.9249L15.8619 15.186C16.2786 14.9503 16.4262 14.4226 16.1819 14.0077L15.9234 14.16L15.6649 14.3122C15.736 14.433 15.6963 14.5903 15.5664 14.6638L15.7141 14.9249ZM14.9336 14.7199L14.6751 14.8721C14.9173 15.2834 15.4485 15.4198 15.8619 15.186L15.7141 14.9249L15.5664 14.6638C15.4331 14.7392 15.2654 14.6921 15.1921 14.5676L14.9336 14.7199ZM12.2145 12.0548L12.0668 12.3159C13.1508 12.9293 14.0502 13.8111 14.6751 14.8721L14.9336 14.7199L15.1921 14.5676C14.5131 13.4149 13.537 12.4584 12.3623 11.7937L12.2145 12.0548ZM8.5 11.0799V11.3799C9.75267 11.3799 10.9828 11.7025 12.0668 12.3159L12.2145 12.0548L12.3623 11.7937C11.1876 11.129 9.8555 10.7799 8.5 10.7799V11.0799Z"
                        fill="#404040"
                        mask="url(#path-1-outside-1_448_11459)"
                      />
                    </svg>
                    <span>{{ $t("kpisubmission.ReAssign Submission") }}</span>
                  </a>

                  <a
                    href="javascript:void(0)"
                    class="dropdown-item"
                    v-if="canSubmitKPI(item)"
                    @click.prevent="openKpiSubmissionValueModal(item)"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.1111 1L15 4.88889L4.88889 15H1V11.1111L11.1111 1Z"
                        stroke="#404040"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span>{{ $t("kpisubmission.Submission Value") }}</span>
                  </a>

                  <a
                    href="javascript:void(0)"
                    class="dropdown-item"
                    v-if="item.kpi_submissions.length > 0"
                    @click.prevent="openKpiSubmissionValueDetailsModal(item)"
                  >
                    <svg
                      width="24"
                      height="16"
                      viewBox="0 0 24 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 8C1 8 5 1 12 1C19 1 23 8 23 8C23 8 19 15 12 15C5 15 1 8 1 8Z"
                        stroke="#404040"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 10.625C13.6569 10.625 15 9.44975 15 8C15 6.55025 13.6569 5.375 12 5.375C10.3431 5.375 9 6.55025 9 8C9 9.44975 10.3431 10.625 12 10.625Z"
                        stroke="#404040"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <span>{{ $t("kpisubmission.View Submission") }}</span>
                  </a>
                </div>
              </template>
            </DataTable>
          </div>
        </v-app>
      </div>
    </template>

    <!-- Slot for rendering the form -->
    <template #form>
      <Form
        :schema="fromFields"
        :newItem="newItem"
        :api="api"
        :closeForm="closeForm"
        :formData="true"
      >
      </Form>
    </template>
  </main-page>
  <!-- SubmissionValueModal -->
  <v-dialog v-model="kpiSubmissionValueModal.show" max-width="600">
    <v-card class="kpi-modal-card" style="background: #f5f5f5">
      <!-- Header -->
      <v-card-title class="modal-header">
        <span class="modal-title">Edit Assessment</span>
        <div class="cursor" @click="closeKpiSubmissionValueModal">
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
        <!-- Formula Display Section -->
        <div v-if="displayFormula" class="formula-section">
          <div class="section-label">Formula</div>
          <div class="formula-display">
            {{ displayFormula }}
          </div>
        </div>

        <v-form ref="form" lazy-validation>
          <div class="card p-4 mb-0">
            <!-- Manual Variables Section -->
            <template v-if="formulaVariables.length > 0">
              <div class="section-label">Manual Variable</div>

              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  v-for="(variable, index) in formulaVariables"
                  :key="variable.id"
                >
                  <label class="field-label">
                    {{ variable.name }} Value<span class="required-star">*</span>
                  </label>
                  <v-text-field
                    type="number"
                    v-model="form.variable_values[index].value"
                    variant="outlined"
                    density="compact"
                    placeholder="5"
                    required
                    @input="updateCalculation"
                    :rules="[(v) => !!v || $t('kpisubmission.This field is required')]"
                    class="custom-text-field"
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
              </v-row>
            </template>

            <!-- Automatic Variables Section -->
            <template v-if="automaticVariables.length > 0">
              <div class="section-label">Automatic Variables</div>

              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  v-for="(variable, index) in automaticVariables"
                  :key="variable._id"
                >
                  <label class="field-label">
                    {{ variable.name }}
                    <span class="function-tag">({{ variable.function }})</span>
                  </label>
                  <v-text-field
                    type="text"
                    v-model="form.automatic_variable_values[index].value"
                    readonly
                    variant="outlined"
                    density="compact"
                    :loading="
                      form.automatic_variable_values[index].value === 'Loading...'
                    "
                    class="custom-text-field readonly-field"
                    hide-details="auto"
                  ></v-text-field>
                </v-col>
              </v-row>
            </template>

            <!-- Hidden fields -->
            <div style="display: none">
              <input type="date" v-model="form.submission_date" required />
              <input type="text" v-model="form.current_period_target" />
            </div>

            <!-- Assessment Comment -->
            <div class="mt-3">
              <label class="field-label"
                >Assessment Comment<span class="required-star">*</span></label
              >
              <v-textarea
                v-model="form.submission_comment"
                variant="outlined"
                rows="4"
                placeholder="Enter your assessment comment here"
                class="custom-textarea"
                hide-details="auto"
              ></v-textarea>
            </div>
          </div>
        </v-form>
      </v-card-text>
      <!-- Footer Actions -->
      <v-card-actions class="modal-actions">
        <buttom class="cancel-btn" @click="closeKpiSubmissionValueModal"> Cancel </buttom>
        <buttom
          class="save-btn"
          :disabled="!form.submission_date || !areVariablesValid || isCalculating"
          @click="setKpiSubmissionValue"
          :loading="isSubmitting"
          v-permission:insert
        >
          Save
        </buttom>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Start Kpi Submission Value Details Modal -->
  <v-dialog
    v-model="kpiSubmissionValueDetailsModal.show"
    max-width="600"
    content-class="kpi-details-modal"
  >
    <v-card class="rounded-lg">
      <!-- Header -->
      <div class="text-title py-2 px-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <span class="font-weight-bold black--text">
            {{ $t("kpisubmission.KPI Last Submission Details") }}
          </span>
          <v-chip
            :color="getStatusColor(kpiSubmissionValueDetailsModal?.currentItem?.status)"
            text-color="white"
            small
            class="ml-3"
          >
            {{ kpiSubmissionValueDetailsModal?.currentItem?.status }}
          </v-chip>
        </div>
        <buttom @click="closeKpiSubmissionValueDetailsModal">
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
        </buttom>
      </div>

      <!-- Content -->
      <v-card-text class="text-card" style="max-height: 100vh; overflow-y: auto">
        <!-- Top Stats Row -->
        <v-row>
          <!-- Current Period Target -->
          <v-col
            cols="6"
            v-if="kpiSubmissionValueDetailsModal?.currentItem?.current_period_target"
          >
            <v-card flat class="text-center pa-4 grey lighten-4 rounded-lg">
              <div class="text-caption mb-1">
                {{ $t("kpisubmission.Current Period Target") }}
              </div>
              <div class="text-h5 font-weight-bold main-color">
                {{ kpiSubmissionValueDetailsModal?.currentItem?.current_period_target }}
              </div>
            </v-card>
          </v-col>

          <!-- Calculated Result -->
          <v-col
            cols="6"
            v-if="kpiSubmissionValueDetailsModal?.currentItem?.calculated_result"
          >
            <v-card flat class="text-center pa-4 grey lighten-4 rounded-lg">
              <div class="text-caption mb-1">
                {{ $t("kpisubmission.Calculated Result") }}
              </div>
              <div class="text-h5 font-weight-bold main-color">
                {{ kpiSubmissionValueDetailsModal?.currentItem?.calculated_result }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Created By & Assessment Date -->
        <v-row class="mb-2">
          <v-col cols="6" v-if="kpiSubmissionValueDetailsModal?.currentItem?.created_by">
            <v-card flat class="text-center pa-4 grey lighten-4 rounded-lg">
              <div class="text-caption mb-1">
                {{ $t("kpisubmission.Submission Creator") }}
              </div>
              <div class="text-body-1 font-weight-medium black--text">
                {{
                  getSubmitterName(
                    kpiSubmissionValueDetailsModal?.currentItem?.created_by
                  )
                }}
              </div>
            </v-card>
          </v-col>

          <v-col
            cols="6"
            v-if="kpiSubmissionValueDetailsModal?.currentItem?.submission_date"
          >
            <v-card flat class="text-center pa-4 grey lighten-4 rounded-lg">
              <div class="text-caption mb-1">
                {{ $t("kpisubmission.Submission Date") }}
              </div>
              <div class="text-body-1 font-weight-medium black--text">
                {{
                  formatDate(kpiSubmissionValueDetailsModal?.currentItem?.submission_date)
                }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Manual Variable Values -->
        <div
          v-if="kpiSubmissionValueDetailsModal?.currentItem?.variable_values?.length > 0"
          class="mb-2 card p-3"
        >
          <div class="text-subtitle-1 font-weight-bold black--text mb-3">
            {{ $t("kpisubmission.Manual Variable Values") }}
          </div>

          <v-card flat class="grey lighten-5 rounded-lg overflow-hidden">
            <div
              v-if="
                kpiSubmissionValueDetailsModal?.currentItem?.variable_values?.length > 0
              "
              style="max-height: 200px; overflow-y: auto"
            >
              <v-simple-table dense>
                <template v-slot:default>
                  <table class="table align-middle table-hover border custom-table">
                    <thead>
                      <tr class="grey lighten-3">
                        <th class="text-left font-weight-bold">
                          {{ $t("kpisubmission.name") }}
                        </th>
                        <th class="text-left font-weight-bold">
                          {{ $t("kpisubmission.value") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in kpiSubmissionValueDetailsModal
                          ?.currentItem?.variable_values"
                        :key="index"
                      >
                        <td>{{ item.name }}</td>
                        <td class="font-weight-medium">{{ item.value }}</td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </v-simple-table>
            </div>

            <div v-else class="text-center pa-4 grey--text">
              {{ $t("kpisubmission.No variable values available") }}
            </div>
          </v-card>
        </div>

        <!-- Automatic Variable Values -->
        <div
          v-if="
            kpiSubmissionValueDetailsModal?.currentItem?.automatic_variable_values
              ?.length > 0
          "
          class="mb-2 card p-3"
        >
          <div class="text-subtitle-1 font-weight-bold black--text mb-2">
            {{ $t("kpisubmission.Automatic Variable Values") }}
          </div>

          <v-card flat class="grey lighten-5 rounded-lg overflow-hidden">
            <div
              v-if="
                kpiSubmissionValueDetailsModal?.currentItem?.automatic_variable_values
                  ?.length > 0
              "
              style="max-height: 300px; overflow-y: auto"
            >
              <v-simple-table dense>
                <template v-slot:default>
                  <table class="table align-middle table-hover border custom-table">
                    <thead class="table-light">
                      <tr class="grey lighten-3">
                        <th class="text-left font-weight-bold">
                          {{ $t("kpisubmission.name") }}
                        </th>
                        <th class="text-left font-weight-bold">
                          {{ $t("kpisubmission.value") }}
                        </th>
                        <th class="text-left font-weight-bold">
                          {{ $t("kpisubmission.model") }}
                        </th>
                        <th class="text-left font-weight-bold">
                          {{ $t("kpisubmission.column") }}
                        </th>
                        <th class="text-left font-weight-bold">
                          {{ $t("kpisubmission.function") }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in kpiSubmissionValueDetailsModal
                          ?.currentItem?.automatic_variable_values"
                        :key="index"
                      >
                        <td>{{ item.name }}</td>
                        <td class="font-weight-medium">{{ item.value }}</td>
                        <td>{{ item.model }}</td>
                        <td>{{ item.column }}</td>
                        <td>{{ item.function }}</td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </v-simple-table>
            </div>

            <div v-else class="text-center pa-4 grey--text">
              {{ $t("kpisubmission.No automatic variable values available") }}
            </div>
          </v-card>
        </div>

        <!-- Submission Comment -->
        <div
          v-if="kpiSubmissionValueDetailsModal?.currentItem?.submission_comment"
          class="mb-4"
        >
          <v-card flat class="grey lighten-4 rounded-lg pa-4">
            <div class="text-caption mb-2">
              {{ $t("kpisubmission.Submission Comment") }}
            </div>
            <div class="text-body-2 black--text">
              {{
                kpiSubmissionValueDetailsModal?.currentItem?.submission_comment ||
                $t("kpisubmission.No comment provided")
              }}
            </div>
          </v-card>
        </div>

        <!-- Reviewer Info -->
        <div v-if="kpiSubmissionValueDetailsModal?.currentItem?.reviewed_by">
          <v-card flat class="grey lighten-4 rounded-lg pa-4">
            <div class="text-caption mb-2">
              {{ $t("kpisubmission.Reviewer") }}
            </div>
            <div class="text-body-2 black--text mb-3">
              {{
                getSubmitterName(kpiSubmissionValueDetailsModal?.currentItem?.reviewed_by)
              }}
            </div>

            <!-- Reviewer Comment -->
            <div v-if="kpiSubmissionValueDetailsModal?.currentItem?.reviewer_comment">
              <div class="text-caption mb-2">
                {{ $t("kpisubmission.Reviewer Comment") }}
              </div>
              <div class="text-body-2 black--text">
                {{
                  kpiSubmissionValueDetailsModal?.currentItem?.reviewer_comment ||
                  $t("kpisubmission.No comment provided")
                }}
              </div>
            </div>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <!-- End Kpi Submission Value Details Modal -->

  <!-- Start Kpi Submission ReAssign Modal -->
  <v-dialog v-model="kpiSubmissionReAssignModal.show" width="400">
    <div class="card p-4 bg-modal">
      <div class="mb-2">
        <div class="d-flex justify-content-between align-items-center">
          <p class="mb-0 fw-bolder text-black">
            {{ $t("kpisubmission.Submission ReAssign") }}
          </p>
          <div class="cursor" @click="closeKpiSubmissionReAssignModal">
            <v-icon left>mdi-close</v-icon>
          </div>
        </div>
      </div>

      <div class="card-body">
        <!-- Select User -->
        <v-form ref="reassignForm" lazy-validation>
          <label class="text-body-2 font-weight-medium mb-2 d-block" style="color404040;">
            {{ $t("kpisubmission.Select User") }}
          </label>
          <UserSelect
            v-model="reassignForm.reAssign_id"
            :api-params="{ filter: `department_id|${getDepartmentId()}|=` }"
            :multiple="false"
            :placeholder="$t('kpisubmission.Select User')"
            :disabled="isSubmitting"
            @update:modelValue="handleUserSelection"
            class="user-select-wrapper"
          />
        </v-form>
      </div>

      <!-- Fixed buttons at the bot#fffffftom -->
      <div class="d-flex justify-content-end align-items-center mt-2">
        <buttom class="btn-cancel" @click="closeKpiSubmissionReAssignModal">
          {{ $t("kpisubmission.Cancel") }}
        </buttom>
        <buttom
          :disabled="!reassignForm.reAssign_id"
          @click="reAssign(kpiSubmissionReAssignModal.currentItem?.id)"
          :loading="isSubmitting"
          class="btn-save ms-2"
          v-permission:reAssign
        >
          {{ $t("kpisubmission.Save") }}
        </buttom>
      </div>
    </div>
  </v-dialog>
  <!-- End Kpi Submission ReAssign Modal -->
</template>

<script>
// Importing necessary components and API modules
import kpisubmission from "@/modules/kpi/API/KPISubmission/KPISubmission";
import Form from "@/components/Form.vue";
import MainPage from "@/components/MainPage.vue";
import DataTable from "@/components/DataTable.vue";
import TabsComponent from "@/components/TabsComponent.vue"; // Import the new tabs component
import formulaVariable from "@/modules/kpi/API/FormulaVariable/FormulaVariable";
import objective from "@/API/StrategicPlan/Objective/Objective";
import initiative from "@/API/StrategicPlan/Initiative/Initiative";
import domain from "@/API/Domain/Domain";
import user from "@/API/User/User";
import Swal from "sweetalert2";
import Auth from "@/API/Auth";
import UserSelect from "@/components/UserSelect.vue";
export default {
  components: {
    MainPage,
    Form,
    DataTable,
    TabsComponent, // Register the tabs component
    UserSelect,
  },

  setup() {
    const USER_ID = Auth.USER.id;
    const Department_id = Auth.USER.department_id;
    const api = new kpisubmission();
    const apiParams = {
      filter: `collection_method|automatic|!=&&active_status|1-boolean|=`,
      filterOr: `reAssign_id|${USER_ID}|=`,
      with: "kpiSubmissions",
    };
    const tableColumns = [];
    const fromFields = [];
    const formulaVariableApi = new formulaVariable();
    const objectiveApi = new objective();
    const initiativeApi = new initiative();
    const domainApi = new domain();
    const userApi = new user();

    return {
      api,
      apiParams,
      tableColumns,
      fromFields,
      formulaVariableApi,
      objectiveApi,
      initiativeApi,
      domainApi,
      userApi,
    };
  },

  data() {
    return {
      isFlipped: false,
      isReadonly: false,
      newItem: {},
      users: [],
      tab: "linked_users",
      filterObjectiveIds: [],
      filterInitiativeIds: [],
      filterDomainIds: [],
      kpiSubmissionValueDetailsModal: {
        show: false,
        currentItem: null,
      },
      kpiSubmissionValueModal: {
        show: false,
        currentItem: null,
      },
      automaticVariables: [],
      form: {
        submission_date: "",
        current_period_target: "",
        submission_comment: "",
        variable_values: [],
        automatic_variable_values: [],
        formula_parts_request: [],
      },
      formulaVariables: [],
      displayFormula: "",
      calculationResult: null,
      isCalculating: false,
      isSubmitting: false,
      formulaParts: [],
      kpiSubmissionReAssignModal: {
        show: false,
        currentItem: null,
      },
      reassignForm: {
        reAssign_id: null,
        kpi_id: null,
      },
      isLoadingUsers: false,
      isSubmittingReassign: false,
    };
  },

  computed: {
    hideActions() {
      return (row) => ({
        edit: true,
        delete: true,
        allActions: false,
      });
    },
    // Configuration for tabs
    tabsConfig() {
      return [
        { id: "reAssignee", label: this.$t("kpisubmission.reAssignee") },
        { id: "linked_users", label: this.$t("kpisubmission.linked_users") },
        { id: "department", label: this.$t("kpisubmission.departments") },
        { id: "objectives", label: this.$t("kpisubmission.objectives") },
        { id: "initiatives", label: this.$t("kpisubmission.initiatives") },
        { id: "domains", label: this.$t("kpisubmission.domains") },
        // { id: "datasets", label: this.$t("kpisubmission.datasets") },
      ];
    },

    USER_ID() {
      return Auth.USER.id;
    },

    Department_id() {
      return Auth.USER.department_id;
    },
    areVariablesValid() {
      if (this.formulaVariables.length === 0) return true;
      return this.form.variable_values.every(
        (item) => item.value !== "" && item.value !== null
      );
    },

    calculationDisplay() {
      if (this.isCalculating) {
        return this.$t("kpisubmission.Calculating...");
      }
      if (this.calculationResult === null || this.calculationResult === undefined) {
        return this.$t("kpisubmission.Pending calculation");
      }
      if (
        typeof this.calculationResult === "string" &&
        this.calculationResult.includes("Error")
      ) {
        return this.calculationResult;
      }
      if (this.calculationResult === "Invalid calculation") {
        return this.$t("kpisubmission.Invalid calculation");
      }
      return parseFloat(this.calculationResult).toFixed(2);
    },

    calculationResultClass() {
      if (this.isCalculating) {
        return this.$t("kpisubmission.calculation-pending");
      }
      if (this.calculationResult === null) {
        return this.$t("kpisubmission.calculation-pending");
      }
      if (
        typeof this.calculationResult === "string" &&
        this.calculationResult.includes("Error")
      ) {
        return this.$t("kpisubmission.calculation-error");
      }
      return this.$t("kpisubmission.calculation-result");
    },

    duplicateVariableGroups() {
      const groups = {};
      const formulaParts = this.formulaParts || [];
      formulaParts.forEach((part) => {
        if (part.type === "variable" && part.variable?.type !== "automatic") {
          const variable = part.variable;
          const key = variable._id || variable.id || variable.name;

          if (!groups[key]) {
            groups[key] = {
              variable: variable,
              occurrences: [],
            };
          }
          groups[key].occurrences.push(part);
        }
      });
      return groups;
    },

    uniqueManualVariables() {
      const uniqueVars = [];
      const seen = new Set();
      const formulaParts = this.formulaParts || [];
      formulaParts.forEach((part) => {
        if (part.type === "variable" && part.variable?.type !== "automatic") {
          const variable = part.variable;
          const key = variable._id || variable.id || variable.name;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueVars.push({
              ...variable,
              isFirstOccurrence: true,
              occurrenceCount: this.duplicateVariableGroups[key]?.occurrences.length || 1,
            });
          }
        }
      });
      return uniqueVars;
    },
  },

  async mounted() {
    const USER_ID = Auth.USER.id;
    const USER_TEAMS = Auth.USER.team_ids || [];
    this.users = await this.userApi.getAll({ select: "id|full_name" });

    const owner_team_ids = USER_TEAMS.map((teamId) => `owner_team_ids|${teamId}`).join(
      "||"
    );
    const allInitiatives = await this.initiativeApi.getAll({
      select: "id|owner_user_ids|owner_team_ids",
      filterOr: `owner_user_ids|${USER_ID}||${owner_team_ids}`,
    });
    this.filterInitiativeIds = allInitiatives.map((initiative) => initiative.id);

    const allObjectives = await this.objectiveApi.getAll({
      select: "id|initiative_ids",
      filterIn: `initiative_ids|${this.filterInitiativeIds.join(",")}`,
    });
    this.filterObjectiveIds = allObjectives.map((objective) => objective.id);

    const allDomains = await this.domainApi.getAll({
      select: "id|owner_users_ids",
      filter: `owner_users_ids|${USER_ID}`,
    });
    this.filterDomainIds = allDomains.map((domain) => domain.id);

    this.applyTabFilter();
  },

  created() {
    this.tableColumns = [
      {
        id: "kpisubmission.name",
        title: this.$t("kpisubmission.name"),
        data: "name",
        defaultContent: "N/A",
      },
      {
        id: "kpisubmission.target_value",
        title: this.$t("kpisubmission.target_value"),
        data: "target_value",
        defaultContent: "N/A",
      },
      {
        id: "kpisubmission.SubmissionValue",
        title: this.$t("kpisubmission.SubmissionValue"),
        data: "",
        defaultContent: "N/A",
      },
      {
        id: "kpisubmission.collection_method",
        title: this.$t("kpisubmission.collection_method"),
        data: "collection_method",
        defaultContent: "N/A",
      },
      {
        id: "kpisubmission.method",
        title: this.$t("kpisubmission.method"),
        data: "method",
        defaultContent: "N/A",
      },
      {
        id: "kpisubmission.frequency",
        title: this.$t("kpisubmission.frequency"),
        data: "frequency",
        defaultContent: "N/A",
      },
    ];

    this.fromFields = [
      {
        name: "actual_value",
        label: this.$t("kpisubmission.actual_value"),
        type: "text", // Text input field
        rules: "required", // Validation rule: required field
        description: this.$t("kpisubmission.Enter the actual value for the KPI"),
        col: 6, // Column size in the form layout
      },
      {
        name: "submission_date",
        label: this.$t("kpisubmission.submission_date"),
        type: "date",
        rules: "required",
        description: this.$t("kpisubmission.Enter the submission date"),
        col: 6,
      },
      {
        name: "submission_comment",
        label: this.$t("kpisubmission.submission_comment"),
        type: "textarea", // Multi-line text field
        rules: "", // Validation rule: required field
        description: this.$t("kpisubmission.Enter a description for the submission"),
        col: 12,
      },
    ];
  },

  methods: {
    openForm() {
      this.isFlipped = true;
    },

    getDepartmentId() {
      return Auth.USER.department_id;
    },
    closeForm() {
      this.isFlipped = false;
      this.$refs.table.refreshTable();
      this.newItem = {};
    },

    changeTab(tabId) {
      this.tab = tabId;
      this.applyTabFilter();
      this.$refs.table.refreshTable();
    },

    async applyTabFilter() {
      const USER_ID = Auth.USER.id;
      const Department_id = Auth.USER.department_id;
      const isManager = Auth.USER.is_manager;
      let filter = `collection_method|automatic|!=&&active_status|1-boolean|=`;
      let filterOr = ``;
      let filterIn = ``;

      if (this.tab === "linked_users") {
        filterOr = `linked_users|${USER_ID}`;
      } else if (this.tab === "department") {
        if (isManager === true) {
          filterOr = `departments|${Department_id}`;
        } else {
          filter = `id|impossible_value_that_never_exists|=`;
          filterOr = ``;
        }
      } else if (this.tab === "objectives") {
        filterOr = `objectives|${this.filterObjectiveIds.join(",")}`;
      } else if (this.tab === "initiatives") {
        filterOr = `initiatives|${this.filterInitiativeIds.join(",")}`;
      } else if (this.tab === "domains") {
        filterOr = `domains|${this.filterDomainIds.join(",")}`;
      } else if (this.tab === "datasets") {
        // filterOr = `datasets|${this.filterDatasetsIds.join(",")}`;
      } else if (this.tab === "reAssignee") {
        filterOr = `reAssign_id|${USER_ID}`;
      }
      this.apiParams.filter = filter;
      this.apiParams.filterOr = filterOr;
      this.apiParams.filterIn = filterIn;
    },

    async fetchFormulaVariablesData(formulaParts) {
      const variableIds = formulaParts
        .filter((part) => part.type === "variable" && part.variable)
        .map((part) =>
          typeof part.variable === "string"
            ? part.variable
            : part.variable._id || part.variable.id
        );

      if (!variableIds.length) return [];

      try {
        const variables = await this.formulaVariableApi.getAll({
          filterIn: `id|${variableIds.join(",")}`,
        });
        return variables;
      } catch (error) {
        console.error("Error fetching formula variables data:", error);
        return [];
      }
    },

    async openKpiSubmissionValueDetailsModal(item) {
      this.kpiSubmissionValueDetailsModal.currentItem = item.last_submission;
      this.kpiSubmissionValueDetailsModal.show = true;
    },

    closeKpiSubmissionValueDetailsModal() {
      this.kpiSubmissionValueDetailsModal.show = false;
      this.kpiSubmissionValueDetailsModal.currentItem = null;
    },

    async openKpiSubmissionValueModal(item) {
      this.kpiSubmissionValueModal.currentItem = item;
      this.kpiSubmissionValueModal.show = true;

      this.resetForm();

      try {
        let formulaParts = item.formulaParts || [];
        const variablesData = await this.fetchFormulaVariablesData(formulaParts);

        formulaParts = formulaParts.map((part) => {
          if (part.type === "variable" && part.variable) {
            const varId =
              typeof part.variable === "string"
                ? part.variable
                : part.variable._id || part.variable.id;
            const variableData = variablesData.find(
              (v) => v._id === varId || v.id === varId
            );
            return {
              ...part,
              variable: variableData || part.variable,
            };
          }
          return part;
        });

        this.formulaParts = formulaParts;
        this.buildDisplayFormula({ ...item, formulaParts });
        this.processAutomaticVariables({ ...item, formulaParts });
        this.processManualVariables({ ...item, formulaParts });

        // انتظار تحميل القيم التلقائية ثم حساب النتيجة
        await this.fetchAutomaticVariableValues();

        // تأكد من حساب النتيجة بعد تحميل كل البيانات
        await this.$nextTick();
        this.updateCalculation();
      } catch (error) {
        console.error("Error opening KPI submission modal:", error);
        this.calculationResult = "Error loading variables: " + error.message;
      }
    },

    async openKpiSubmissionReAssignModal(item) {
      this.kpiSubmissionReAssignModal.currentItem = item;
      this.kpiSubmissionReAssignModal.show = true;
      this.reassignForm = {
        reAssign_id: item?.reAssign_id ?? null,
        kpi_id: item.id || item._id,
      };
    },

    closeKpiSubmissionReAssignModal() {
      this.kpiSubmissionReAssignModal.currentItem = null;
      this.kpiSubmissionReAssignModal.show = false;
    },

    userFilter(item, queryText, itemText) {
      const searchText = queryText.toLowerCase();
      const userName = item.full_name?.toLowerCase() || "";
      const userEmail = item.email?.toLowerCase() || "";
      return userName.includes(searchText) || userEmail.includes(searchText);
    },

    async reAssign(kpi_id) {
      const data = {
        reAssign_id: this.reassignForm.reAssign_id,
      };
      const response = await this.api
        .reAssign(kpi_id, data)
        .then((response) => {
          this.$refs.table.refreshTable();
          this.closeKpiSubmissionReAssignModal();
          this.api.poup(response, "reAssign Set Successfully");
        })
        .catch((error) => {
          this.api.poup(
            { status: false, message: "An error occurred while reAssign" },
            "Error"
          );
        });
    },

    getSubmitterName(userId) {
      if (userId === "system-auto") {
        return "system-auto";
      }

      if (!userId) {
        return this.$t("kpireviewer.Unknown");
      }
      const user = this.users.find((u) => u.id === userId);
      return user ? user.full_name : this.$t("kpisubmission.Unknown");
    },

    resetForm() {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const time = now.toTimeString().slice(0, 5);
      const dateTime = `${today}T${time}`;

      this.form = {
        kpi_id:
          this.kpiSubmissionValueModal.currentItem?._id ||
          this.kpiSubmissionValueModal.currentItem?.id ||
          "",
        submission_date: dateTime,
        current_period_target:
          this.kpiSubmissionValueModal.currentItem?.current_period_target || "",
        submission_comment: "",
        variable_values: [],
        automatic_variable_values: [],
        formula_parts_request: [],
      };

      this.calculationResult = null;
      this.isCalculating = false;
      this.formulaParts = this.kpiSubmissionValueModal.currentItem?.formulaParts || [];
      this.displayFormula = "";
    },

    processAutomaticVariables(item) {
      if (!item.formulaParts) return;

      this.automaticVariables = item.formulaParts
        .filter((part) => part.type === "variable" && part.variable?.type === "automatic")
        .map((part) => part.variable);

      this.form.automatic_variable_values = this.automaticVariables.map((variable) => ({
        id: variable._id || variable.id,
        name: variable.name,
        value: "Loading...",
        model: variable.module || null,
        column: variable.fillable || null,
        function: variable.function || null,
      }));

      this.form.formula_parts_request = this.automaticVariables.map((variable) => ({
        model: variable.module || null,
        column: variable.fillable || null,
        function: variable.function || null,
      }));
    },

    processManualVariables(item) {
      if (!item.formulaParts) return;
      const uniqueManualVariables = this.uniqueManualVariables;
      if (uniqueManualVariables.length > 0) {
        this.formulaVariables = uniqueManualVariables;
        this.form.variable_values = uniqueManualVariables.map((variable) => ({
          id: variable._id || variable.id,
          name: variable.name,
          value: "",
          isFirstOccurrence: true,
          occurrenceCount: variable.occurrenceCount,
        }));
      }
    },

    buildDisplayFormula(item) {
      const formulaParts = item.formulaParts || this.formulaParts || [];
      console.log("formulaParts ", formulaParts);
      if (!formulaParts.length) {
        this.displayFormula =
          item.formula || this.$t("kpisubmission.No formula available");
        return;
      }

      let displayParts = [];
      formulaParts.forEach((part) => {
        if (part.type === "variable" && part.variable) {
          const variable = part.variable;
          if (variable.type === "automatic") {
            displayParts.push(`${variable.name}(${variable.function})`);
          } else {
            displayParts.push(variable.name);
          }
        } else if (part.type === "operator" || part.type === "parenthesis") {
          displayParts.push(` ${part.value} `);
        }
      });

      this.displayFormula = displayParts.join("");
    },

    closeKpiSubmissionValueModal() {
      this.kpiSubmissionValueModal.show = false;
      this.kpiSubmissionValueModal.currentItem = null;

      this.form = {
        kpi_id: "",
        submission_date: "",
        current_period_target: "",
        submission_comment: "",
        variable_values: [],
        automatic_variable_values: [],
        formula_parts_request: [],
      };

      this.formulaVariables = [];
      this.automaticVariables = [];
      this.displayFormula = "";
      this.calculationResult = null;
      this.isCalculating = false;
      this.isSubmitting = false;
      this.formulaParts = [];
    },

    setupCalculationWatchers() {
      this.$watch(
        () => this.form.variable_values.map((v) => v.value),
        (newValues) => {
          if (newValues.every((v) => v !== "" && v !== null)) {
            this.updateCalculation();
          }
        },
        { deep: true }
      );

      this.$watch(
        () => this.form.automatic_variable_values.map((v) => v.value),
        (newValues) => {
          if (!newValues.some((v) => v === "Loading...")) {
            this.updateCalculation();
          }
        },
        { deep: true }
      );
    },

    async fetchAutomaticVariableValues() {
      try {
        if (this.form.formula_parts_request.length === 0) {
          this.updateCalculation(); // حساب فوري إذا لم توجد متغيرات تلقائية
          return;
        }

        const pathType = "kPISERVICE";
        const response = await this.formulaVariableApi.calculateAggregates(
          this.form.formula_parts_request,
          pathType
        );

        const results = response.data?.data || response.data || [];

        this.form.automatic_variable_values = this.form.automatic_variable_values.map(
          (variable, index) => {
            const result = results[index];
            const value = result?.result ?? result?.error ?? "N/A";
            return {
              ...variable,
              value: value,
            };
          }
        );

        // تحديث الحساب فور تحميل القيم التلقائية
        this.updateCalculation();
      } catch (error) {
        console.error("Error fetching automatic variables:", error);
        this.form.automatic_variable_values = this.form.automatic_variable_values.map(
          (v) => ({
            ...v,
            value: error.message || "Error loading value",
          })
        );
        this.updateCalculation();
      }
    },

    safeEval(expression) {
      // Remove any potentially dangerous characters
      const cleanExpr = expression.replace(/[^0-9+\-*/(). ]/g, "");
      return Function(`"use strict"; return (${cleanExpr})`)();
    },

    canSubmitKPI(item) {
      const isNotSubmitted = item.has_submitted === false;
      const isRejected = item.last_submission?.status === "rejected";
      const submissionCondition = isNotSubmitted || isRejected;
      // Case 1: If reassigned, user must be the assigned user AND submission condition must be true
      if (item.reAssign_id) {
        return item.reAssign_id === Auth.USER.id && submissionCondition;
      }
      // Case 2: If not reassigned, only submission condition needs to be true
      return submissionCondition;
    },

    async setKpiSubmissionValue() {
      // تأكد من أن الحساب تم تحديثه قبل فتح Swal
      await this.updateCalculation();

      // تحقق من أن هناك نتيجة صالحة
      if (
        this.calculationResult === null ||
        this.calculationResult === "Pending calculation"
      ) {
        Swal.fire({
          icon: "error",
          title: "Calculation Error",
          text: "Please wait for the calculation to complete or fill all required fields",
        });
        return;
      }

      const result = await Swal.fire({
        title: "Are you sure?",
        html: `
      <p>You are about to set actual value for this KPI!</p>
      <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin: 10px 0;">
        <strong>Calculated Result: ${this.calculationDisplay}</strong>
      </div>
      <div style="margin-top: 10px; font-size: 14px; color: #666;">
        Formula: ${this.displayFormula || "N/A"}
      </div>
    `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, set it!",
        cancelButtonText: "No, cancel!",
      });

      if (result.isConfirmed) {
        this.isSubmitting = true;

        const data = {
          kpi_id: this.kpiSubmissionValueModal.currentItem.id,
          variable_values: this.form.variable_values,
          automatic_variable_values: this.form.automatic_variable_values,
          formula_parts_request: this.form.formula_parts_request,
          submission_date: this.form.submission_date,
          current_period_target: this.form.current_period_target,
          submission_comment: this.form.submission_comment,
          calculated_result: this.calculationResult,
          created_by: Auth.USER.id,
          status: "pending",
        };

        try {
          const response = await this.api.setKpiSubmissionValue(data);
          this.$refs.table.refreshTable();
          Swal.fire(
            this.$t("kpisubmission.success"),
            this.$t("kpisubmission.KPI Submission Set Successfully"),
            "success"
          );
          this.closeKpiSubmissionValueModal();
        } catch (error) {
          console.error("Submission error:", error);
          Swal.fire(
            this.$t("kpisubmission.Error"),
            this.$t("kpisubmission.Error submitting KPI value"),
            "error"
          );
        } finally {
          this.isSubmitting = false;
        }
      }
    },

    async fetchAutomaticVariableValues() {
      try {
        if (this.form.formula_parts_request.length === 0) return;

        // Set loading state
        this.form.automatic_variable_values = this.form.automatic_variable_values.map(
          (v) => ({
            ...v,
            value: "Loading...",
          })
        );

        const pathType = "kPISERVICE";
        const response = await this.formulaVariableApi.calculateAggregates(
          this.form.formula_parts_request,
          pathType
        );

        if (response.data && Array.isArray(response.data)) {
          this.processAggregateResults(response.data);
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          this.processAggregateResults(response.data.data);
        } else {
          throw new Error("Invalid response format from server");
        }

        this.updateCalculation();
      } catch (error) {
        console.error("Error fetching automatic variable values:", error);
        this.handleAggregateError(error);
      }
    },

    processAggregateResults(results) {
      this.form.automatic_variable_values = this.form.automatic_variable_values.map(
        (variable, index) => {
          const result = results[index];
          if (!result) {
            return {
              ...variable,
              value: "No result",
            };
          }

          return {
            ...variable,
            value: result.result ?? result.error ?? "N/A",
          };
        }
      );
    },

    async updateCalculation() {
      const hasEmptyManualVariables = this.form.variable_values.some(
        (v) => v.value === "" || v.value === null || isNaN(v.value)
      );

      if (hasEmptyManualVariables && this.form.variable_values.length > 0) {
        this.calculationResult = this.$t(
          "kpisubmission.Please fill all manual variables"
        );
        return;
      }

      if (this.form.automatic_variable_values.some((v) => v.value === "Loading...")) {
        this.calculationResult = this.$t("kpisubmission.Waiting for automatic variables");
        return;
      }

      this.isCalculating = true;

      try {
        let calculationExpression = "";
        const formulaParts =
          this.formulaParts ||
          this.kpiSubmissionValueModal.currentItem?.formulaParts ||
          [];

        if (formulaParts.length === 0) {
          if (this.kpiSubmissionValueModal.currentItem?.formula) {
            calculationExpression = this.kpiSubmissionValueModal.currentItem.formula;
          } else {
            this.calculationResult = this.$t("kpisubmission.No formula available");
            this.isCalculating = false;
            return;
          }
        } else {
          for (const part of formulaParts) {
            if (part.type === "variable" && part.variable) {
              const variable = part.variable;
              let variableValue = 0;

              if (variable.type === "automatic") {
                const autoVar = this.form.automatic_variable_values.find(
                  (v) =>
                    v.id === (variable._id || variable.id) || v.name === variable.name
                );
                variableValue = autoVar ? parseFloat(autoVar.value) || 0 : 0;
              } else {
                const variableKey = variable._id || variable.id || variable.name;
                const manualVar = this.form.variable_values.find(
                  (v) => v.id === variableKey
                );
                variableValue = manualVar ? parseFloat(manualVar.value) || 0 : 0;
              }

              calculationExpression += variableValue;
            } else if (part.type === "operator" || part.type === "parenthesis") {
              calculationExpression += ` ${part.value} `;
            } else if (part.type === "number") {
              calculationExpression += part.value;
            }
          }
        }

        console.log("Final calculation expression:", calculationExpression);

        if (calculationExpression.trim()) {
          try {
            const result = this.safeEval(calculationExpression);
            this.calculationResult = isNaN(result) ? "Invalid calculation" : result;
            console.log("Calculation result:", this.calculationResult);
          } catch (evalError) {
            console.error("Calculation error:", evalError);
            this.calculationResult = "Error in calculation: " + evalError.message;
          }
        } else {
          this.calculationResult = this.$t("kpisubmission.Empty calculation expression");
        }
      } catch (error) {
        console.error("Calculation error:", error);
        this.calculationResult = "Error calculating result: " + error.message;
      } finally {
        this.isCalculating = false;
      }
    },

    safeEval(expression) {
      const allowedOperators = ["+", "-", "*", "/", "(", ")", ".", " "];

      const cleanExpr = expression
        .split("")
        .filter((c) => {
          return !isNaN(c) || allowedOperators.includes(c);
        })
        .join("");

      try {
        return new Function(`return (${cleanExpr})`)();
      } catch (error) {
        console.error("Safe eval error:", error);
        throw new Error("Invalid calculation expression");
      }
    },

    canSubmitKPI(item) {
      const isNotSubmitted = item.has_submitted === false;
      const isRejected = item.last_submission?.status === "rejected";
      const submissionCondition = isNotSubmitted || isRejected;

      if (item.reAssign_id) {
        return item.reAssign_id === Auth.USER.id && submissionCondition;
      }
      return submissionCondition;
    },

    async setKpiSubmissionValue() {
      this.kpiSubmissionValueModal.show = false;

      const itemId = this.kpiSubmissionValueModal.currentItem.id;

      const result = await Swal.fire({
        title: "Are you sure?",
        html: `
          <p>You are about to set actual value for this KPI!</p>
          <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin: 10px 0;">
            <strong>${this.calculationDisplay}</strong>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, set it!",
        cancelButtonText: "No, cancel!",
      });

      if (result.isConfirmed) {
        this.isSubmitting = true;

        const data = {
          kpi_id: itemId,
          variable_values: this.form.variable_values,
          automatic_variable_values: this.form.automatic_variable_values,
          formula_parts_request: this.form.formula_parts_request,
          submission_date: this.form.submission_date,
          current_period_target: this.form.current_period_target,
          submission_comment: this.form.submission_comment,
          calculated_result: this.calculationResult,
          created_by: Auth.USER.id,
          status: "pending",
        };

        try {
          const response = await this.api.setKpiSubmissionValue(data);
          this.$refs.table.refreshTable();
          Swal.fire(
            this.$t("kpisubmission.success"),
            this.$t("kpisubmission.KPI Submission Set Successfully"),
            "success"
          );
          this.closeKpiSubmissionValueModal();
        } catch (error) {
          console.error("Submission error:", error);
          Swal.fire(
            this.$t("kpisubmission.Error"),
            this.$t("kpisubmission.Error submitting KPI value"),
            "error"
          );
        } finally {
          this.isSubmitting = false;
        }
      } else {
        this.kpiSubmissionValueModal.show = true;
      }
    },

    handleAggregateError(error) {
      this.form.automatic_variable_values = this.form.automatic_variable_values.map(
        (v) => ({
          ...v,
          value: error.message || "Error loading value",
        })
      );

      Swal.fire({
        icon: "error",
        title: this.$t("kpisubmission.Error"),
        text: this.$t("kpisubmission.Error fetching automatic variables"),
        footer: error.message || this.$t("kpisubmission.Please try again later"),
      });
    },

    formatDate(date) {
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
        return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
      } catch {
        return "N/A";
      }
    },

    getStatusColor(status) {
      if (!status) return "primary";
      const statusColors = {
        approved: "success",
        pending: "warning",
        rejected: "error",
        submitted: "info",
        draft: "grey",
      };

      return statusColors[status.toLowerCase()] || "primary";
    },

    isVariableDisabled(variable) {
      const variableKey = variable._id || variable.id || variable.name;
      const uniqueVar = this.form.variable_values.find((v) => v.id === variableKey);
      return !uniqueVar?.isFirstOccurrence;
    },

    getDuplicateVariableValue(variable) {
      const variableKey = variable._id || variable.id || variable.name;
      const uniqueVar = this.form.variable_values.find((v) => v.id === variableKey);
      return uniqueVar ? uniqueVar.value : "";
    },
  },

  watch: {
    tab: {
      immediate: true,
      handler(newTab) {
        this.applyTabFilter();
      },
    },

    "form.variable_values": {
      handler(newValues) {
        if (newValues.every((v) => v.value !== "" && v.value !== null)) {
          this.$nextTick(() => {
            this.updateCalculation();
          });
        }
      },
      deep: true,
    },

    "form.automatic_variable_values": {
      handler(newValues) {
        if (!newValues.some((v) => v.value === "Loading...")) {
          this.$nextTick(() => {
            this.updateCalculation();
          });
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
/* Tab content styling */
.tab-content {
  min-height: auto;
  height: auto;
}

.tab-panel {
  height: auto;
  min-height: auto;
  display: block;
}

.tab-panel {
  transition: opacity 0.2s ease-in-out;
}

.container {
  height: auto;
  min-height: auto;
}

.formula-variable {
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}
.kpi-details-modal .v-card {
  overflow: hidden;
  background: #fff;
}

.primary-gradient {
  background: linear-gradient(135deg, #1976d2, #0d47a1);
}

.info-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #f9f9f9;
}

.info-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  transform: translateY(-2px);
}

.comment-text {
  min-height: 40px;
  white-space: pre-line;
}

.actions-bg {
  background-color: #f5f5f5;
}

.v-simple-table {
  background-color: transparent !important;
  border-radius: 4px;
  overflow: hidden;
}

.v-simple-table th {
  background-color: rgba(25, 118, 210, 0.05);
  font-weight: bold;
}

.v-simple-table tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.02);
}

.v-simple-table tr:hover {
  background-color: rgba(25, 118, 210, 0.05);
}

.variable-table {
  border-radius: 8px;
  overflow: hidden;
}

.variable-table /deep/ th {
  background-color: rgba(25, 118, 210, 0.05) !important;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.variable-row:hover {
  background-color: rgba(25, 118, 210, 0.03) !important;
}

.variable-row td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
  padding: 12px 16px !important;
}

.variable-row:last-child td {
  border-bottom: none !important;
}

.formula-display-card {
  border: 2px solid rgba(25, 118, 210, 0.2);
  border-radius: 12px !important;
}

.formula-container {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #1976d2;
}

.formula-code {
  background-color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
  display: inline-block;
  min-width: 100%;
  text-align: center;
}

.formula-text {
  text-align: center;
}

.formula-calculation {
  text-align: center;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.variable-label {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 4px;
  display: inline-block;
}

.function-badge {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.calculation-loading {
  color: #ff9800 !important;
}

.calculation-result {
  color: #4caf50 !important;
}

.calculation-error {
  color: #f44336 !important;
}

.calculation-pending {
  color: #757575 !important;
}
.btn-cancel {
  border: 1px solid #6e3894;
  border-radius: 10px;
  padding: 0 24px;
  font-size: 14px;
  color: #43235c;
  font-weight: 500;
  cursor: pointer;
}
.btn-save {
  background: #6e3894;
  border: 1px solid #6e3894;
  border-radius: 10px;
  padding: 0 24px;
  font-size: 14px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
}
.bg-modal {
  background: #f5f5f5;
}

:deep(.custom-select .v-field) {
  border-radius: 40px !important;
  min-height: 20px !important;
}
:deep(.custom-select .v-field__input) {
  min-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.v-field__input:focus, .v-field__input:active) {
  border: 1px solid red;
}

.card .card-body {
  padding: 18px;
  background-color: #fff;
  border-radius: 10px;
}

:deep(.custom-select .v-icon.mdi-menu-down) {
  display: none !important;
}
.cursor {
  cursor: pointer;
}
.custom-card-text {
  color: #8c8c8c;
  font-size: 12px;
  font-weight: 500;
}
.customsub-text {
  color: #6e3894;
  font-size: 20px;
  font-weight: 700;
}
.customsub2-text {
  color: #404040;
  font-size: 14px;
  font-weight: 500;
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
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #000;
}
.modal-content {
  padding: 0 15px !important;
}

.formula-section {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 8px;
}

.section-label {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.formula-display {
  background-color: #ffffff;
  border: 1.5px solid #f5f5f5;
  border-radius: 10px;
  padding: 12px 16px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 14px;
  color: #000;
  text-align: start;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #404040 !important;
  margin-bottom: 8px;
  display: block;
}

.required-star {
  color: #dc2626;
  margin-left: 2px;
}

.function-tag {
  font-size: 11px;
  color: #6366f1;
  font-weight: 500;
  background-color: #eef2ff;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 4px;
}

:deep(.custom-text-field .v-field) {
  border-radius: 8px !important;
  background-color: #ffffff;
}

:deep(.custom-text-field .v-field__input) {
  padding: 10px 14px;
  font-size: 14px;
  min-height: 40px !important;
}

:deep(.custom-text-field.readonly-field .v-field) {
  background-color: #f9fafb;
}

:deep(.custom-textarea .v-field) {
  border-radius: 8px !important;
}

:deep(.custom-textarea .v-field__input) {
  padding: 12px 14px;
  font-size: 14px;
}

.modal-actions {
  padding: 12px 24px !important;
}

.cancel-btn {
  border: 1px solid #6e3894 !important;
  color: #43235c !important;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 24px !important;
  border-radius: 10px !important;
}

.save-btn {
  background: #6e3894 !important;
  color: #ffffff !important;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 24px !important;
  border-radius: 10px !important;
}

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
.custom-dropdown {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #fff;
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 270px;
}

.custom-dropdown .dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  color: #444;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.custom-dropdown .dropdown-item {
  background-color: #f8f5ff;
  border-radius: 10px;
  color: #404040;
  font-weight: 500;
}
.custom-dropdown .dropdown-item:focus {
  border-color: 2px solid #6e3894;
}
.table-actions .dropdown-menu {
  margin-inline: -8px;
}
.dropdown-menu li:first-child .dropdown-item:focus {
  border-top: 2px solid #6e3894;
}
:deep(.v-field__input:focus) {
  border: 0px solid transparent;
}

.text-card,
.text-title {
  background: #f5f5f5;
}
.v-dialog > .v-overlay__content > .v-card > .v-card-text,
.v-dialog > .v-overlay__content > form > .v-card > .v-card-text {
  padding: 0px 14px 24px;
}
.main-color {
  color: #6e3894;
}
.text-caption {
  font-size: 12px;
  font-weight: 500;
  color: #8c8c8c;
}
.custom-table {
  border-radius: 10px;
  overflow: hidden;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fff;
}
.figma-tabs-center {
  overflow: overlay;
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
