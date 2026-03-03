<template>
  <!-- Main Page component where the layout and page structure are set -->
  <main-page
    ref="page"
    :isFlipped="isFlipped"
    :mainPage="$t('kpireviewer.kpireviewer')"
    :subPage="$t('kpireviewer.kpireviewer')"
    :titlePage="$t('kpireviewer.kpireviewer')"
  >
    <!-- Slot for rendering the DataTable -->
    <template #datatable>
      <div class="container">
        <v-app>
          <DataTable
            ref="table"
            id="kpi-reviewer-table"
            :tableClass="'table table-striped table-bordered'"
            :columns="tableColumns"
            :api="api"
            :apiParams="apiParams"
            :editItem="editItem"
            :openForm="openForm"
            :hideAddNewButton="true"
            :hideActionsColumn="true"
            :hideActions="hideActions"
            v-permission:show
          >
            <template #kpireviewer.kpiName="{ item }">
              {{ item.kpi?.name || "" }}
            </template>

            <template #kpireviewer.kpiCollectionMethod="{ item }">
              {{ item.kpi?.collection_method || "" }}
            </template>

            <template #kpireviewer.target_value="{ item }">
              {{ item.kpi?.target_value }} {{ item.kpiunit?.name || "" }}
            </template>

            <template #kpireviewer.submitted_value="{ item }">
              {{ item.actual_value }} {{ item.kpiunit?.name || "" }}
            </template>

            <template #kpireviewer.submission_date="{ item }">
              {{ formatDate(item.submission_date) }}
            </template>

            <template #kpireviewer.submitter="{ item }">
              {{ getSubmitterName(item.created_by) }}
            </template>

            <template #kpireviewer.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" dark small>
                {{ getStatusName(item.status) }}
              </v-chip>
            </template>

            <template #addAction="{ item }">
              <a
                href="javascript:void(0)"
                class="dropdown-item"
                v-if="item.status === 'pending'"
                @click.prevent="openReviewModal(item, 'approved')"
                v-permission:updateSubmissionStatus
              >
                <i class="icofont icofont-check text-success"></i> {{ $t('kpireviewer.Approve') }}
              </a>
              <a
                href="javascript:void(0)"
                class="dropdown-item"
                v-if="item.status === 'pending'"
                @click.prevent="openReviewModal(item, 'rejected')"
                v-permission:updateSubmissionStatus
              >
                <i class="icofont icofont-close text-danger"></i> {{ $t('kpireviewer.Reject') }}
              </a>
              <a
                href="javascript:void(0)"
                class="dropdown-item"
                @click.prevent="openKpiSubmissionValueDetailsModal(item)"
              >
                <i class="icofont icofont-eye text-info"></i> {{ $t('kpireviewer.View') }}
              </a>
            </template>
          </DataTable>
        </v-app>
      </div>
    </template>
  </main-page>

  <!-- Review Modal -->
  <v-dialog v-model="reviewModal.show" max-width="700" content-class="kpi-details-modal">
    <div class="card p-4 bg-modal overflow-auto">
      <!-- Header with close button -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex justify-content-start align-items-center">
          <p class="mb-0 fw-bolder text-black">
            {{
              reviewModal.action === "approved"
                ?  $t('kpireviewer.Approve Submission') 
                :  $t('kpireviewer.Reject Submission')
            }}
          </p>
          <div class="mt-1 ms-2">
            <v-chip 
              :color="getStatusColor(reviewModal.item?.status)" 
              text-color="white" 
              small 
              class="text-capitalize"
            >
              {{ reviewModal.item?.status }}
            </v-chip>
          </div>
        </div>
        <div class="cursor" @click="reviewModal.show = false">
          <v-icon left>mdi-close</v-icon>
        </div>
      </div>

      <!-- Content section -->
      <v-card-text class="overflow-auto">
        <v-form ref="reviewForm">
          <v-row>
            <!-- KPI Name -->
            <v-col cols="12" sm="6">
              <v-card flat class="pa-3 info-card">
                <div class="d-flex flex-column align-center justify-content-center">
                  <p class="custom-card-text mb-0">
                    {{ $t('kpireviewer.kpi') }}
                  </p>
                  <p class="customsub2-text mt-1 mb-0">
                    {{ reviewModal.item?.kpi?.name }}
                  </p>
                </div>
              </v-card>
            </v-col>

            <!-- Target Value -->
            <v-col cols="12" sm="6">
              <v-card flat class="pa-3 info-card">
                <div class="d-flex flex-column align-center justify-content-center">
                  <p class="custom-card-text mb-0">
                    {{ $t('kpireviewer.Target') }}
                  </p>
                  <p class="customsub-text mt-1 mb-0">
                    {{ reviewModal.item?.kpi?.target_value }}
                    {{ reviewModal.item?.kpi?.kpiunit?.name }}
                  </p>
                </div>
              </v-card>
            </v-col>

            <!-- Submitter -->
            <v-col cols="12" sm="6">
              <v-card flat class="pa-3 info-card">
                <div class="d-flex flex-column align-center justify-content-center">
                  <p class="custom-card-text mb-0">
                    {{ $t('kpireviewer.Submitter') }}
                  </p>
                  <p class="customsub2-text mt-1 mb-0">
                    {{ getSubmitterName(reviewModal.item?.created_by) }}
                  </p>
                </div>
              </v-card>
            </v-col>

            <!-- Submission Date -->
            <v-col cols="12" sm="6">
              <v-card flat class="pa-3 info-card">
                <div class="d-flex flex-column align-center justify-content-center">
                  <p class="custom-card-text mb-0">
                    {{ $t('kpireviewer.Submission Date') }}
                  </p>
                  <p class="customsub2-text mt-1 mb-0">
                    {{ formatDate(reviewModal.item?.submission_date) }}
                  </p>
                </div>
              </v-card>
            </v-col>

            <!-- Formula -->
            <v-col cols="12" v-if="reviewModal.item?.kpi?.formulaParts">
              <v-card flat class="pa-3 info-card">
                <div class="d-flex">
                  <div class="flex-grow-1">
                    <div class="text-subtitle-1 font-weight-bold primary--text">
                      {{ $t('kpireviewer.Formula') }}
                    </div>
                    <div class="text-body-1 mt-1 comment-text">
                      <code class="formula-code">
                        {{ buildDisplayFormula(reviewModal.item.kpi?.formulaParts) }}
                      </code>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Result -->
            <v-col cols="12" sm="6" v-if="reviewModal.item?.kpi?.formulaParts && reviewModal.item?.variable_values">
              <v-card flat class="pa-3 info-card">
                <div class="d-flex flex-column align-center justify-content-center">
                  <p class="custom-card-text mb-0">
                    {{ $t('kpireviewer.Result') }}
                  </p>
                  <p class="customsub-text mt-1 mb-0">
                    {{ reviewModal.item?.calculated_result }}
                  </p>
                </div>
              </v-card>
            </v-col>

            <!-- Current Period Target -->
            <v-col cols="12" sm="6" v-if="reviewModal.item?.current_period_target">
              <v-card flat class="pa-3 info-card">
                <div class="d-flex flex-column align-center justify-content-center">
                  <p class="custom-card-text mb-0">
                    {{ $t('kpireviewer.Current Period Target') }}
                  </p>
                  <p class="customsub-text mt-1 mb-0">
                    {{ reviewModal.item?.current_period_target }}
                  </p>
                </div>
              </v-card>
            </v-col>

            <!-- Submission Comment -->
            <v-col cols="12" v-if="reviewModal.item?.submission_comment">
              <v-card flat class="pa-3 info-card">
                <div class="d-flex">
                  <div class="flex-grow-1">
                    <div class="text-subtitle-1 font-weight-bold primary--text">
                      {{ $t('kpireviewer.Submitter Comment') }}
                    </div>
                    <div class="text-body-1 mt-1 comment-text">
                      {{ reviewModal.item?.submission_comment }}
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Manual Variable Values -->
            <v-col v-if="reviewModal.item?.variable_values && reviewModal.item?.variable_values.length > 0" class="mb-3 w-100">
              <v-card flat class="pa-3 info-card">
                <div>
                  <div class="section-title mb-2" style="font-size: 14px; font-weight: 500; color: #000;">
                    {{ $t('kpireviewer.Variable Values') }}
                  </div>
                  
                  <div class="table-responsive" style="max-height: 200px; overflow-y: auto; border: 1px solid lightgray; border-radius: 10px;">
                    <table class="table table-sm" style="font-size: 12px; margin-bottom: 0;">
                      <thead style="position: sticky; top: 0; z-index: 1;">
                        <tr>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.name') }}
                          </th>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.value') }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(v, index) in reviewModal.item?.variable_values" :key="index">
                          <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">
                            {{ getVariableNameByIdSync(v.id) || v.name || v.id }}
                          </td>
                          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">
                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                              {{ v.value }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Automatic Variable Values -->
            <v-col v-if="reviewModal.item?.automatic_variable_values && reviewModal.item?.automatic_variable_values.length > 0" class="mb-3 w-100">
              <v-card flat class="pa-3 info-card">
                <div>
                  <div class="section-title mb-2" style="font-size: 14px; font-weight: 500; color: #000;">
                    {{ $t('kpireviewer.Automatic Variable Values') }}
                  </div>
                  
                  <div class="table-responsive" style="max-height: 200px; overflow-y: auto; border: 1px solid lightgray; border-radius: 10px;">
                    <table class="table table-sm" style="font-size: 12px; margin-bottom: 0;">
                      <thead style="position: sticky; top: 0; z-index: 1;">
                        <tr>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.name') }}
                          </th>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.value') }}
                          </th>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.model') }}
                          </th>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.column') }}
                          </th>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.function') }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in reviewModal.item?.automatic_variable_values" :key="index">
                          <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">
                            {{ item.name }}
                          </td>
                          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">
                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                              {{ item.value }}
                            </span>
                          </td>
                          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">
                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                              {{ item.model }}
                            </span>
                          </td>
                          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">
                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                              {{ item.column }}
                            </span>
                          </td>
                          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">
                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                              {{ item.function }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- Review Comment Input -->
            <v-col cols="12">
              <v-card flat class="pa-3 info-card">
                <v-textarea
                  v-model="reviewModal.comment"
                  :label="
                    reviewModal.action === 'approved'
                      ? $t('kpireviewer.Approval Comment (Optional)')
                      : $t('kpireviewer.Rejection Reason')
                  "
                  :rules="
                    reviewModal.action === 'rejected'
                      ? [(v) => !!v || 'Reason is required']
                      : []
                  "
                  outlined
                  rows="3"
                ></v-textarea>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <!-- Footer Actions -->
      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn  class="figma-button figma-button-cancel" @click="reviewModal.show = false">{{ $t('kpireviewer.close') }}</v-btn>
        <v-btn
          @click="submitReview"
          class="figma-button figma-button-save"
          :disabled="reviewModal.action === 'rejected' && !reviewModal.comment"
          v-permission:store
        >
          {{ reviewModal.action === "approved" ? $t('kpireviewer.approve'): $t('kpireviewer.reject') }}
        </v-btn>
      </v-card-actions>
    </div>
  </v-dialog>

  <!-- Start Kpi Submission Value Details Modal -->
  <v-dialog v-model="kpiSubmissionValueDetailsModal.show" max-width="700" content-class="kpi-details-modal">
    <div class="card p-4 bg-modal overflow-auto">
      <!-- Header with close button -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex justify-content-start align-items-center">
          <p class="mb-0 fw-bolder text-black">{{ $t('kpireviewer.KPI Submission Value Details') }}</p>
          <div class="mt-1 ms-2">
            <v-chip 
              :color="getStatusColor(kpiSubmissionValueDetailsModal?.currentItem?.status)" 
              text-color="white" 
              small 
              class="text-capitalize"
            >
              {{ kpiSubmissionValueDetailsModal?.currentItem?.status }}
            </v-chip>
          </div>
        </div>
        <div class="cursor" @click="closeKpiSubmissionValueDetailsModal">
          <v-icon left>mdi-close</v-icon>
        </div>
      </div>

      <!-- Content section -->
      <v-card-text class="overflow-auto">
        <v-row>

        <!-- Current Period Target -->
          <v-col cols="12" sm="6" v-if="kpiSubmissionValueDetailsModal?.currentItem?.current_period_target">
            <v-card flat class="pa-3 info-card">
              <div class="d-flex flex-column align-center justify-content-center">
                <p class="custom-card-text mb-0">
                  {{ $t('kpisubmission.Current Period Target') }}
                </p>
                <p class="customsub-text mt-1 mb-0">
                  {{ kpiSubmissionValueDetailsModal?.currentItem?.current_period_target }}
                </p>
              </div>
            </v-card>
          </v-col>

          <!-- Calculated Result -->
          <v-col cols="12" sm="6" v-if="kpiSubmissionValueDetailsModal?.currentItem?.calculated_result">
            <v-card flat class="pa-3 info-card">
              <div class="d-flex flex-column align-center justify-content-center">
                <p class="custom-card-text mb-0">
                  {{ $t('kpisubmission.Calculated Result') }}
                </p>
                <p class="customsub-text mt-1 mb-0">
                  {{ kpiSubmissionValueDetailsModal?.currentItem?.calculated_result }}
                </p>
              </div>
            </v-card>
          </v-col>
          <!-- Submission Date -->
          <v-col cols="12" sm="6" v-if="kpiSubmissionValueDetailsModal?.currentItem?.submission_date">
            <v-card flat class="pa-3 info-card">
              <div class="d-flex flex-column align-center justify-content-center">
                <p class="custom-card-text mb-0">
                  {{ $t('kpireviewer.Submission Date') }}
                </p>
                <p class="customsub2-text mt-1 mb-0">
                  {{ formatDate(kpiSubmissionValueDetailsModal?.currentItem?.submission_date) }}
                </p>
              </div>
            </v-card>
          </v-col>

          <!-- Submitted By -->
          <v-col cols="12" sm="6" v-if="kpiSubmissionValueDetailsModal?.currentItem?.created_by">
            <v-card flat class="pa-3 info-card">
              <div class="d-flex flex-column align-center justify-content-center">
                <p class="custom-card-text mb-0">
                  {{ $t('kpireviewer.Submitted By') }}
                </p>
                <p class="customsub2-text mt-1 mb-0">
                  {{ getSubmitterName(kpiSubmissionValueDetailsModal?.currentItem?.created_by) }}
                </p>
              </div>
            </v-card>
          </v-col>

       

          

          <!-- Formula -->
          <v-col cols="12" v-if="formulaPartsWithData && formulaPartsWithData.length">
            <v-card flat class="pa-3 info-card">
              <div class="d-flex">
                <div class="flex-grow-1">
                  <div class="text-subtitle-1 font-weight-bold primary--text">
                    {{ $t('kpireviewer.Formula') }}
                  </div>
                  <div class="text-body-1 mt-1 comment-text">
                    <code class="formula-code">
                      {{ buildDisplayFormula(formulaPartsWithData) }}
                    </code>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Submission Comment -->
          <v-col cols="12" v-if="kpiSubmissionValueDetailsModal?.currentItem?.submission_comment">
            <v-card flat class="pa-3 info-card">
              <div class="d-flex">
                <div class="flex-grow-1">
                  <div class="text-subtitle-1 font-weight-bold primary--text">
                    {{ $t('kpireviewer.Submitter Comment') }}
                  </div>
                  <div class="text-body-1 mt-1 comment-text">
                    {{ kpiSubmissionValueDetailsModal?.currentItem?.submission_comment || $t('kpireviewer.No comment provided') }}
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Manual Variable Values -->
          <v-col cols="12" v-if="kpiSubmissionValueDetailsModal?.currentItem?.variable_values && kpiSubmissionValueDetailsModal?.currentItem?.variable_values.length > 0" class="mb-3 w-100">
            <v-card flat class="pa-3 info-card">
              <div>
                <div class="section-title mb-2" style="font-size: 14px; font-weight: 500; color: #000;">
                  {{ $t('kpisubmission.Manual Variable Values') }}
                </div>
                
                <div v-if="kpiSubmissionValueDetailsModal?.currentItem?.variable_values && kpiSubmissionValueDetailsModal?.currentItem?.variable_values.length > 0">
                  <div class="table-responsive" style="max-height: 200px; overflow-y: auto; border: 1px solid lightgray; border-radius: 10px;">
                    <table class="table table-sm" style="font-size: 12px; margin-bottom: 0;">
                      <thead style="position: sticky; top: 0; z-index: 1;">
                        <tr>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.name') }}
                          </th>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.value') }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in kpiSubmissionValueDetailsModal?.currentItem?.variable_values" :key="index">
                          <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">
                            {{ item.name }}
                          </td>
                          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">
                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                              {{ item.value }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <!-- <div v-else class="text-center py-3 text-muted" style="font-size: 12px; color: #999;">
                  {{ $t('kpireviewer.No variable values available') }}
                </div> -->
              </div>
            </v-card>
          </v-col>

          <!-- Automatic Variable Values -->
          <v-col cols="12" v-if="reviewModal.item?.automatic_variable_values && reviewModal.item?.automatic_variable_values.length > 0" class="mb-3 w-100">
            <v-card flat class="pa-3 info-card">
              <div>
                <div class="section-title mb-2" style="font-size: 14px; font-weight: 500; color: #000;">
                  {{ $t('kpireviewer.Automatic Variable Values') }}
                </div>
                
                <div v-if="kpiSubmissionValueDetailsModal?.currentItem?.automatic_variable_values && kpiSubmissionValueDetailsModal?.currentItem?.automatic_variable_values.length > 0">
                  <div class="table-responsive" style="max-height: 200px; overflow-y: auto; border: 1px solid lightgray; border-radius: 10px;">
                    <table class="table table-sm" style="font-size: 12px; margin-bottom: 0;">
                      <thead style="position: sticky; top: 0; z-index: 1;">
                        <tr>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.name') }}
                          </th>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.value') }}
                          </th>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.model') }}
                          </th>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.column') }}
                          </th>
                          <th style="background: #F5F5F5; padding: 8px 12px; font-weight: 600; color: #666; border-bottom: 1px solid #dee2e6;">
                            {{ $t('kpireviewer.function') }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in kpiSubmissionValueDetailsModal?.currentItem?.automatic_variable_values" :key="index">
                          <td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #f0f0f0;">
                            {{ item.name }}
                          </td>
                          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">
                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                              {{ item.value }}
                            </span>
                          </td>
                          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">
                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                              {{ item.model }}
                            </span>
                          </td>
                          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">
                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                              {{ item.column }}
                            </span>
                          </td>
                          <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">
                            <span style="padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500;">
                              {{ item.function }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <!-- <div v-else class="text-center py-3 text-muted" style="font-size: 12px; color: #999;">
                  {{ $t('kpireviewer.No automatic variable values available') }}
                </div> -->
              </div>
            </v-card>
          </v-col>

          <!-- Reviewer -->
          <v-col cols="12" sm="6" v-if="kpiSubmissionValueDetailsModal?.currentItem?.reviewed_by">
            <v-card flat class="pa-3 info-card">
              <div class="d-flex flex-column align-center justify-content-center">
                <p class="custom-card-text mb-0">
                  {{ $t('kpireviewer.Reviewer') }}
                </p>
                <p class="customsub2-text mt-1 mb-0">
                  {{ getSubmitterName(kpiSubmissionValueDetailsModal?.currentItem?.reviewed_by) }}
                </p>
              </div>
            </v-card>
          </v-col>

          <!-- Reviewer Comment -->
          <v-col cols="12" v-if="kpiSubmissionValueDetailsModal?.currentItem?.reviewer_comment">
            <v-card flat class="pa-3 info-card">
              <div class="d-flex">
                <div class="flex-grow-1">
                  <div class="text-subtitle-1 font-weight-bold primary--text">
                    {{ $t('kpireviewer.Reviewer Comment') }}
                  </div>
                  <div class="text-body-1 mt-1 comment-text">
                    {{ kpiSubmissionValueDetailsModal?.currentItem?.reviewer_comment || $t('kpireviewer.No comment provided') }}
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
  </v-dialog>
  <!-- End Kpi Submission Value Details Modal -->
</template>


<script>
import kpireviewer from "@/modules/kpi/API/KPIReviwer/KPIReviwer";
import Form from "@/components/Form.vue";
import MainPage from "@/components/MainPage.vue";
import DataTable from "@/components/DataTable.vue";
import Auth from "@/API/Auth";
import Swal from "sweetalert2";
import usersApi from "@/API/User/User";
import formulaVariableApi from "@/modules/kpi/API/FormulaVariable/FormulaVariable";

export default {
  components: {
    MainPage,
    Form,
    DataTable,
  },

  setup() {
    const api = new kpireviewer();
    const apiParams = {
      // filter: `reviewers|${Auth.USER.id}`
      // filterWhereRelation: `kpi@reviewers|=${Auth.USER.id}`,
      filterWhereRelation: [`kpi@reviewers|${Auth.USER.id}|=&&kpi@active_status|0-boolean|!=`],
      with: ["kpi"],
    };

    return {
      api,
      apiParams,
    };
  },

  data() {
    return {
      isFlipped: false,
      formulaVariablesData: [], // بيانات المتغيرات بعد جلبها من الـ API
      formulaPartsWithData: [],
      newItem: {},
      tableColumns: [],
      variableCache: {},
      users: [],
      reviewModal: {
        show: false,
        item: null,
        action: "approved",
        comment: "",
      },
      kpiSubmissionValueDetailsModal: {
        show: false,
        currentItem: null,
      },
    };
  },

  async mounted() {
    this.users = await new usersApi().getAll({ select: "id|full_name" });
    this.$refs.table.refreshTable();
  },
computed: {
    hideActions() {
      return (row) => ({
        edit: true,
        delete: true,
        allActions: false,
      });
    },
  },
  created() {
    this.tableColumns = [
      { 
        id: "kpireviewer.kpiName",
        title: this.$t("kpireviewer.kpiName"),
        data: "",
        defaultContent: this.$t('kpireviewer.Unknown'),
      },
      {
        id: "kpireviewer.kpiCollectionMethod",
        title: this.$t("kpireviewer.kpiCollectionMethod"),
        data: "",
        defaultContent: this.$t('kpireviewer.Unknown'),
      },
      { 
        id: "kpireviewer.target_value",
        title: this.$t("kpireviewer.target_value"),
        data: "",
        defaultContent: this.$t('kpireviewer.Unknown'),
      },
      // { id: "kpireviewer.submitted_value", title: this.$t("kpireviewer.submitted_value"), data: "actual_value", defaultContent: this.$t('kpireviewer.Unknown') },
      { 
        id: "kpireviewer.submission_date",
        title: this.$t("kpireviewer.submission_date"),
        data: "submission.submission_date",
        defaultContent: this.$t('kpireviewer.Unknown'),
      },
      { 
        id: "kpireviewer.submitter",
        title: this.$t("kpireviewer.submitter"),
        data: "submission.created_by",
        defaultContent: this.$t('kpireviewer.Unknown'),
      },
      // { id: "kpireviewer.submission_comment", title: this.$t("kpireviewer.submission_comment"), data: "submission_comment", defaultContent: this.$t('kpireviewer.Unknown') },
      { 
        id: "kpireviewer.status",
        title: this.$t("kpireviewer.status"),
        data: "status",
        defaultContent: this.$t('kpireviewer.Unknown'),
      },
    ];
  },

  methods: {
    openForm() {
      this.isFlipped = true;
    },

    closeForm() {
      this.isFlipped = false;
      // this.$refs.table.refreshTable();
      this.newItem = {};
    },

    editItem(data) {
      this.newItem = data;
      this.isFlipped = true;
    },

    formatDate(date) {
      // if (!date) return this.$t('kpireviewer.Unknown');
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
    },

    getSubmitterName(userId) {
        if(userId === 'system-auto') {
            return 'system-auto';
        }

        if(!userId) {
            return this.$t('kpireviewer.Unknown');
        }
        const user = this.users.find((u) => u.id === userId);
        return user ? user.full_name : this.$t('kpireviewer.Unknown');
    },

    async getVariableNameById(id) {
      if (!id) return "";
      // إذا كان موجود في الكاش أرجعه فوراً
      if (this.variableCache[id]) {
        return this.variableCache[id].name || "";
      }
      try {
        const api = new formulaVariableApi();
        const variables = await api.getAll({
          filterIn: `id|${id}`,
        });
        if (variables && variables.length > 0) {
          this.variableCache[id] = variables[0];
          return variables[0].name || "";
        }
      } catch (e) {
        console.error("Error fetching variable by id", id, e);
      }
      return "";
    },
    getVariableNameByIdSync(id) {
      if (!id) return "";
      const variable = this.formulaVariablesData.find(
        (v) => v.id === id || v._id === id
      );
      return variable ? variable.name : "";
    },
    calculateSubmissionResult(item) {
      if (!item?.kpi?.formulaParts) return "";
      // دمج كل القيم في مصفوفة واحدة (يدوي + أوتوماتيك)
      const allValues = [
        ...(item.variable_values || []),
        ...(item.automatic_variable_values || []),
      ];
      let expr = "";
      item.kpi?.formulaParts.forEach((part) => {
        if (part.type === "variable") {
          // ابحث عن قيمة المتغير بالـ id
          let varId =
            typeof part.variable === "object"
              ? part.variable.id
              : part.variable;
          const found = allValues.find((v) => v.id === varId);
          expr += found ? found.value : 0;
        } else if (part.type === "operator") {
          expr += ` ${part.value} `;
        } else if (part.type === "number") {
          expr += part.value;
        }
      });
      try {
        // تقييم آمن للمعادلة
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict";return (${expr})`)();
        return isNaN(result) ? "Invalid" : result;
      } catch {
        return "Error";
      }
    },
    getStatusColor(status) {
      switch (status) {
        case "approved":
          return "green";
        case "rejected":
          return "red";
        case "pending":
          return "orange";
        default:
          return "gray";
      }
    },
    getStatusName(status) {
      switch (status) {
        case "approved":
          return this.$t('kpireviewer.approved');
        case "rejected":
          return this.$t('kpireviewer.rejected');;
        case "pending":
          return this.$t('kpireviewer.pending');;
        default:
          return this.$t('kpireviewer.Unknown');;
      }
    },

    async fetchFormulaVariablesData(formulaParts) {
      const variableIds = formulaParts
        .filter((part) => part.type === "variable" && part.variable)
        .map((part) =>
          typeof part.variable === "string"
            ? part.variable
            : part.variable.id || part.variable._id
        );
      if (!variableIds.length) return [];
      try {
        const api = new formulaVariableApi();
        const variables = await api.getAll({
          filterIn: `id|${variableIds.join(",")}`,
        });
        return variables;
      } catch (error) {
        console.error("Error fetching formula variables:", error);
        return [];
      }
    },
    openReviewModal(item, action) {
      this.reviewModal = {
        show: true,
        item,
        action,
        comment: "",
      };
    },

    async submitReview() {
      if (this.$refs.reviewForm && !this.$refs.reviewForm.validate()) {
        return;
      }
      try {
        const response = await this.api.updateSubmissionStatus(
          this.reviewModal.item.id,
          {
            status: this.reviewModal.action,
            reviewer_comment: this.reviewModal.comment,
            reviewed_by: Auth.USER.id,
          }
        );

        if (response.status) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: this.$t('kpireviewer.Submission status updated successfully'),
          });
          this.$refs.table.refreshTable();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.message || this.$t('kpireviewer.Failed to update submission status'),
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:  this.$t('kpireviewer.Failed to update submission status'),
        });
      } finally {
        this.reviewModal.show = false;
      }
    },

    async openKpiSubmissionValueDetailsModal(item) {
      // جلب formulaParts من الكي بي آي
      let formulaParts = item.kpi?.formulaParts || [];
      // جلب بيانات المتغيرات من الـ API
      const variablesData = await this.fetchFormulaVariablesData(formulaParts);

      // اربط بيانات المتغيرات مع formulaParts
      const formulaPartsWithData = formulaParts.map((part) => {
        if (part.type === "variable" && part.variable) {
          const varId =
            typeof part.variable === "string"
              ? part.variable
              : part.variable.id || part.variable._id;
          const variableData = variablesData.find(
            (v) => v.id === varId || v._id === varId
          );
          return {
            ...part,
            variable: variableData || part.variable,
          };
        }
        return part;
      });

      this.formulaVariablesData = variablesData;
      this.formulaPartsWithData = formulaPartsWithData;

      this.kpiSubmissionValueDetailsModal.currentItem = item;
      this.kpiSubmissionValueDetailsModal.show = true;
    },

    closeKpiSubmissionValueDetailsModal() {
      this.kpiSubmissionValueDetailsModal.show = false;
      this.kpiSubmissionValueDetailsModal.currentItem = null;
    },

    buildDisplayFormula(formulaParts) {
      if (!formulaParts || !Array.isArray(formulaParts)) return "";
      let display = "";
      formulaParts.forEach((part) => {
        if (part.type === "variable") {
          let varId =
            typeof part.variable === "object" && part.variable !== null
              ? part.variable.id || part.variable._id
              : part.variable;
         
          const varName =
            this.getVariableNameByIdSync(varId) || part.value || varId;
          // أضف الوظيفة لو موجودة
          let func = "";
          if (typeof part.variable === "object" && part.variable.function) {
            func = ` (${part.variable.function})`;
          }
          display += varName + func;
        } else if (part.type === "operator") {
          display += ` ${part.value} `;
        }
      });
      return display;
    },
  },
};
</script>
<style scoped>
.v-chip {
  margin: 0;
}
.formula-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid #1976d2;
  margin-bottom: 8px;
}
.formula-code {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  background-color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  display: block;
}
.bg-modal {
  background-color: #f5f5f5;
  border-radius: 8px;
}

.cursor {
  cursor: pointer;
}

.fw-bolder {
  font-weight: 700;
  font-size: 18px;
}

.info-card {
  background-color: #fff;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-card-text {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  text-align: center;
}

.customsub-text {
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
  text-align: center;
}

.customsub2-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.comment-text {
  color: #555;
  line-height: 1.6;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.table-responsive {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid lightgray;
  border-radius: 10px;
}

.table-sm {
  font-size: 12px;
  margin-bottom: 0;
}

.table-sm thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

.table-sm th {
  background: #f5f5f5;
  padding: 8px 12px;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #dee2e6;
}

.table-sm td {
  padding: 8px 12px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.text-capitalize {
  text-transform: capitalize;
}

.figma-button {
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

