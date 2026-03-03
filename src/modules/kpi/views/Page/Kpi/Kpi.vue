<template>
  <main-page
    ref="page"
    :isFlipped="isFlipped"
    :mainPage="$t('kpi.kpi')"
    :subPage="$t('kpi.kpi')"
    :titlePage="$t('kpi.kpi')"
    :hideActions="hideActions"
    v-permission:show
  >
    <template #datatable>
      <div
        v-permission:show
        class="card mb-3 card-top-filter rtl"
        v-if="!isFlipped && !loading"
      >
        <div class="card-body">
          <!-- Use the shared Filter component as an overlay/modal -->

          <div class="d-flex justify-content-between align-items-center">
            <div></div>

            <Teleport to="body">
              <Filter
                :is-open="isFilterOpen"
                :filters="filterDefinitions"
                @close="closeFilterModal"
                @filter-applied="onFilterApplied"
                @filter-removed="onFilterRemoved"
                @filters-cleared="onFiltersCleared"
                @operators-changed="onOperatorsChanged"
                @filters-saved="onFiltersSaved"
                ref="filterComponent"
              />
            </Teleport>
            <div class="d-flex align-items-center rtl">
              <div v-if="!isFlipped && !loading" class="d-flex justify-content-end me-2">
                <button
                  v-permission:store
                  class="secondary-btn d-flex align-items-center justify-cente"
                  @click="openForm"
                >
                  <v-icon left class="icon-add mr-2">mdi-plus</v-icon>
                  {{ $t("kpi.add_kpi") }}
                </button>
              </div>
              <!-- // reset filter -->
              <!-- // reset filter -->
              <!-- <button
                class="filter-btn d-flex justify-center align-items-center mx-2"
                @click="resetFilters"
                title="Filter"
              >
                <p class="mb-0 ms-1">{{ $t("kpi.Rest filter") || "Rest Filter" }}</p>
              </button> -->

              <button
                class="filter-btn ms-3 d-flex justify-center align-items-center"
                @click="openFilterModal"
                :class="{
                  'filter-btn-disabled':
                    !filterDefinitions || filterDefinitions.length === 0,
                }"
              >
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 22 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 2H20.5H1.5ZM4.89286 9.5H17.1071H4.89286ZM8.96429 17H13.0357H8.96429Z"
                    fill="white"
                  />
                  <path
                    d="M1.5 2H20.5M4.89286 9.5H17.1071M8.96429 17H13.0357"
                    stroke="white"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p class="mb-0 ms-1">{{ $t("kpi.filter") || "Filter" }}</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center"
        style="min-height: 200px"
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ $t("kpi.Loading") }}</span>
        </div>
      </div>
      <div v-else-if="!isFlipped" class="kpi-card-view row">
        <div v-for="kpi in processedKpis" :key="kpi.id" class="col-md-6 col-lg-4 mb-4">
          <div class="card">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center rtl">
                <h5 class="card-title m-0 text-truncate-with-tooltip" :title="kpi.name">
                  {{ kpi.name }}
                </h5>

                <div class="d-flex justify-content-between align-items-center rtl">
                  <p class="type-kpi mb-0 me-2">
                    {{ getKpiTypeName(kpi.type) }}
                  </p>
                  <div class="dropdown" v-if="kpi.submissions_count < 1">
                    <button type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <svg
                        width="3"
                        height="16"
                        viewBox="0 0 3 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.51853 9.48097C2.33673 9.48097 3.00001 8.8177 3.00001 7.99952C3.00001 7.18134 2.33673 6.51807 1.51853 6.51807C0.700329 6.51807 0.0370483 7.18134 0.0370483 7.99952C0.0370483 8.8177 0.700329 9.48097 1.51853 9.48097Z"
                          fill="black"
                        />
                        <path
                          d="M1.51853 2.96291C2.33673 2.96291 3.00001 2.29964 3.00001 1.48145C3.00001 0.663269 2.33673 0 1.51853 0C0.700329 0 0.0370483 0.663269 0.0370483 1.48145C0.0370483 2.29964 0.700329 2.96291 1.51853 2.96291Z"
                          fill="black"
                        />
                        <path
                          d="M1.51853 16C2.33673 16 3.00001 15.3367 3.00001 14.5186C3.00001 13.7004 2.33673 13.0371 1.51853 13.0371C0.700329 13.0371 0.0370483 13.7004 0.0370483 14.5186C0.0370483 15.3367 0.700329 16 1.51853 16Z"
                          fill="black"
                        />
                      </svg>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li class="mb-2">
                        <button
                          v-if="!kpi.submissions_count"
                          v-permission:update
                          class="dropdown-item"
                          @click="editItem(kpi)"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.66667 1L13 4.33333L4.33333 13H1V9.66667L9.66667 1Z"
                              stroke="#404040"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <span class="ms-2 text-black text-actions">{{
                            $t("kpi.edit")
                          }}</span>
                        </button>
                      </li>
                      <li>
                        <button
                          v-if="!kpi.submissions_count"
                          v-permission:delete
                          class="dropdown-item"
                          @click="deleteItem(kpi)"
                        >
                          <svg
                            width="13"
                            height="14"
                            viewBox="0 0 13 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M1 3.30769C1 3.05279 1.2052 2.84615 1.45833 2.84615H11.5417C11.7948 2.84615 12 3.05279 12 3.30769C12 3.56259 11.7948 3.76923 11.5417 3.76923H1.45833C1.2052 3.76923 1 3.56259 1 3.30769Z"
                              fill="#A92525"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M5.125 5.61538C5.37813 5.61538 5.58333 5.82202 5.58333 6.07692V9.76923C5.58333 10.0241 5.37813 10.2308 5.125 10.2308C4.87187 10.2308 4.66667 10.0241 4.66667 9.76923V6.07692C4.66667 5.82202 4.87187 5.61538 5.125 5.61538Z"
                              fill="#A92525"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.875 5.61538C8.12813 5.61538 8.33333 5.82202 8.33333 6.07692V9.76923C8.33333 10.0241 8.12813 10.2308 7.875 10.2308C7.62187 10.2308 7.41667 10.0241 7.41667 9.76923V6.07692C7.41667 5.82202 7.62187 5.61538 7.875 5.61538Z"
                              fill="#A92525"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M2.375 2.84615C2.62813 2.84615 2.83333 3.05279 2.83333 3.30769V12.0769H10.1667V3.30769C10.1667 3.05279 10.3719 2.84615 10.625 2.84615C10.8781 2.84615 11.0833 3.05279 11.0833 3.30769V12.0769C11.0833 12.3217 10.9868 12.5565 10.8148 12.7296C10.6429 12.9027 10.4098 13 10.1667 13H2.83333C2.59022 13 2.35706 12.9027 2.18515 12.7296C2.01324 12.5565 1.91667 12.3217 1.91667 12.0769V3.30769C1.91667 3.05279 2.12187 2.84615 2.375 2.84615Z"
                              fill="#A92525"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M4.15273 1.40554C4.41059 1.14588 4.76033 1 5.125 1H7.875C8.23967 1 8.58941 1.14588 8.84727 1.40554C9.10513 1.66521 9.25 2.01739 9.25 2.38462V3.30769C9.25 3.56259 9.0448 3.76923 8.79167 3.76923C8.53854 3.76923 8.33333 3.56259 8.33333 3.30769V2.38462C8.33333 2.26221 8.28504 2.14481 8.19909 2.05826C8.11314 1.9717 7.99656 1.92308 7.875 1.92308H5.125C5.00344 1.92308 4.88686 1.9717 4.80091 2.05826C4.71496 2.14481 4.66667 2.26221 4.66667 2.38462V3.30769C4.66667 3.56259 4.46146 3.76923 4.20833 3.76923C3.9552 3.76923 3.75 3.56259 3.75 3.30769V2.38462C3.75 2.01739 3.89487 1.66521 4.15273 1.40554Z"
                              fill="#A92525"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M1 3.30769C1 3.05279 1.2052 2.84615 1.45833 2.84615H11.5417C11.7948 2.84615 12 3.05279 12 3.30769C12 3.56259 11.7948 3.76923 11.5417 3.76923H1.45833C1.2052 3.76923 1 3.56259 1 3.30769Z"
                              stroke="#A92525"
                              stroke-width="0.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M5.125 5.61538C5.37813 5.61538 5.58333 5.82202 5.58333 6.07692V9.76923C5.58333 10.0241 5.37813 10.2308 5.125 10.2308C4.87187 10.2308 4.66667 10.0241 4.66667 9.76923V6.07692C4.66667 5.82202 4.87187 5.61538 5.125 5.61538Z"
                              stroke="#A92525"
                              stroke-width="0.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.875 5.61538C8.12813 5.61538 8.33333 5.82202 8.33333 6.07692V9.76923C8.33333 10.0241 8.12813 10.2308 7.875 10.2308C7.62187 10.2308 7.41667 10.0241 7.41667 9.76923V6.07692C7.41667 5.82202 7.62187 5.61538 7.875 5.61538Z"
                              stroke="#A92525"
                              stroke-width="0.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M2.375 2.84615C2.62813 2.84615 2.83333 3.05279 2.83333 3.30769V12.0769H10.1667V3.30769C10.1667 3.05279 10.3719 2.84615 10.625 2.84615C10.8781 2.84615 11.0833 3.05279 11.0833 3.30769V12.0769C11.0833 12.3217 10.9868 12.5565 10.8148 12.7296C10.6429 12.9027 10.4098 13 10.1667 13H2.83333C2.59022 13 2.35706 12.9027 2.18515 12.7296C2.01324 12.5565 1.91667 12.3217 1.91667 12.0769V3.30769C1.91667 3.05279 2.12187 2.84615 2.375 2.84615Z"
                              stroke="#A92525"
                              stroke-width="0.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M4.15273 1.40554C4.41059 1.14588 4.76033 1 5.125 1H7.875C8.23967 1 8.58941 1.14588 8.84727 1.40554C9.10513 1.66521 9.25 2.01739 9.25 2.38462V3.30769C9.25 3.56259 9.0448 3.76923 8.79167 3.76923C8.53854 3.76923 8.33333 3.56259 8.33333 3.30769V2.38462C8.33333 2.26221 8.28504 2.14481 8.19909 2.05826C8.11314 1.9717 7.99656 1.92308 7.875 1.92308H5.125C5.00344 1.92308 4.88686 1.9717 4.80091 2.05826C4.71496 2.14481 4.66667 2.26221 4.66667 2.38462V3.30769C4.66667 3.56259 4.46146 3.76923 4.20833 3.76923C3.9552 3.76923 3.75 3.56259 3.75 3.30769V2.38462C3.75 2.01739 3.89487 1.66521 4.15273 1.40554Z"
                              stroke="#A92525"
                              stroke-width="0.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <span class="ms-2 text-black text-actions">{{
                            $t("kpi.delete")
                          }}</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="d-flex flex-column mb-2 border-bottom pb-2 rtl-align-items">
                <p class="mb-0 target-value">
                  {{ kpi.target_value }} {{ kpi.kpiunit?.name }}
                </p>
                <span class="target-value-title">{{ $t("kpi.target_value") }}</span>
              </div>

              <div
                class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2 rtl"
              >
                <div v-permission:changeStatus v-if="canChangeStatus(kpi)">
                  <div
                    class="status-kpi d-flex align-items-center"
                    :class="{
                      'status-inactive': !kpi.active_status || kpi.active_status == 0,
                    }"
                    @click="toggleKpiStatus(kpi.id)"
                  >
                    <p v-if="kpi.active_status == 1">{{ $t("kpi.Active") }}</p>
                    <p v-else>{{ $t("kpi.inActive") }}</p>
                  </div>
                </div>
                <div v-else>
                  <div
                    class="status-kpi d-flex align-items-center"
                    :class="{
                      'status-inactive': !kpi.active_status || kpi.active_status == 0,
                    }"
                  >
                    <p v-if="kpi.active_status == 1">{{ $t("kpi.Active") }}</p>
                    <p v-else>{{ $t("kpi.inActive") }}</p>
                  </div>
                </div>

                <div class="d-flex flex-column">
                  <p class="mb-0 creatat-kpi">{{ $t("kpi.created_at") }}:</p>
                  <p class="mb-0 creatat-kpi">{{ formatDate(kpi.created_at) }}</p>
                </div>
              </div>

              <div class="border-bottom pb-2">
                <div class="d-flex justify-content-between align-items-center rtl">
                  <p class="mb-0 font-card font-card-main">
                    {{ $t("kpi.collection_method") }}:
                  </p>
                  <p class="mb-0 font-card">
                    {{ getCollectionMethodName(kpi.collection_method) }}
                  </p>
                </div>
                <div class="d-flex justify-content-between align-items-center rtl">
                  <p class="mb-0 font-card font-card-main">{{ $t("kpi.method") }}:</p>
                  <p class="mb-0 font-card">{{ translateMethod(kpi.method) }}</p>
                </div>
                <div class="d-flex justify-content-between align-items-center rtl">
                  <p class="mb-0 font-card font-card-main">{{ $t("kpi.frequency") }}:</p>
                  <p class="mb-0 font-card">{{ translateFrequency(kpi.frequency) }}</p>
                </div>
              </div>

              <div class="row mb-3 px-2">
                <div class="col-sm-6 mt-sm-2 col-xlg-3 p-0 rtl-end">
                  <button
                    class="btn-custom d-flex align-items-center rtl"
                    @click="openLinkedEntitiesModal(kpi)"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.34357 3.65001C8.52882 3.83499 8.52904 4.13512 8.34406 4.32037L4.32679 8.34357C4.14181 8.52882 3.84168 8.52904 3.65643 8.34406C3.47118 8.15909 3.47096 7.85896 3.65593 7.67371L7.67321 3.6505C7.85819 3.46525 8.15832 3.46503 8.34357 3.65001Z"
                        fill="#43235C"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.31926 4.65754C3.50437 4.84265 3.50437 5.14278 3.31926 5.3279L1.64243 7.00473C1.19781 7.44934 0.948031 8.05237 0.948031 8.68115C0.948031 9.30993 1.19781 9.91296 1.64243 10.3576C2.08704 10.8022 2.69007 11.052 3.31885 11.052C3.63019 11.052 3.93848 10.9906 4.22612 10.8715C4.51377 10.7524 4.77512 10.5777 4.99527 10.3576L6.6721 8.68074C6.85722 8.49563 7.15735 8.49563 7.34246 8.68074C7.52758 8.86586 7.52758 9.16599 7.34246 9.3511L5.66563 11.0279C5.35745 11.3361 4.99158 11.5806 4.58892 11.7474C4.18626 11.9142 3.75469 12 3.31885 12C2.43864 12 1.59447 11.6503 0.972069 11.0279C0.349664 10.4055 0 9.56136 0 8.68115C0 7.80093 0.349664 6.95677 0.972069 6.33437L2.6489 4.65754C2.83401 4.47242 3.13414 4.47242 3.31926 4.65754Z"
                        fill="#43235C"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6.33437 0.972069C6.95677 0.349664 7.80093 0 8.68115 0C9.56136 0 10.4055 0.349664 11.0279 0.972069C11.6503 1.59447 12 2.43864 12 3.31885C12 4.19906 11.6503 5.04323 11.0279 5.66563L9.3511 7.34246C9.16599 7.52758 8.86586 7.52758 8.68074 7.34246C8.49563 7.15735 8.49563 6.85722 8.68074 6.6721L10.3576 4.99527C10.8022 4.55066 11.052 3.94763 11.052 3.31885C11.052 2.69007 10.8022 2.08704 10.3576 1.64243C9.91296 1.19781 9.30993 0.948031 8.68115 0.948031C8.05237 0.948031 7.44934 1.19781 7.00473 1.64243L5.3279 3.31926C5.14278 3.50437 4.84265 3.50437 4.65754 3.31926C4.47242 3.13414 4.47242 2.83401 4.65754 2.6489L6.33437 0.972069Z"
                        fill="#43235C"
                      /></svg
                    ><span class="ms-2">{{ $t("kpi.linked_entities") }}</span>
                  </button>
                </div>

                <div class="col-sm-6 mt-sm-2 col-xlg-3 p-0 rtl-end">
                  <button
                    class="btn-custom d-flex align-items-center rtl"
                    @click="viewReviews(kpi)"
                  >
                    <svg
                      width="15"
                      height="12"
                      viewBox="0 0 15 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.31822 0.334735C0.521971 0.120408 0.798316 0 1.08646 0H4.70797C4.94144 0.00100998 5.16847 0.0806199 5.35582 0.227165L5.35711 0.228175L7.24355 1.71288L7.24735 1.71429H11.9511C12.2392 1.71429 12.5156 1.83469 12.7193 2.04902C12.9231 2.26335 13.0375 2.55404 13.0375 2.85714V4.57143C13.0375 4.88702 12.7943 5.14286 12.4943 5.14286C12.1943 5.14286 11.9511 4.88702 11.9511 4.57143V2.85714H7.24311C7.00964 2.85613 6.78261 2.77652 6.59525 2.62998L6.59396 2.62897L4.70753 1.14426L4.70373 1.14286L1.08646 1.14286L1.08646 11.4286C1.08646 11.7442 0.843251 12 0.543233 12C0.243215 12 2.59129e-06 11.7442 2.59129e-06 11.4286V1.14286C2.59129e-06 0.839752 0.114469 0.549062 0.31822 0.334735Z"
                        fill="#43235C"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.31143 4H13.9134C14.0852 3.99999 14.2546 4.04283 14.4076 4.12501C14.5606 4.20719 14.6929 4.32637 14.7936 4.47276C14.8944 4.61915 14.9607 4.78859 14.9871 4.96715C15.0135 5.14572 14.9993 5.32833 14.9456 5.5L14.9449 5.50213L13.0097 11.6093C12.9357 11.8426 12.7281 12 12.4943 12H0.543233C0.362976 12 0.194459 11.9059 0.0934017 11.7489C-0.00765548 11.5919 -0.0280895 11.3924 0.0388562 11.2163L2.07504 5.86168L2.07557 5.86025C2.15562 5.64771 2.29478 5.46552 2.47488 5.33752C2.6548 5.20964 2.86719 5.14181 3.0843 5.14286L3.08637 5.14287L3.08284 5.71429V5.14286H3.0843H6.35104L6.35 5.14289L6.3558 5.71429V5.15235L6.65458 5.62143L6.36423 5.13847L6.36199 5.1398L7.71028 4.18956C7.71426 4.18676 7.71826 4.18401 7.72231 4.18133C7.89699 4.06513 8.09896 4.00235 8.30563 4.00003L8.31143 4ZM6.3558 5.14417V5.14286H6.35104C6.35486 5.14266 6.35859 5.14162 6.36199 5.1398L6.3558 5.14417ZM8.31619 5.14286C8.31237 5.14305 8.30864 5.1441 8.30523 5.14591L6.95695 6.09615C6.95297 6.09895 6.94897 6.1017 6.94492 6.10439C6.77024 6.22059 6.56826 6.28336 6.3616 6.28568L6.3558 6.28575L3.08394 6.28571L1.3456 10.8571H12.1028L13.9135 5.14286H8.31619Z"
                        fill="#43235C"
                      /></svg
                    ><span class="ms-2">{{ $t("kpi.reviews") }}</span>
                  </button>
                </div>
                <div class="col-sm-6 mt-sm-2 col-xlg-3 p-0 rtl-end">
                  <button
                    class="btn-custom d-flex align-items-center rtl"
                    @click="viewDetails(kpi)"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6 0.923077C3.19609 0.923077 0.923077 3.19609 0.923077 6C0.923077 8.80391 3.19609 11.0769 6 11.0769C8.80391 11.0769 11.0769 8.80391 11.0769 6C11.0769 3.19609 8.80391 0.923077 6 0.923077ZM0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6Z"
                        fill="#43235C"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6 2.76923C6.2549 2.76923 6.46154 2.97587 6.46154 3.23077V6.46154C6.46154 6.71644 6.2549 6.92308 6 6.92308C5.7451 6.92308 5.53846 6.71644 5.53846 6.46154V3.23077C5.53846 2.97587 5.7451 2.76923 6 2.76923Z"
                        fill="#43235C"
                      />
                      <path
                        d="M6 9.23077C6.38235 9.23077 6.69231 8.92081 6.69231 8.53846C6.69231 8.15611 6.38235 7.84615 6 7.84615C5.61765 7.84615 5.30769 8.15611 5.30769 8.53846C5.30769 8.92081 5.61765 9.23077 6 9.23077Z"
                        fill="#43235C"
                      />
                    </svg>
                    <span class="ms-2">{{ $t("kpi.details") }}</span>
                  </button>
                </div>
                <div class="col-sm-6 mt-sm-2 col-xlg-3 p-0 rtl-end">
                  <button
                    v-if="kpi.method == 'progressive' && kpi.frequency_data?.length"
                    class="btn-custom d-flex align-items-center rtl"
                    @click="openFrequencyDataModal(kpi)"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.2274 1.58287L5.9973 2.81296C5.80185 3.00842 5.48496 3.00842 5.28951 2.81296C5.09406 2.61751 5.09406 2.30062 5.28951 2.10517L6.52821 0.86647C6.53367 0.861008 6.53926 0.855674 6.54497 0.850471C7.16456 0.285747 7.97792 -0.0185291 8.81603 0.000874063C9.65414 0.0202773 10.4525 0.361867 11.0453 0.95466C11.6381 1.54745 11.9797 2.34586 11.9991 3.18397C12.0185 4.02208 11.7143 4.83544 11.1495 5.45504C11.1441 5.46096 11.1386 5.46676 11.1329 5.47242L9.36373 7.23534C9.36351 7.23556 9.36394 7.23512 9.36373 7.23534C9.0622 7.53782 8.70331 7.7785 8.30887 7.94231C7.91415 8.10625 7.49094 8.19063 7.06353 8.19063C6.63612 8.19063 6.21291 8.10625 5.81819 7.94231C5.42347 7.77838 5.065 7.53813 4.76334 7.23534C4.56825 7.03952 4.56884 6.72263 4.76466 6.52755C4.96048 6.33246 5.27737 6.33305 5.47245 6.52887C5.68111 6.73832 5.92908 6.9045 6.20211 7.0179C6.47515 7.13129 6.76788 7.18966 7.06353 7.18966C7.35918 7.18966 7.65191 7.13129 7.92495 7.0179C8.19799 6.9045 8.44595 6.73832 8.65461 6.52887L8.6559 6.52758L10.4174 4.77229C10.8038 4.34404 11.0118 3.78405 10.9984 3.20714C10.985 2.62641 10.7483 2.0732 10.3375 1.66245C9.9268 1.25171 9.37359 1.01502 8.79286 1.00158C8.2158 0.988217 7.65568 1.19631 7.2274 1.58287Z"
                        fill="#43235C"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4.93647 4.81034C4.64082 4.81034 4.34808 4.86871 4.07505 4.9821C3.80201 5.0955 3.55405 5.26168 3.34539 5.47113L3.3441 5.47242L1.58258 7.22771C1.19621 7.65596 0.98822 8.21595 1.00158 8.79286C1.01502 9.37359 1.25171 9.9268 1.66245 10.3375C2.0732 10.7483 2.62641 10.985 3.20714 10.9984C3.7842 11.0118 4.34432 10.8037 4.7726 10.4171L6.0027 9.18704C6.19815 8.99159 6.51504 8.99159 6.71049 9.18704C6.90594 9.38249 6.90594 9.69938 6.71049 9.89483L5.47179 11.1335C5.46633 11.139 5.46074 11.1443 5.45504 11.1495C4.83544 11.7143 4.02208 12.0185 3.18397 11.9991C2.34586 11.9797 1.54745 11.6381 0.95466 11.0453C0.361867 10.4525 0.0202773 9.65414 0.000874063 8.81603C-0.0185291 7.97792 0.285747 7.16456 0.850471 6.54497C0.855873 6.53904 0.861416 6.53324 0.867097 6.52758L2.63628 4.76466C2.63605 4.76489 2.6365 4.76443 2.63628 4.76466C2.93779 4.46219 3.2967 4.2215 3.69113 4.05769C4.08585 3.89375 4.50906 3.80937 4.93647 3.80937C5.36388 3.80937 5.78709 3.89375 6.18181 4.05769C6.57653 4.22162 6.935 4.46187 7.23666 4.76466C7.43175 4.96048 7.43116 5.27737 7.23534 5.47245C7.03952 5.66754 6.72263 5.66695 6.52755 5.47113C6.31889 5.26168 6.07092 5.0955 5.79789 4.9821C5.52485 4.86871 5.23212 4.81034 4.93647 4.81034Z"
                        fill="#43235C"
                      />
                    </svg>
                    <span class="ms-2">{{ $t("kpi.frequency_data") }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #form>
      <div class="form-container">
        <div class="form-header">
          <p class="form-title mb-0">
            {{
              isReadonly ? $t("kpi.view") : newItem.id ? $t("kpi.edit") : $t("kpi.add")
            }}
          </p>
          <button class="btn btn-close" @click="closeForm">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <Form
          :schema="formFields"
          :newItem="newItem"
          :api="api"
          :closeForm="closeForm"
          :formData="true"
          @success="handleFormSuccess"
        >
          <template #card="{ field }">
            <div class="form-card" :class="`card-${field.name}`">
              <div class="card-header">
                <h5>{{ field.label }}</h5>
              </div>
              <div class="card-body">
                <slot name="field-content" :field="field"></slot>
              </div>
            </div>
          </template>

          <template #formulaVariables="{ item }">
            <div class="col-md-12 col-lg-12 mb-3">
              <label for="formulaVariables">
                {{ $t("kpi.Formula Variables") }}
                <span class="font-danger">*</span>
              </label>
              <VueSelect
                id="formulaVariables"
                label="name"
                :options="filteredFormulaVariables"
                :multiple="true"
                v-model="newItem.formulaVariables"
                :reduce="(item) => item.id"
                clearable
                :placeholder="$t('kpi.Select Formula Variables')"
                @update:modelValue="updateSelectedVariables"
              />

              <!-- Add the formula builder -->
              <FormulaBuilder
                v-if="newItem.formulaVariables && newItem.formulaVariables.length > 0"
                :variables="selectedVariables"
                :initialFormula="newItem.formula"
                :initial-formula-parts="newItem.formulaParts || []"
                @formula-saved="handleFormulaSave"
              />
            </div>
          </template>

          <template #frequency="{ item }">
            <div class="col-md-12 col-lg-12 mb-3">
              <h6 class="radio-main-label">
                {{ $t("kpi.frequency") }}
                <span class="font-danger">*</span>
              </h6>

              <div class="radio-options-grid">
                <div
                  v-for="option in frequencyOptions"
                  :key="option.id"
                  class="radio-option-card"
                  :class="{
                    'radio-option-card--selected': newItem.frequency === option.id,
                  }"
                >
                  <input
                    type="radio"
                    class="radio-input"
                    :id="`frequency-${option.id}`"
                    v-model="newItem.frequency"
                    :value="option.id"
                    @change="
                      ['weekly', 'monthly', 'quarterly', 'yearly'].includes(
                        newItem.frequency
                      )
                        ? openFrequencyModal(newItem.frequency)
                        : null
                    "
                  />
                  <label :for="`frequency-${option.id}`" class="radio-label">
                    <div class="radio-content">
                      <div class="radio-icon" v-if="option.icon">
                        <i :class="option.icon"></i>
                      </div>
                      <div class="radio-text">
                        <div class="radio-title">{{ option.name }}</div>
                        <div v-if="option.description" class="radio-description">
                          {{ option.description }}
                        </div>
                      </div>
                      <div class="radio-checkmark">
                        <div class="checkmark-circle"></div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Frequency Settings Button -->
              <div v-if="newItem.method === 'progressive'" class="mt-2">
                <button
                  type="button"
                  v-if="
                    (editMod && newItem.frequency === 'weekly') ||
                    (editMod && newItem.frequency === 'monthly') ||
                    (editMod && newItem.frequency === 'quarterly') ||
                    (editMod && newItem.frequency === 'yearly')
                  "
                  class="btn btn-sm btn-outline-secondary"
                  @click="openFrequencyModal(newItem.frequency)"
                >
                  <i class="fas fa-cog me-1"></i>
                  {{ $t("kpi.configure_frequency_settings") }}
                </button>
              </div>
            </div>
          </template>

          <template #owners="{ item }">
            <div class="owners-field">
              <v-btn
                size="small"
                class="btn-owner"
                color="info"
                @click="openOwnerDialog"
                block
              >
                {{
                  item.owners?.length
                    ? `${item.owners.length} ${$t("kpi.selected")}`
                    : $t("kpi.select_owners")
                }}
                <i class="fas fa-chevron-right ms-2"></i>
              </v-btn>
              <div v-if="item.owners?.length" class="selected-owners mt-2">
                <v-chip
                  v-for="owner in getSelectedOwnersDisplay(item.owners)"
                  :key="owner.id"
                  class="me-1 mb-1"
                  close
                  @click:close="removeOwner(item.owners, owner.id)"
                >
                  {{ owner.name }}
                </v-chip>
              </div>
            </div>
          </template>

          <template #Contributors="{ item }">
            <div class="col-md-12 col-lg-12 mb-3">
              <label for="contributors">
                {{ $t("kpi.Stakeholders") }}
                <span class="font-danger">*</span>
              </label>
              <UserSelect
                id="contributors"
                v-model="newItem.contributors"
                :multiple="true"
                :disabled="isReadonly"
                :placeholder="$t('kpi.All')"
              />
            </div>
          </template>

          <template #reviewers="{ item }">
            <div class="col-md-12 col-lg-12 mb-3">
              <label for="reviewers">
                {{ $t("kpi.reviewers") }}
                <span class="font-danger">*</span>
              </label>
              <UserSelect
                id="reviewers"
                v-model="newItem.reviewers"
                :multiple="true"
                :disabled="isReadonly"
                :placeholder="$t('kpi.All')"
                @update:modelValue="changeReviewers"
              />
            </div>
          </template>

          <!-- choose multi select -->
          <template #linkedType="{ item }">
            <div class="col-md-12 col-lg-12 mb-3">
              <h6 class="radio-main-label">
                {{ $t("kpi.linkedType") }}
                <span class="font-danger">*</span>
              </h6>

              <div class="radio-options-grid">
                <div
                  v-for="option in linkedTypeOptions"
                  :key="option.id"
                  class="radio-option-card"
                  :class="{
                    'radio-option-card--selected': newItem.linkedType === option.id,
                  }"
                >
                  <input
                    type="radio"
                    class="radio-input"
                    :id="`linkedType-${option.id}`"
                    v-model="newItem.linkedType"
                    :value="option.id"
                    @change="selectLinkedType(newItem.linkedType)"
                  />

                  <label :for="`linkedType-${option.id}`" class="radio-label">
                    <div class="radio-content">
                      <!-- Icon (اختياري) -->
                      <div class="radio-icon" v-if="option.icon">
                        <i :class="option.icon"></i>
                      </div>

                      <!-- نص الراديو -->
                      <div class="radio-text">
                        <div class="radio-title">{{ option.name }}</div>
                        <div v-if="option.description" class="radio-description">
                          {{ option.description }}
                        </div>
                      </div>

                      <!-- علامة التحديد -->
                      <div class="radio-checkmark">
                        <div class="checkmark-circle"></div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </template>

          <template #objectives="{ item }">
            <div v-if="selectType == 'objectives'" class="col-md-12 col-lg-12 mb-3">
              <label for="objectives">
                {{ $t("kpi.objectives") }}
                <span class="font-danger">*</span>
              </label>
              <LazySelectField
                :key="`select-objectives`"
                options="Objective"
                :api-params="{}"
                :per-page="10"
                :disabled="isReadonly"
                option-label="name"
                option-value="id"
                v-model="newItem.objectives"
                :multiple="true"
                :placeholder="$t('kpi.select objectives')"
                :filterable="true"
                :clearable="true"
                :name="'objectives'"
                :rules="'required'"
              />
            </div>
            <div v-else></div>
          </template>

          <template #initiatives="{ item }">
            <div v-if="selectType == 'initiatives'" class="col-md-12 col-lg-12 mb-3">
              <label for="initiatives">
                {{ $t("kpi.initiatives") }}
                <span class="font-danger">*</span>
              </label>
              <LazySelectField
                :key="`select-initiatives`"
                options="Initiative"
                :api-params="{}"
                :per-page="10"
                :disabled="isReadonly"
                option-label="name"
                option-value="id"
                v-model="newItem.initiatives"
                :multiple="true"
                :placeholder="$t('kpi.select initiatives')"
                :filterable="true"
                :clearable="true"
                :name="'initiatives'"
                :rules="'required'"
              />
            </div>
            <div v-else></div>
          </template>
          <template #departments="{ item }">
            <div v-if="selectType == 'departments'" class="col-md-12 col-lg-12 mb-3">
              <label for="departments">
                {{ $t("kpi.departments") }}
                <span class="font-danger">*</span>
              </label>
              <LazySelectField
                :key="`select-departments`"
                options="Department"
               
                :disabled="isReadonly"
                option-label="name"
                option-value="id"
                v-model="newItem.departments"
                :multiple="true"
                :placeholder="$t('kpi.select departments')"
                :filterable="true"
                :clearable="true"
                :name="'departments'"
                :rules="'required'"
              />
            </div>
            <div v-else></div>
          </template>

          <!-- <template #datasets="{ item }">
            <div v-if="selectType == 'datasets'" class="col-md-12 col-lg-12 mb-3">
              <label for="datasets">
                {{ $t("kpi.datasets") }}
                <span class="font-danger">*</span>
              </label>
              <LazySelectField
                :key="`select-datasets`"
                :options="datasets"
                :api-params="{}"
                :per-page="10"
                :disabled="isReadonly"
                option-label="name"
                option-value="id"
                v-model="newItem.datasets"
                :multiple="true"
                :placeholder="$t('kpi.select datasets')"
                :filterable="true"
                :clearable="true"
                :name="'datasets'"
                :rules="'required'"
              />
            </div>
            <div v-else></div>
          </template> -->

          <template #domains="{ item }">
            <div v-if="selectType == 'domains'" class="col-md-12 col-lg-12 mb-3">
              <label for="domains">
                {{ $t("kpi.domains") }}
                <span class="font-danger">*</span>
              </label>
              <LazySelectField
                :key="`select-domains`"
                options="Domain"
                :disabled="isReadonly"
                option-label="name"
                option-value="id"
                v-model="newItem.domains"
                :multiple="true"
                :placeholder="$t('kpi.select domains')"
                :filterable="true"
                :clearable="true"
                :name="'domains'"
                :rules="'required'"
              />
            </div>
            <div v-else></div>
          </template>

          <template #linked_users="{ item }">
            <div v-if="selectType == 'linked_users'" class="col-md-12 col-lg-12 mb-3">
              <label for="linked_users">
                {{ $t("kpi.linked_users") }}
                <span class="font-danger">*</span>
              </label>
              <UserSelect
                id="linked_users"
                v-model="newItem.linked_users"
                :multiple="true"
                :disabled="isReadonly"
                :placeholder="$t('kpi.select linked_users')"
              />
            </div>
            <div v-else></div>
          </template>

          <template #actions>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeForm">
                <i class="fas fa-times me-1"></i> {{ $t("kpi.cancel") }}
              </button>
              <button v-permission:store type="submit" class="btn btn-primary">
                <i class="fas fa-save me-1"></i> {{ $t("kpi.save") }}
              </button>
            </div>
          </template>
        </Form>
      </div>
    </template>
  </main-page>
  <KpiReviewsModal ref="reviewsModal" :kpi="selectedKpi" />
  <KpiDetailsModal
    :show-modal="showDetailsModal"
    :kpi="selectedKpi"
    :kpiTypes="kpiTypes"
    :units="units"
    :objectives="objectives"
    :initiatives="initiatives"
    :departments="departments"
    @close="showDetailsModal = false"
  />

  <KpiLinkedEntitiesModal
    :show-modal="showLinkedEntitiesModal"
    :kpi="selectedKpi"
    :objectives="objectives"
    :initiatives="initiatives"
    :departments="departments"
    :datasets="datasets"
    :domains="domains"
    :users="users"
    @close="showLinkedEntitiesModal = false"
  />

  <KpiOwnerDialog
    :show-modal="showOwnerDialog"
    :users="users"
    :positions="positions"
    :initial-selected-owners="newItem.owners"
    @close="showOwnerDialog = false"
    @save="
      (owners) => {
        newItem.owners = owners;
        showOwnerDialog = false;
      }
    "
  />

  <!-- Frequency Modal -->
  <FrequencySettingsModal
    :showModal="showFrequencyModal"
    :frequencyType="frequencyModalType"
    :startDate="newItem.start_date"
    :endDate="newItem.end_date"
    :initialData="frequencyData"
    :isEditing="!!newItem.id"
    :newItem="newItem"
    @close="showFrequencyModal = false"
    @save="handleFrequencySave"
  />
  <KpiFrequencyDataModal
    :show-modal="showFrequencyDataModal"
    :kpi="selectedKpi"
    @close="showFrequencyDataModal = false"
  />
</template>

<script>
import kpiApi from "@/modules/kpi/API/Kpi/Kpi";
import KPIUnitApi from "@/modules/kpi/API/KPIUnit/KPIUnit";
import KpiTypeApi from "@/modules/kpi/API/KPIType/KPIType";
import formulaVariableApi from "@/modules/kpi/API/FormulaVariable/FormulaVariable";
import userApi from "@/API/User/User";
import positionApi from "@/API/Position/Position";
import initiativeApi from "@/API/StrategicPlan/Initiative/Initiative";
import objectiveApi from "@/API/StrategicPlan/Objective/Objective";
import departmentApi from "@/API/Department/Department";
import domainApi from "@/API/Domain/Domain";
// import datasetApi from "@/API/Dataset/Dataset";
import Form from "@/components/Form.vue";
import MainPage from "@/components/MainPage.vue";
import Filter from "@/components/Filter.vue";
import KpiDetails from "@/modules/kpi/views/Page/Kpi/KpiDetails.vue";
import KpiDetailsModal from "./KpiDetailsModal.vue";
import KpiLinkedEntitiesModal from "./KpiLinkedEntitiesModal.vue";
import KpiFrequencyDataModal from "./KpiFrequencyDataModal.vue";
import KpiOwnerDialog from "./KpiOwnerDialog.vue";
import FrequencySettingsModal from "./FrequencySettingsModal.vue";
import Multiselect from "vue-multiselect";
import VueSelect from "vue-select";
import FormulaBuilder from "./FormulaBuilder.vue";
import KpiReviewsModal from "./KpiReviewsModal.vue";
import Auth from "@/API/Auth";
import UserSelect from "@/components/UserSelect.vue";
import LazySelectField from "@/components/LazySelectField.vue";

export default {
  components: {
    MainPage,
    Form,
    KpiDetails,
    Filter,
    KpiDetailsModal,
    KpiLinkedEntitiesModal,
    KpiFrequencyDataModal,
    KpiOwnerDialog,
    Multiselect,
    VueSelect,
    FrequencySettingsModal,
    FormulaBuilder,
    KpiReviewsModal,
    UserSelect,
    LazySelectField,
  },

  data() {
    return {
      reviewers: [],
      contributors: [],
      api: new kpiApi(),
      isFlipped: false,
      isReadonly: false,
      newItem: this.getDefaultKpi(),
      selectedKpi: null,
      kpis: [], // This will hold the data for the card view
      rawKpis: [],
      showDetailsModal: false,
      showLinkedEntitiesModal: false,
      showFrequencyDataModal: false,
      ActiveStatusMessage: "",
      showOwnerDialog: false,
      showFilterModal: false,
      users: [],
      positions: [],
      // Static data for dropdowns
      kpiTypes: [],
      filters: {
        initiatives: [],
        objectives: [],
        departments: [],
        datasets: [],
        kpiTypes: [],
        startDate: null,
        endDate: null,
      },
      units: [],
      objectives: [],
      initiatives: [],
      departments: [],
      datasets: [],
      domains: [],
      formulaVariables: [],
      filteredFormulaVariables: [],
      loading: false,
      frequencyOptions: [],
      linkedTypeOptions: [
        { id: "objectives", name: this.$t("kpi.objectives") },
        { id: "initiatives", name: this.$t("kpi.initiatives") },
        { id: "domains", name: this.$t("kpi.domains") },
        // { id: "datasets", name: this.$t("kpi.datasets") },
        { id: "departments", name: this.$t("kpi.departments") },
        { id: "linked_users", name: this.$t("kpi.linked_users") },
      ],

      //frequency modal component
      showFrequencyModal: false,
      frequencyModalType: "",
      frequencyData: [],
      selectType: null,
      old_collection_method: null,
      activeFilters: [], // Changed from {} to [] to support multiple selections
      filterOperators: [], // Array to store operators between filters
      isFilterOpen: false,
    };
  },

  computed: {
    apiParams() {
      const params = {
        with: ["kpitype", "kpiunit"],
      };

      // Add active filters to API parameters (same logic as DataTable)
      if (this.activeFilters && this.activeFilters.length > 0) {
        // Separate filters by filterType
        const standardFilters = []; // filters with filterType "filter" or "filterOr"
        const specialFilters = {}; // filters with other filterTypes (filterWhereRelation, filterIn, etc.)

        this.activeFilters.forEach((filter) => {
          const filterType = filter.filterType || "filter";

          if (filterType === "filter" || filterType === "filterOr") {
            // Standard filters that participate in AND/OR logic
            standardFilters.push(filter);
          } else {
            // Special filters that are always AND and sent to specific API parameters
            if (!specialFilters[filterType]) {
              specialFilters[filterType] = [];
            }
            specialFilters[filterType].push(filter);
          }
        });

        // Handle standard filters (filter/filterOr) with AND/OR logic
        if (standardFilters.length > 0) {
          const completeFilterArray = [];
          standardFilters.forEach((filter) => {
            // Build filter value with type information
            let filterValue;
            let filterOperator = "="; // Default operator

            if (filter.type === "integer" || filter.type === "boolean") {
              filterValue = `${filter.value}-${filter.type}`;
            } else if (filter.type === "null") {
              filterValue = `-${filter.type}`;
              filterOperator = "!="; // Use != for null type
            } else {
              // For string and other types, keep original format
              filterValue = filter.value;
            }

            completeFilterArray.push(`${filter.key}|${filterValue}|${filterOperator}`);
          });

          // Build the complete filter string with operators
          let completeFilterString = "";
          if (completeFilterArray.length === 1) {
            completeFilterString = completeFilterArray[0];
          } else {
            completeFilterString = completeFilterArray[0];
            for (let i = 1; i < completeFilterArray.length; i++) {
              const operator = this.filterOperators[i - 1] || "&&";
              completeFilterString += operator + completeFilterArray[i];
            }
          }

          // Determine which parameter to use based on the dominant filterType
          const hasFilterOr = standardFilters.some((f) => f.filterType === "filterOr");
          const parameterName = hasFilterOr ? "filterOr" : "filter";
          params[parameterName] = completeFilterString;
        }

        // Handle special filters (always AND, sent to their specific API parameters)
        Object.keys(specialFilters).forEach((filterType) => {
          const filtersForType = specialFilters[filterType];
          const filterArray = [];

          filtersForType.forEach((filter) => {
            // Build filter value with type information
            let filterValue;
            let filterOperator = "="; // Default operator

            if (filter.type === "integer" || filter.type === "boolean") {
              filterValue = `${filter.value}-${filter.type}`;
            } else if (filter.type === "null") {
              filterValue = `-${filter.type}`;
              filterOperator = "!="; // Use != for null type
            } else {
              // For string and other types, keep original format
              filterValue = filter.value;
            }

            filterArray.push(`${filter.key}|${filterValue}|${filterOperator}`);
          });

          // Special filters are always combined with AND
          if (filterArray.length === 1) {
            params[filterType] = filterArray[0];
          } else {
            let filterString = filterArray[0];
            for (let i = 1; i < filterArray.length; i++) {
              filterString += "&&" + filterArray[i];
            }
            params[filterType] = filterString;
          }
        });
      }

      return params;
    },

    processedKpis() {
      return this.rawKpis.map((kpi) => ({
        ...kpi,
        // Clean up null values in arrays
        owners: this.cleanArray(kpi.owners),
        contributors: this.cleanArray(kpi.contributors),
        reviewers: this.cleanArray(kpi.reviewers),
        objectives: this.cleanArray(kpi.objectives),
        initiatives: this.cleanArray(kpi.initiatives),
        departments: this.cleanArray(kpi.departments),
        linked_users: this.cleanArray(kpi.linked_users),
        datasets: this.cleanArray(kpi.datasets),
        domains: this.cleanArray(kpi.domains),
        // Convert string boolean to actual boolean
      }));
    },

    hasPermissionToChangeStatus() {
      // Implement your permission logic here
      // For example, check if the current user has an 'admin' role or specific permission
      return true; // Placeholder: Always return true for now
    },

    formFields() {
      return [
        {
          name: "name",
          label: this.$t("kpi.name"),
          type: "text",
          rules: "required",
          col: 6,
        },
        {
          name: "type",
          label: this.$t("kpi.type"),
          type: "options",
          options: 'KPIType',
          BaseModule:'kpi',
          optionValue: "id",
          optionLabel: "name",
          rules: "required",
          col: 6,
        },
        {
          name: "description",
          label: this.$t("kpi.description"),
          type: "textarea",
          rules: "",
          col: 12,
        },

        {
          name: "target_value",
          label: this.$t("kpi.target_value"),
          type: "number",
          rules: "required|number",
          col: 6,
        },
        {
          name: "unit",
          label: this.$t("kpi.unit"),
          type: "options",
          options:"KPIUnit",
          BaseModule:'kpi',
          optionValue: "id",
          optionLabel: "name",
          rules: "required",
          col: 6,
        },
        {
          name: "collection_method",
          label: this.$t("kpi.collection_method"),
          type: "radio",
          options: [
            { value: "manual", label: this.$t("kpi.manual") },
            { value: "automatic", label: this.$t("kpi.automatic") },
            { value: "hybrid", label: this.$t("kpi.hybrid") },
          ],
          optionValue: "id",
          optionLabel: "name",
          rules: "required",
          col: 6,
        },
        {
          name: "method",
          label: this.$t("kpi.method"),
          type: "radio",
          options: [
            { value: "fixed", label: this.$t("kpi.fixed") },
            { value: "progressive", label: this.$t("kpi.progressive") },
          ],
          optionValue: "id",
          optionLabel: "name",
          rules: "required",
          col: 6,
        },

        {
          name: "end_date",
          label: this.$t("kpi.end_date"),
          type: "date",
          rules: "",
          col: 6,
        },
        {
          name: "frequency",
          label: this.$t("kpi.frequency"),
          type: "radio",
          options: this.frequencyOptions,
          optionValue: "id",
          optionLabel: "name",
          rules: "required",
          col: 6,
        },
        {
          name: "formulaVariables",
        },
        {
          name: "owners",
          label: this.$t("kpi.owners"),
          type: "button",
          text: this.newItem.owners?.length
            ? `${this.newItem.owners.length} ${this.$t("kpi.selected")}`
            : this.$t("kpi.select"),
          onClick: () => {
            this.showOwnerDialog = true;
          },
          col: 12,
          rules: "",
        },
        {
          name: "Contributors",
        },
        {
          name: "reviewers",
        },
        {
          name: "linkedType",
        },
        {
          name: "objectives",
        },
        {
          name: "initiatives",
        },
        {
          name: "departments",
        },
        // {
        //   name: "datasets",
        // },
        {
          name: "domains",
        },
        {
          name: "linked_users",
        },
      ];
    },

    filterDefinitions() {
      // Definitions for the shared Filter component (same structure as DataTable)
      return [
        {
          title: this.$t("kpi.linked_initiatives"),
          key: "initiatives",
          type: "multi",
          data: this.initiatives,
          filterType: "filter", // Use filterIn for multi-select filters
        },
        {
          title: this.$t("kpi.linked_objectives"),
          key: "objectives",
          type: "multi",
          data: this.objectives,
          filterType: "filter",
        },
        {
          title: this.$t("kpi.linked_departments"),
          key: "departments",
          type: "multi",
          data: this.departments,
          filterType: "filter",
        },
        {
          title: this.$t("kpi.linked_datasets"),
          key: "datasets",
          type: "multi",
          data: this.datasets,
          filterType: "filter",
        },
        {
          title: this.$t("kpi.type"),
          key: "type",
          type: "multi",
          data: this.kpiTypes,
          filterType: "filter",
        },
        // Date filters
        {
          title: this.$t("kpi.start_date"),
          key: "startDate",
          type: "date",
          data: [],
          filterType: "filterDate",
        },
        {
          title: this.$t("kpi.end_date"),
          key: "endDate",
          type: "date",
          data: [],
          filterType: "filterDate",
        },
      ];
    },
  },

  async created() {
    this.loading = true;
    await this.loadDynamicData();
    await this.fetchKpis();
  },

  methods: {
    // In your KPI component, update the openFilterModal method:

    openFilterModal() {
      // Check if filters are available
      if (!this.filterDefinitions || this.filterDefinitions.length === 0) {
        console.warn("No filters available for this module");
        return;
      }

      // Open the modal
      this.isFilterOpen = true;

      // Wait for next tick to ensure Filter component is mounted
      this.$nextTick(() => {
        // Restore the active filters to the Filter component
        if (this.$refs.filterComponent && this.activeFilters.length > 0) {
          // Set the active filters and operators in the Filter component
          this.$refs.filterComponent.activeFilters = [...this.activeFilters];
          this.$refs.filterComponent.filterOperators = [...this.filterOperators];

          // Also restore the selectedValues for each filter
          const selectedValues = {};
          this.activeFilters.forEach((filter) => {
            if (!selectedValues[filter.key]) {
              selectedValues[filter.key] = [];
            }
            selectedValues[filter.key].push({
              id: filter.value,
              name: filter.name,
            });
          });
          this.$refs.filterComponent.selectedValues = selectedValues;

          console.log("Restored filters to modal:", this.activeFilters);
        }
      });
    },

    closeFilterModal() {
      this.isFilterOpen = false;
    },

    onFiltersSaved(filtersData) {
      // THIS is the main method that applies filters and fetches data
      console.log("Filters being saved:", filtersData);

      this.activeFilters = filtersData.filters || [];
      this.filterOperators = filtersData.operators || [];

      // Close the filter modal
      this.isFilterOpen = false;

      // NOW fetch data with the saved filters
      this.fetchKpis();

      console.log("Active filters after save:", this.activeFilters);
      console.log("API params:", this.apiParams);
    },

    onFiltersCleared() {
      this.activeFilters = [];
      this.filterOperators = [];
      this.isFilterOpen = false;
      this.fetchKpis();
    },

    resetFilters() {
      this.activeFilters = [];
      this.filterOperators = [];

      // Clear the Filter component's internal state
      if (this.$refs.filterComponent) {
        this.$refs.filterComponent.clearAllFilters();
      }

      // Close filter modal if open
      this.isFilterOpen = false;

      // Fetch data
      this.fetchKpis();
    },
    updateSelectedVariables(selectedIds) {
      this.selectedVariables = this.formulaVariables.filter((v) =>
        selectedIds.includes(v.id)
      );
    },

    handleFormulaSave(formulaData) {
      // معالجة البيانات المرسلة
      this.newItem.formula = formulaData.formula;
      // حفظ الأجزاء مع التأكد من وجود البيانات الكاملة
      this.newItem.formulaParts = formulaData.parts.map((part) => {
        if (part.type === "variable") {
          // البحث عن المتغير في القائمة المرسلة أو في القائمة المحلية
          const variable =
            formulaData.variables?.find((v) => v.id === part.variable?.id) ||
            this.formulaVariables.find((v) => v.id === part.variable?.id);
          return {
            ...part,
            variable: variable || part.variable, // الاحتفاظ بالبيانات حتى لو لم يتم العثور على المتغير
          };
        }
        return part;
      });
      console.log("Formula saved successfully:", this.newItem.formulaParts);
    },

    filterFormulaVariables() {
      if (!this.newItem.collection_method) {
        this.filteredFormulaVariables = [];
      } else {
        this.filteredFormulaVariables =
          this.newItem.collection_method == "hybrid"
            ? this.formulaVariables
            : this.formulaVariables.filter(
                (variable) => variable.type === this.newItem.collection_method
              );
      }
    },

    openLinkedEntitiesModal(kpi) {
      this.selectedKpi = kpi;
      this.showLinkedEntitiesModal = true;
    },

    openFrequencyDataModal(kpi) {
      this.selectedKpi = kpi;
      this.showFrequencyDataModal = true;
    },

    // Add this method to handle the success event from the Form component
    handleFormSuccess() {
      this.closeForm();
      this.fetchKpis(); // Refresh the KPI list after successful form submission
    },

    getDefaultKpi() {
      return {
        name: "",
        type: null,
        target_value: null,
        unit: null,
        collection_method: "",
        description: "",
        owners: [],
        contributors: [],
        reviewers: [],
        objectives: [],
        initiatives: [],
        departments: [],
        datasets: [],
        domains: [],
        formulaVariables: [],
        linked_users: [],
      };
    },

    getSelectedOwnersDisplay(owners) {
      return owners.map((owner) => {
        if (owner && owner.user) return { id: owner.user._id, name: owner.user.name };
        if (owner && owner.position)
          return { id: owner.position._id, name: owner.position.name };
        return { id: owner._id, name: owner.name }; // Fallback
      });
    },

    removeOwner(ownersArray, ownerId) {
      const index = ownersArray.findIndex(
        (owner) =>
          (owner.user && owner.user._id === ownerId) ||
          (owner.position && owner.position._id === ownerId) ||
          owner._id === ownerId
      );
      if (index !== -1) {
        ownersArray.splice(index, 1);
      }
    },

    async fetchKpiTypes() {
      try {
        const response = await new KpiTypeApi().getAll();
        this.kpiTypes = response.data;
      } catch (error) {
        console.error("Error fetching KPI types:", error);
      }
    },

    async fetchUnits() {
      try {
        const response = await new KPIUnitApi().getAll();
        this.units = response.data;
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    },

    async fetchUsers() {
      try {
        const response = await new userApi().getAll();
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    canChangeStatus(item) {
      if (item.kpitype?.reviewer_ids) {
        return item.kpitype.reviewer_ids.includes(Auth.USER.id);
      }
      return false;
    },

    async toggleKpiStatus(kpiId) {
      try {
        const response = await this.api.changeStatus(kpiId);
        await this.fetchKpis();
      } catch (error) {
        console.log(error);
      }
    },

    async fetchPositions() {
      try {
        const response = await new positionApi().getAll();
        this.positions = response.data;
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    },

    async fetchObjectives() {
      try {
        const response = await new objectiveApi().getAll();
        this.objectives = response.data;
      } catch (error) {
        console.error("Error fetching objectives:", error);
      }
    },

    async fetchInitiatives() {
      try {
        const response = await new initiativeApi().getAll();
        this.initiatives = response.data;
      } catch (error) {
        console.error("Error fetching initiatives:", error);
      }
    },

    async fetchDepartments() {
      try {
        const response = await new departmentApi().getAll();
        this.departments = response.data;
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    },

    async fetchDomains() {
      try {
        const response = await new domainApi().getAll();
        this.domains = response.data;
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    },

    async fetchDatasets() {
      try {
        // const response = await new datasetApi().getAll();
        // this.datasets = response.data;
      } catch (error) {
        console.error("Error fetching datasets:", error);
      }
    },

    onFilterApplied(filterData) {
      const existingIndex = this.activeFilters.findIndex(
        (f) => f.key === filterData.key && f.value === filterData.value
      );
      if (existingIndex >= 0) {
        this.activeFilters[existingIndex] = filterData;
      } else {
        this.activeFilters.push(filterData);
      }
      // this.fetchKpis(); // Always fetch data when filters change
    },

    onFilterRemoved(filterData) {
      this.activeFilters = this.activeFilters.filter(
        (f) => !(f.key === filterData.key && f.value === filterData.value)
      );
      // this.fetchKpis(); // Always fetch data when filters change
    },

    onOperatorsChanged(operators) {
      this.filterOperators = operators;
      // this.fetchKpis(); // Always fetch data when operators change
    },

    // Keep for backward compatibility
    onOperatorChanged(operator) {
      this.filterOperators = [operator];
      this.fetchKpis();
    },
    async fetchKpis() {
      this.loading = true;
      try {
        const response = await this.api.getAll(this.apiParams);
        this.rawKpis = response.data;
      } catch (error) {
        console.error("Error fetching KPIs:", error);
        this.$toast.error(this.$t("kpi.error_fetching_data"));
      } finally {
        this.loading = false;
      }
    },

    viewReviews(kpi) {
      this.selectedKpi = kpi;
      this.$nextTick(() => {
        this.$refs.reviewsModal.openModal();
      });
    },
    viewDetails(kpi) {
      this.selectedKpi = kpi;
      this.showDetailsModal = true;
    },

    async deleteItem(kpi) {
      if (confirm(this.$t("kpi.confirm_delete"))) {
        try {
          await this.api.delete(kpi.id);
          this.$toast.success(this.$t("kpi.kpi_deleted_successfully"));
          this.fetchKpis();
        } catch (error) {
          console.error("Error deleting KPI:", error);
          this.$toast.error(this.$t("kpi.error_deleting_kpi"));
        }
      }
    },

    applyFilters() {
      this.fetchKpis();
    },

    async loadDynamicData() {
      try {
        this.loading = true;
        const usersApi = new userApi();
        const positionsApi = new positionApi();
        const initiativesApi = new initiativeApi();
        const objectivesApi = new objectiveApi();
        const kpiUnitApi = new KPIUnitApi();
        const departmentsApi = new departmentApi();
        const domainsApi = new domainApi();
        const kpiTypeApi = new KpiTypeApi();
        const formulaVariablesApi = new formulaVariableApi();
        try {
          const testUnits = await kpiUnitApi.getAll();
        } catch (error) {
          console.error("KPIUnitApi test failed:", error); // Debug log
        }
        // Fetch all data in parallel with error handling for each
        const [
          usersResponse,
          positionsResponse,
          initiativesResponse,
          objectivesResponse,
          unitsResponse,
          departmentsResponse,
          domainsResponse,
          kpiTypesResponse,
          formulaVariablesResponse,
        ] = await Promise.all([
          usersApi.getAll().catch((e) => {
            console.error("Failed to load users:", e);
            return { data: [] };
          }),
          positionsApi.getAll().catch((e) => {
            console.error("Failed to load positions:", e);
            return { data: [] };
          }),
          initiativesApi.getAll().catch((e) => {
            console.error("Failed to load initiatives:", e);
            return { data: [] };
          }),
          objectivesApi.getAll().catch((e) => {
            console.error("Failed to load objectives:", e);
            return { data: [] };
          }),
          kpiUnitApi.getAll().catch((e) => {
            console.error("Failed to load units:", e);
            return { data: [] };
          }),
          departmentsApi.getAll().catch((e) => {
            console.error("Failed to load departments:", e);
            return { data: [] };
          }),
          domainsApi.getAll().catch((e) => {
            console.error("Failed to load domains:", e);
            return { data: [] };
          }),
          kpiTypeApi.getAll().catch((e) => {
            console.error("Failed to load KPI types:", e);
            return { data: [] };
          }),
          formulaVariablesApi.getAll().catch((e) => {
            console.error("Failed to load formulaVariables:", e);
            return { data: [] };
          }),
        ]);
        // Process responses
        this.users = (usersResponse?.data || usersResponse || []).map((user) => ({
          ...user,
          name: user.full_name || user.name || this.$t("kpi.Unknown"),
        }));
        this.positions = positionsResponse?.data || positionsResponse || [];
        this.initiatives = initiativesResponse?.data || initiativesResponse || [];
        this.objectives = objectivesResponse?.data || objectivesResponse || [];
        this.departments = departmentsResponse?.data || departmentsResponse || [];
        this.domains = domainsResponse?.data || domainsResponse || [];
        this.formulaVariables =
          formulaVariablesResponse?.data || formulaVariablesResponse || [];
        // Process units
        this.units = (unitsResponse?.data || unitsResponse || []).map((unit) => ({
          id: unit.id || unit._id,
          name: unit.name || this.$t("kpi.Unknown"),
          symbol: unit.symbol || "",
        }));
        this.kpiTypes = (kpiTypesResponse?.data || kpiTypesResponse || []).map(
          (type) => ({
            id: type.id || type._id,
            name: type.name || this.$t("kpi.Unknown"),
          })
        );
      } catch (error) {
        console.error("Error in loadDynamicData:", error);
        this.$toast.error("Failed to load dynamic data");
        throw error; // Re-throw to be caught in created()
      } finally {
        this.loading = false;
      }
    },

    getKpiTypeName(typeId) {
      const kpiType = this.kpiTypes.find((t) => t.id === typeId);
      return kpiType ? kpiType.name : typeId;
    },

    getUnitSymbol(unitId) {
      const unit = this.units.find((u) => u.id === unitId);
      return unit ? unit.symbol : "";
    },

    getCollectionMethodName(method) {
      const methods = [
        { id: "manual", name: this.$t("kpi.manual") },
        { id: "automatic", name: this.$t("kpi.automatic") },
        { id: "hybrid", name: this.$t("kpi.hybrid") },
      ];
      const collectionMethod = methods.find((m) => m.id === method);
      return collectionMethod ? collectionMethod.name : method;
    },

    translateMethod(method) {
      const methods = {
        fixed: this.$t("kpisubmission.fixed"),
        progressive: this.$t("kpisubmission.progressive"),
      };
      return methods[method] || method || this.$t("kpisubmission.na");
    },

    translateFrequency(frequency) {
      const frequencies = {
        "one time": this.$t("kpisubmission.one time"),
        daily: this.$t("kpisubmission.daily"),
        weekly: this.$t("kpisubmission.weekly"),
        monthly: this.$t("kpisubmission.monthly"),
        quarterly: this.$t("kpisubmission.quarterly"),
        yearly: this.$t("kpisubmission.yearly"),
      };
      return frequencies[frequency] || frequency || this.$t("kpisubmission.na");
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

    cleanArray(arr) {
      if (!Array.isArray(arr)) return [];
      return arr.filter((item) => item !== null && item !== undefined);
    },

    // Update fetchKpis to store raw data
    async fetchKpis() {
      this.loading = true;
      try {
        const response = await this.api.getAll(this.apiParams);
        this.rawKpis = response.data || response || []; // Handle different response formats
        // Map owners to include user/position details
        this.kpis = this.rawKpis.map((kpi) => {
          const owners = kpi.owners
            .map((owner) => {
              if (owner && owner.user) {
                return { id: owner.user.id, name: owner.user.full_name, type: "user" };
              } else if (owner && owner.position) {
                return {
                  id: owner.position.id,
                  name: owner.position.name,
                  type: "position",
                };
              }
              return null;
            })
            .filter(Boolean);
          return { ...kpi, owners };
        });
      } catch (error) {
        console.error("Error fetching KPIs:", error);
      } finally {
        this.loading = false;
      }
    },

    buildFilterString() {
      const filterInParams = {};
      // Handle array filters
      if (this.filters.initiatives.length) {
        filterInParams.initiatives = this.filters.initiatives.map((i) => i.id).join(",");
      }
      if (this.filters.objectives.length) {
        filterInParams.objectives = this.filters.objectives.map((o) => o.id).join(",");
      }
      if (this.filters.departments.length) {
        filterInParams.departments = this.filters.departments.map((d) => d.id).join(",");
      }
      if (this.filters.datasets.length) {
        filterInParams.datasets = this.filters.datasets.map((ds) => ds.id).join(",");
      }
      if (this.filters.kpiTypes.length) {
        filterInParams.type = this.filters.kpiTypes.map((t) => t.id).join(",");
      }
      const regularFilters = [];
      return {
        filterIn: filterInParams,
        regularFilters,
      };
    },

    async applyFilters() {
      this.loading = true;
      try {
        const { filterIn, regularFilters } = this.buildFilterString();
        const params = { with: "kpiunit" };
        // Add filterIn params
        Object.entries(filterIn).forEach(([key, value]) => {
          params.filterIn = `${key}|${value}`;
        });
        // Add regular filters
        if (regularFilters.length) {
          params.filter = regularFilters.join("&&");
        }
        // Handle date range
        if (this.filters.startDate || this.filters.endDate) {
          if (this.filters.startDate && this.filters.endDate) {
            // Both dates provided - use filterDateBetween
            params.filterDateBetween = `created_at|${this.filters.startDate}|${this.filters.endDate}`;
          } else if (this.filters.startDate) {
            // Only start date provided - use filterDate with >= operator
            params.filterDate = `created_at|${this.filters.startDate}|>=`;
          } else if (this.filters.endDate) {
            // Only end date provided - use filterDate with <= operator
            params.filterDate = `created_at|${this.filters.endDate}|<=`;
          }
        }
        const response = await this.api.getAll(params);
        this.rawKpis = response.data || response || [];
        this.processKpis();
      } catch (error) {
        console.error("Error applying filters:", error);
        this.$toast.error(this.$t("kpi.filter_error"));
      } finally {
        this.loading = false;
      }
    },

    handleFiltersSaved(payload) {
      // Payload contains { filters: [...], operators: [...] }
      // Map Filter component active filters into this.filters structure
      try {
        // Reset existing filter selections
        this.filters = {
          initiatives: [],
          objectives: [],
          departments: [],
          datasets: [],
          kpiTypes: [],
          startDate: null,
          endDate: null,
        };

        if (!payload || !payload.filters) {
          this.showFilterModal = false;
          this.applyFilters();
          return;
        }

        payload.filters.forEach((f) => {
          const key = f.key;
          const value = f.value;
          if (!key) return;

          // Handle date filters
          if (key === "startDate") {
            this.filters.startDate = value;
            return;
          }
          if (key === "endDate") {
            this.filters.endDate = value;
            return;
          }

          // For multi selects, try to find the matching object in the corresponding array
          const source = this[key] || [];
          if (Array.isArray(source) && source.length) {
            const found = source.find(
              (item) =>
                item.id == value ||
                item._id == value ||
                item.id == String(value) ||
                item._id == String(value)
            );
            if (found) {
              if (!this.filters[key]) this.filters[key] = [];
              this.filters[key].push(found);
            } else {
              // If not found, push a minimal object with id and name
              if (!this.filters[key]) this.filters[key] = [];
              this.filters[key].push({ id: value, name: f.name || value });
            }
          }
        });

        this.showFilterModal = false;
        // Trigger the existing applyFilters flow
        this.applyFilters();
      } catch (err) {
        console.error("Error mapping filters from Filter component:", err);
        this.showFilterModal = false;
        this.applyFilters();
      }
    },

    processKpis() {
      this.kpis = this.rawKpis.map((kpi) => {
        const owners = kpi.owners
          .map((owner) => {
            if (owner && owner.user) {
              return { id: owner.user.id, name: owner.user.full_name, type: "user" };
            } else if (owner && owner.position) {
              return {
                id: owner.position.id,
                name: owner.position.name,
                type: "position",
              };
            }
            return null;
          })
          .filter(Boolean);
        return { ...kpi, owners };
      });
    },

    getObjectiveName(id) {
      const obj = this.objectives.find((o) => o.id === id);
      return obj ? obj.name : "N/A";
    },

    getInitiativeName(id) {
      const init = this.initiatives.find((i) => i.id === id);
      return init ? init.name : "N/A";
    },

    getDepartmentName(id) {
      const dept = this.departments.find((d) => d.id === id);
      return dept ? dept.name : "N/A";
    },

    getDatasetName(id) {
      const ds = this.datasets.find((d) => d.id === id);
      return ds ? ds.name : "N/A";
    },

    getDomainName(id) {
      const dom = this.domains.find((d) => d.id === id);
      return dom ? dom.name : "N/A";
    },

    getFormulaVariableName(id) {
      const formulaVariable = this.formulaVariables.find(
        (formulaVariable) => formulaVariable.id === id
      );
      return formulaVariable ? formulaVariable.name : "N/A";
    },

    getUserName(id) {
      const user = this.users.find((u) => u.id === id);
      return user ? user.name : "N/A";
    },

    viewSubmissions(kpi) {
      // Implement navigation to submissions screen here
    },

    getOwnerName(owners) {
      if (!owners || !Array.isArray(owners)) return "N/A";
      if (owners.length === 0) return "N/A";
      const primaryOwner = owners.find((o) => o.is_primary) || owners[0];
      if (primaryOwner.user) {
        const user = this.users.find((u) => u.id === primaryOwner.user);
        return user ? user.name : "N/A";
      } else if (primaryOwner.position) {
        const position = this.positions.find((p) => p.id === primaryOwner.position);
        return position ? position.title : "N/A";
      }
      return "N/A";
    },

    openForm() {
      this.isFlipped = true;
      this.isReadonly = false;
      this.newItem = this.getDefaultKpi();
    },

    closeForm() {
      this.isFlipped = false;
      this.isReadonly = false;
      this.editMod = false;
      this.newItem = this.fetchKpis();
    },

    async editItem(item) {
      /*
      this.old_collection_method = item.collection_method;
      this.newItem = item;
      this.fetchKpis();
      this.isFlipped = true;
      this.isReadonly = false;
      */
      this.old_collection_method = item.collection_method;
      this.newItem = { ...item };
      // delete this.newItem.id;
      // Ensure formulaVariables is an array of IDs
      this.newItem.formulaVariables = item.formulaVariables
        ? item.formulaVariables.map((v) => (typeof v === "object" ? v._id || v.id : v))
        : [];
      // Initialize selectedVariables for FormulaBuilder
      this.selectedVariables = this.formulaVariables.filter((v) =>
        this.newItem.formulaVariables.includes(v.id)
      );
      if (item.formulaParts) {
        this.newItem.formulaParts = Array.isArray(item.formulaParts)
          ? [...item.formulaParts]
          : [];
      }
      this.isFlipped = true;
      this.isReadonly = false;
      this.editMod = true;
    },

    viewDetails(item) {
      this.selectedKpi = item;
      this.showDetailsModal = true;
    },

    openOwnerDialog() {
      // جلب المالكين الحاليين
      const owners = this.newItem.owners || [];
      // فصل اليوزرات والبوزيشنز
      this.selectedUserOwners = owners
        .filter((owner) => owner?.type === "user")
        .map((owner) => owner.id);
      this.selectedPositionOwners = owners
        .filter((owner) => owner?.type === "position")
        .map((owner) => owner.id);
      // تحديد التبويب الافتراضي بناءً على الاختيارات الموجودة
      if (this.selectedUserOwners.length > 0) {
        this.currentOwnerTab = "users";
      } else if (this.selectedPositionOwners.length > 0) {
        this.currentOwnerTab = "positions";
      } else {
        // إذا لم يكن هناك اختيارات، افتح تبويب اليوزرز افتراضياً
        this.currentOwnerTab = "users";
      }
      this.showOwnerDialog = true;
    },

    async deleteItem(data) {
      await this.api.delete(0, [data.id].map(String)); // API call to delete the item
      this.fetchKpis();
      this.isFlipped = false;
      this.isReadonly = false;
    },

    updateFrequencyOptions() {
      if (this.newItem.method === "fixed") {
        this.frequencyOptions = [
          { id: "one time", name: this.$t("kpi.one time") },
          { id: "daily", name: this.$t("kpi.daily") },
          { id: "weekly", name: this.$t("kpi.weekly") },
          { id: "monthly", name: this.$t("kpi.monthly") },
          { id: "quarterly", name: this.$t("kpi.quarterly") },
          { id: "yearly", name: this.$t("kpi.yearly") },
        ];
      } else {
        this.frequencyOptions = [
          { id: "weekly", name: this.$t("kpi.weekly") },
          { id: "monthly", name: this.$t("kpi.monthly") },
          { id: "quarterly", name: this.$t("kpi.quarterly") },
          { id: "yearly", name: this.$t("kpi.yearly") },
        ];
      }
    },

    //frequency modal component
    openFrequencyModal(frequencyType) {
      if (this.newItem.method === "progressive") {
        this.frequencyModalType = frequencyType;
        this.frequencyData = this.newItem.frequency_data || [];
        this.showFrequencyModal = true;
      }
    },

    handleFrequencySave(data) {
      this.newItem.frequency_data = data;
      this.showFrequencyModal = false;
    },

    selectLinkedType(linkedType) {
      if (linkedType === "objectives") {
        this.newItem.initiatives = null;
        this.newItem.departments = null;
        this.newItem.datasets = null;
        this.newItem.domains = null;
        this.newItem.linked_users = null;
      } else if (linkedType === "initiatives") {
        this.newItem.objectives = null;
        this.newItem.departments = null;
        this.newItem.datasets = null;
        this.newItem.domains = null;
        this.newItem.linked_users = null;
      } else if (linkedType === "departments") {
        this.newItem.objectives = null;
        this.newItem.initiatives = null;
        this.newItem.datasets = null;
        this.newItem.domains = null;
        this.newItem.linked_users = null;
      } else if (linkedType === "datasets") {
        this.newItem.objectives = null;
        this.newItem.initiatives = null;
        this.newItem.departments = null;
        this.newItem.domains = null;
        this.newItem.linked_users = null;
      } else if (linkedType === "domains") {
        this.newItem.objectives = null;
        this.newItem.initiatives = null;
        this.newItem.departments = null;
        this.newItem.datasets = null;
        this.newItem.linked_users = null;
      } else if (linkedType === "linked_users") {
        this.newItem.objectives = null;
        this.newItem.initiatives = null;
        this.newItem.departments = null;
        this.newItem.domains = null;
        this.newItem.datasets = null;
      }
      this.selectType = linkedType;
    },
  },

  watch: {
    "newItem.method": {
      handler(newMethod) {
        this.updateFrequencyOptions();
      },
      immediate: true,
    },

    "newItem.collection_method": {
      handler(collection_method) {
        this.filterFormulaVariables();
        if (
          this.old_collection_method == collection_method &&
          this.newItem.formulaVariables &&
          this.newItem.formulaVariables.length > 0
        ) {
          this.newItem.formulaVariables = this.newItem.formulaVariables;
        } else {
          this.newItem.formulaVariables = [];
          this.newItem.formulaVariables = [];
          this.newItem.formulaParts = [];
          this.newItem.formula = "";
          // Also clear the selected variables in the FormulaBuilder component
          if (this.selectedVariables) {
            this.selectedVariables = [];
          }
        }
      },
      immediate: true,
    },

    "newItem.linkedType": {
      handler(linkedType) {
        this.selectLinkedType(linkedType);
      },
      immediate: true,
    },

    //notification logic
    "newItem.initiatives": {
      async handler(initiatives) {
        if (!initiatives || !initiatives.length) {
          this.newItem.notification_ids = [];
          return;
        }
        try {
          this.newItem.notification_ids = [];
          // Make sure initiatives is an array of IDs
          const initiativeIds = initiatives.map((ini) =>
            typeof ini === "object" ? ini.id : ini
          );
          const response = await new initiativeApi().getAll({
            select: "id|owner_user_ids",
            filterIn: `id|${initiativeIds.join(",")}`,
          });
          // Handle different response formats
          const initiativesData = response || [];
          // Extract all owner_users_ids and flatten
          const allOwnerUserIds = initiativesData.flatMap((initiative) =>
            Array.isArray(initiative.owner_user_ids) ? initiative.owner_user_ids : []
          );
          // Remove duplicates
          const uniqueOwnerUserIds = [...new Set(allOwnerUserIds)].filter(Boolean);
          this.newItem.notification_ids = uniqueOwnerUserIds;
        } catch (error) {
          console.error("Error processing initiative owner users:", error);
          this.newItem.notification_ids = [];
        }
      },
      immediate: true,
    },

    "newItem.objectives": {
      async handler(objectives) {
        if (!objectives || !objectives.length) {
          this.newItem.notification_ids = [];
          return;
        }
        try {
          this.newItem.notification_ids = [];
          // Make sure objectives is an array of IDs
          const objectiveIds = objectives.map((obj) =>
            typeof obj === "object" ? obj.id : obj
          );
          // Step 1: Get all selected objectives with their initiative_ids
          const objectivesResponse = await new objectiveApi().getAll({
            select: "id|initiative_ids",
            filterIn: `id|${objectiveIds.join(",")}`,
          });
          console.log("objectivesResponse", objectivesResponse);
          // Handle different response formats
          const objectivesData = objectivesResponse.data || objectivesResponse || [];
          // Step 2: Extract all initiative_ids and flatten into a single array
          const allInitiativeIds = objectivesData.flatMap((objective) =>
            Array.isArray(objective.initiative_ids) ? objective.initiative_ids : []
          );
          // Remove duplicate initiative IDs
          const uniqueInitiativeIds = [...new Set(allInitiativeIds)].filter(Boolean);
          if (uniqueInitiativeIds.length === 0) {
            this.newItem.notification_ids = [];
            return;
          }
          console.log("uniqueInitiativeIds", uniqueInitiativeIds);
          // Step 3: Get all initiatives with these initiative_ids
          const initiativesResponse = await new initiativeApi().getAll({
            select: "id|owner_user_ids",
            filterIn: `id|${uniqueInitiativeIds.join(",")}`,
          });
          console.log("initiativesResponse", initiativesResponse);
          // Handle different response formats
          const initiativesData = initiativesResponse.data || initiativesResponse || []; // Step 4: Extract all owner_users_ids and flatten into a single array
          const allOwnerUserIds = initiativesData.flatMap((initiative) =>
            Array.isArray(initiative.owner_user_ids) ? initiative.owner_user_ids : []
          );
          console.log("allOwnerUserIds", allOwnerUserIds);
          // Remove duplicates
          const uniqueOwnerUserIds = [...new Set(allOwnerUserIds)].filter(Boolean);
          this.newItem.notification_ids = uniqueOwnerUserIds;
          console.log("Notification IDs:", this.newItem.notification_ids);
        } catch (error) {
          console.error("Error processing objective initiative owner users:", error);
          this.newItem.notification_ids = [];
        }
      },
      immediate: true,
    },

    "newItem.domains": {
      async handler(domains) {
        if (!domains || !domains.length) {
          this.newItem.notification_ids = [];
          return;
        }
        try {
          this.newItem.notification_ids = [];
          // Make sure domains is an array of IDs
          const domainIds = domains.map((dom) =>
            typeof dom === "object" ? dom.id : dom
          );
          const response = await new domainApi().getAll({
            select: "id|owner_users_ids",
            filterIn: `id|${domainIds.join(",")}`,
          });
          // Handle different response formats
          const domainsData = response || [];
          // Extract all owner_users_ids and flatten
          const allOwnerUserIds = domainsData.flatMap((domain) =>
            Array.isArray(domain.owner_users_ids) ? domain.owner_users_ids : []
          );
          // Remove duplicates
          const uniqueOwnerUserIds = [...new Set(allOwnerUserIds)].filter(Boolean);
          this.newItem.notification_ids = uniqueOwnerUserIds;
        } catch (error) {
          console.error("Error processing domain owner users:", error);
          this.newItem.notification_ids = [];
        }
      },
      immediate: true,
    },

    "newItem.datasets": {
      handler(datasets) {
        //notification_ids
        this.newItem.notification_ids = [];
      },
      immediate: true,
    },

    "newItem.departments": {
      async handler(newDepartments, oldDepartments) {
        // Only fetch if departments actually changed
        if (JSON.stringify(newDepartments) === JSON.stringify(oldDepartments)) {
          return;
        }
        if (!newDepartments || !newDepartments.length) {
          this.newItem.notification_ids = [];
          return;
        }
        try {
          this.newItem.notification_ids = [];
          const managerPromises = newDepartments.map(async (deptId) => {
            try {
              const response = await new departmentApi().getDepartmentManagers(deptId);
              return response;
            } catch (error) {
              console.error(`Error fetching managers for department ${deptId}:`, error);
              return [];
            }
          });
          const managersArrays = await Promise.all(managerPromises);
          const allManagers = managersArrays.flat();
          const uniqueManagerIds = [
            ...new Set(
              allManagers.map((manager) => manager.id || manager._id || manager.user_id)
            ),
          ].filter(Boolean);
          this.newItem.notification_ids = uniqueManagerIds;
        } catch (error) {
          console.error("Error processing department managers:", error);
          this.newItem.notification_ids = [];
        }
      },
      immediate: true,
    },

    "newItem.linked_users": {
      async handler(linked_users) {
        //notification_ids
        if (!linked_users || !linked_users.length) {
          this.newItem.notification_ids = [];
          return;
        }
        this.newItem.notification_ids = linked_users;
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
@import "vue-select/dist/vue-select.css";

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
  color: #000000 !important;
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
  background-color: transparent;
  border: 0;
  appearance: none;
  opacity: 0.5;
}

.btn-close:hover {
  opacity: 0.75;
}

.kpi-card-view .card {
  transition: all 0.3s ease;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  background-color: #f5f5f5;
}

.kpi-card-view .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.kpi-card-view .card-body {
  padding: 16px;
}

.kpi-card-view .card-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  width: 150px;
}

.kpi-card-view .card-subtitle {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.kpi-card-view .btn {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
}
/* تحسين المسافات بين البطاقات */
@media (min-width: 768px) {
  .kpi-card-view .col-md-4 {
    padding-left: 10px;
    padding-right: 10px;
  }
}

/* تحسينات للبطاقات الفارغة */
.kpi-card-view .empty-state {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

/* تحسينات للأيقونات */
.kpi-card-view .fa {
  width: 16px;
  text-align: center;
}

/* تحسينات للهواتف */
@media (max-width: 767px) {
  .kpi-card-view .col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* تأثيرات للزر عند الضغط */
.kpi-card-view .btn:active {
  transform: scale(0.95);
}

/* تنسيقات عامة للنموذج */
.form-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-title {
  font-weight: 700;
  color: #000000;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6c757d;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #495057;
}

/* تنسيقات البطاقات الداخلية */
.form-card {
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
}

.card-header {
  padding: 0.75rem 1.25rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  border-radius: 8px 8px 0 0 !important;
}

.card-header h5 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #495057;
}

.card-body {
  padding: 1.25rem;
}

/* تنسيقات حقول خاصة */
.owners-field {
  margin-bottom: 1rem;
}

.selected-owners {
  display: flex;
  flex-wrap: wrap;
}

/* تنسيقات حقول الإدخال */
.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #495057;
}

.form-control,
.form-select {
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus,
.form-select:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* تنسيقات الأزرار */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.btn-primary {
  background-color: #3498db;
  border-color: #3498db;
}

.btn-primary:hover {
  background-color: #2980b9;
  border-color: #2980b9;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

/* تنسيقات متعددة الاختيار */
.multiselect {
  margin-bottom: 1rem;
}

.multiselect__tags {
  border-radius: 6px !important;
  min-height: 38px !important;
}

.multiselect__option--highlight {
  background: #3498db !important;
}

/* تنسيقات للهواتف */
@media (max-width: 767px) {
  .form-container {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

/* تأثيرات حركية */
.form-control,
.form-select,
.btn {
  transition: all 0.3s ease;
}

/* ألوان للتحذيرات والأخطاء */
.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.is-invalid:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.multiselect {
  margin-bottom: 1rem;
}

.multiselect__tags {
  min-height: 38px;
  border-radius: 6px;
  border: 1px solid #ced4da;
}

.multiselect__tag {
  background: #3498db;
}

.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
  background: #2980b9;
}

.multiselect__option--highlight {
  background: #3498db;
}

.card .page-title-card h3 {
  padding: 23px !important;
}

.page-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.gradient-text {
  background: linear-gradient(90deg, #3498db, #2ecc71);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.btn-add-kpi {
  background: linear-gradient(135deg, #2ecc71 0%, #3498db 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
}

.btn-add-kpi:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
}

/* أنماط بطاقات KPI */
.kpi-card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border-top: 4px solid transparent;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.kpi-card-header {
  background: linear-gradient(90deg, #f8f9fa, #ffffff);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
}

.kpi-type-badge {
  padding: 0.35em 0.65em;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-strategic {
  background-color: #3498db;
  color: white;
}

.type-initiative {
  background-color: #2ecc71;
  color: white;
}

.type-data_quality {
  background-color: #9b59b6;
  color: white;
}

.type-departmental {
  background-color: #f39c12;
  color: white;
}

.kpi-progress {
  margin-bottom: 1.5rem;
}

.kpi-card-footer {
  background: rgba(240, 242, 245, 0.7);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem;
}

/* أنماط النموذج */
.kpi-form {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.kpi-form-header {
  background: linear-gradient(90deg, #3498db, #2ecc71);
  color: white;
  padding: 1.5rem;
  border-bottom: none;
}

.kpi-form-header .form-title {
  margin: 0;
  font-weight: 600;
}

.btn-close-form {
  color: white;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.btn-close-form:hover {
  opacity: 1;
}

/* تأثيرات الحركة */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kpi-card {
  animation: fadeIn 0.5s ease forwards;
}

.kpi-card:nth-child(1) {
  animation-delay: 0.1s;
}

.kpi-card:nth-child(2) {
  animation-delay: 0.2s;
}

.kpi-card:nth-child(3) {
  animation-delay: 0.3s;
}

/* وهكذا لباقي البطاقات */

/* تأثيرات hover للأزرار */
.btn-outline-primary:hover {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
  border-color: transparent;
}

.btn-outline-info:hover {
  background: #17a2b8;
  color: white;
  border-color: transparent;
}

.btn-outline-danger:hover {
  background: #dc3545;
  color: white;
  border-color: transparent;
}

.filter-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: none;
}

.filter-card .card-header {
  background: linear-gradient(90deg, #f8f9fa, #ffffff);
  font-weight: 600;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .kpi-card {
    margin-bottom: 1.5rem;
  }
}

.btn-outline-info {
  color: #17a2b8;
  border-color: #17a2b8;
}

.btn-outline-info:hover {
  background-color: #17a2b8;
  color: white;
}

thead tr th .v-data-table-header__content span {
  color: #fff !important;
}

.text-dark {
  color: #333 !important;
}
.target-value {
  font-size: 24px;
  font-weight: 600;
  color: #6e3894;
}
.target-value-title {
  color: #8c8c8c;
  font-size: 14px;
}
.btn-custom {
  border-radius: 10px;
  padding: 6px 12px;
  height: 31px;
  background: #d0b5e3;
  font-weight: 500;
  font-size: 12px;
  color: #43235c;
}
.type-kpi {
  font-weight: 500;
  font-size: 12px;
  color: #43235c;
  background: #d0b5e3;
  padding: 0px 8px;
  border-radius: 10px;
}
.status-kpi {
  font-weight: 500;
  font-size: 12px;
  color: #255f0b;
  padding: 0px 8px;
  background: #b6caae;
  border-radius: 10px;
  height: 20px;
  cursor: pointer;
}
.status-inactive {
  color: #a92525;
  background: #e2b6b6;
}
.creatat-kpi {
  font-size: 10px;
  color: #8c8c8c;
}
.font-card {
  font-size: 12px;
  color: #404040;
}
.font-card-main {
  font-weight: 600;
}
.dropdown-menu {
  padding: 16px;
  border-radius: 10px;
  background: #f8f8f8;
  shadow: #0000004d;
}
.dropdown-menu .dropdown-item {
  border-radius: 10px;
  padding: 0px 16px !important;
  background: #ffffff;
}
.dropdown-menu li:first-child .dropdown-item:hover {
  border-top: solid 2px #6e3894;
}
.dropdown-menu li:first-child .dropdown-item {
  border-radius: 10px;
  padding: 0px 16px !important;
  background: #ffffff;
}
.text-actions {
  font-size: 14px;
  font-weight: 500;
}
.dropdown-item:focus,
.dropdown-item:hover {
  border: 2px solid #6e3894;
}
.secondary-btn {
  color: #43235c;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 14px;
  text-transform: capitalize !important;
  border: 1px solid #6e3894;
  height: 25px;
  font-weight: 500;
}

.filter-btn {
  background-color: #6e3894;
  color: #ffffff;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize !important;
  border: 1px solid #6e3894;
  height: 25px;
}

.text-truncate-with-tooltip {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  position: relative;
}

.text-truncate-with-tooltip:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  white-space: normal;
  width: max-content;
  max-width: 300px;
  font-size: 14px;
  font-weight: normal;
  z-index: 1000;
  margin-bottom: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.text-truncate-with-tooltip:hover::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #333;
  z-index: 1000;
  margin-bottom: -1px;
}
.card-top-filter {
  z-index: 10000000000000000 !important;
}
.filter-overlay {
  background: rgb(0 0 0 / 0%) !important;
}
.btn-owner {
  border-radius: 10px;
  background-color: #6e3894 !important;
}
[dir="rtl"] .rtl {
  flex-direction: row-reverse;
}
[dir="rtl"] .rtl-end {
  text-align: -webkit-right;
}
[dir="rtl"] .rtl-align-items {
  align-items: flex-end;
}
.modal-header {
  justify-content: space-between;
}
[dir="rtl"] .modal-header,
[dir="rtl"] .dropdown-item,
[dir="rtl"] .custom-dropdown,
[dir="rtl"] .form-header {
  flex-direction: row-reverse;
}
[dir="rtl"] .modal-body .row {
  text-align: end;
}
</style>
