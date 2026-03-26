<template>
  <div class="text-[var(--color-text-primary)]" :dir="isArabic ? 'rtl' : 'ltr'">

    <!-- Filters Section -->
  <div v-if="showFilter"
      class="bg-[var(--color-bg)] mb-6 p-4 border border-[var(--color-border)] rounded-xl shadow-sm">
      <slot name="filters"></slot>
    </div>

    <!-- Toolbar -->
    <div class="mb-4">
      <div class="flex gap-3 items-center bg-[#F2F4F8] px-4 py-3 border border-[#C3D0E5] rounded-lg shadow-sm">

        <!-- Search -->
        <div class="w-1/3 flex-shrink-0 relative">
          <input
            v-model="searchQuery"
            @input="debouncedFetchData"
            type="text"
            class="w-full ps-4 pe-10 py-2 bg-white border border-[#C3D0E5] rounded-lg focus:ring-1 focus:ring-[#29457E] outline-none transition-all text-sm h-[40px] text-[#475467] placeholder:text-[#98A2B3]"
            :placeholder="$t ? $t('Search') : 'Search...'"
          />
          <span class="absolute inset-y-0 end-0 flex items-center pe-3 text-[#98A2B3] pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
        </div>

        <!-- Columns + Filter Buttons -->
        <div class="flex items-center gap-2 flex-1">
          <!-- Columns Button & Dropdown Container -->
          <div class="relative">
            <!-- Columns Button -->
            <button
            style="border: 1px solid var(--color-main); color: var(--color-main);"
              class="flex items-center gap-2 px-4 py-2 text-[#29457E] rounded-lg hover:bg-blue-50 transition-all font-medium text-sm h-[40px]"
              @click.stop="toggleDropdown($event)">
              <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.75 0.75H11.75H0.75ZM0.75 5.75H11.75H0.75ZM0.75 10.75H11.75H0.75Z" fill="var(--color-main)"/>
                <path d="M0.75 0.75H11.75M0.75 5.75H11.75M0.75 10.75H11.75" stroke="var(--color-main)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Columns</span>
            </button>
            
            <!-- Columns Dropdown -->
            <div v-if="showDropdown" class="absolute top-full left-0 mt-1 z-[9999] bg-white border border-[#D0D5DD] rounded-xl shadow-lg w-56 py-3 overflow-hidden" @click.stop>
              <div class="px-4 pb-3 mb-2 border-b border-[#F2F4F7] flex justify-between gap-2">
                <button @click="showAllColumns" class="text-xs text-[#29457E] font-semibold hover:underline flex-1 text-center py-1">Show All</button>
                <div class="w-px bg-[#F2F4F7]"></div>
                <button @click="hideAllColumns" class="text-xs text-[#6B7280] font-semibold hover:underline flex-1 text-center py-1">Hide All</button>
              </div>
              <div class="max-h-64 overflow-y-auto px-2 space-y-0.5">
                <label v-for="(col, index) in processedColumns" :key="index"
                  v-show="index > 1 && col.title !== 'Actions' && col.title !== $t?.('common.actions')"
                  class="flex items-center gap-3 px-3 py-2 hover:bg-[#F8F9FA] rounded-lg cursor-pointer transition-colors">
                  <input type="checkbox" :checked="visibleColumns.length > 0 ? visibleColumns[index] : true" @change="toggleColumn(index)"
                    class="w-4 h-4 text-[#29457E] border-[#D0D5DD] rounded focus:ring-[#29457E] transition-colors cursor-pointer">
                  <span class="text-sm font-medium text-[#344054] truncate select-none">{{ col.title }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Filter Button -->
          <button
             style="border: 1px solid var(--color-main); color: var(--color-main);"
            class="flex items-center gap-2 px-4 py-2 text-[#29457E] rounded-lg hover:bg-blue-50 transition-all font-medium text-sm h-[40px]"
            @click="openFilterModal"
            :disabled="!filters || filters.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': !filters || filters.length === 0 }">
         <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 0.75H14.75H0.75ZM3.25 5.75H12.25H3.25ZM6.25 10.75H9.25H6.25Z" fill="var(--color-main)"/>
<path d="M0.75 0.75H14.75M3.25 5.75H12.25M6.25 10.75H9.25" stroke="var(--color-main)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

            <span>Filter</span>
            <span v-if="activeFilters && activeFilters.length"
              class="bg-[#29457E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              {{ activeFilters.length }}
            </span>
          </button>
        </div>

        <!-- Right Action Buttons -->
        <div class="flex items-center gap-2 flex-1 justify-end">

          <!-- Edit Button -->
          <button
            @click="selected.length === 1 && editItem(data.find(r => r.id === selected[0]))"
            :disabled="selected.length !== 1"
            :class="{ 'opacity-50 cursor-not-allowed': selected.length !== 1 }"
            style="border: 1px solid #E68F1D; color: #E68F1D;"
            class="w-[40px] h-[40px] rounded-lg hover:bg-yellow-50 flex items-center justify-center transition-all">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.04545 0.200743C8.16485 0.150748 8.29301 0.125 8.42246 0.125C8.55191 0.125 8.68007 0.150748 8.79948 0.200743C8.91819 0.250448 9.02589 0.323133 9.11639 0.414608L11.8354 3.1336C11.9269 3.2241 11.9995 3.33181 12.0493 3.45052C12.0993 3.56993 12.125 3.69808 12.125 3.82754C12.125 3.95699 12.0993 4.08515 12.0493 4.20455C11.9996 4.32326 11.9269 4.43095 11.8354 4.52145L4.37482 11.982C4.28328 12.0736 4.15914 12.125 4.02969 12.125H1.10117C0.842276 12.125 0.593983 12.0222 0.410914 11.8391C0.227846 11.656 0.125 11.4077 0.125 11.1488V8.07735M8.04545 0.200743C7.92672 0.250456 7.819 0.323156 7.72849 0.414652L8.04545 0.200743ZM1.10117 8.42248V11.1488H3.82752L11.1488 3.82753L11.1462 3.82491L8.42245 1.10118L8.41984 1.10383L1.10117 8.42248Z" fill="#E68F1D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.5416 11.6369C3.5416 11.3674 3.76013 11.1488 4.02969 11.1488H11.351C11.6205 11.1488 11.8391 11.3674 11.8391 11.6369C11.8391 11.9065 11.6205 12.125 11.351 12.125L4.02969 12.125C3.76013 12.125 3.5416 11.9065 3.5416 11.6369Z" fill="#E68F1D"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.15123 2.08447C6.34184 1.89386 6.62464 1.82754 6.81525 2.01815L10.2318 5.43475C10.4225 5.62536 10.4225 5.9344 10.2318 6.12501C10.0412 6.31562 9.7322 6.31562 9.54159 6.12501L6.12499 2.70841C5.93438 2.5178 5.96062 2.27508 6.15123 2.08447Z" fill="#E68F1D"/>
<path d="M8.04545 0.200743C8.16485 0.150748 8.29301 0.125 8.42246 0.125C8.55191 0.125 8.68007 0.150748 8.79948 0.200743C8.91819 0.250448 9.02589 0.323133 9.11639 0.414608L11.8354 3.1336C11.9269 3.2241 11.9996 3.33181 12.0493 3.45052C12.0993 3.56993 12.125 3.69808 12.125 3.82754C12.125 3.95699 12.0993 4.08515 12.0493 4.20455C11.9996 4.32326 11.9269 4.43095 11.8354 4.52145L4.37482 11.982C4.28328 12.0736 4.15914 12.125 4.02969 12.125M8.04545 0.200743L0.125 8.07735V11.1488C0.125 11.4077 0.227846 11.656 0.410914 11.8391C0.593983 12.0222 0.842276 12.125 1.10117 12.125H4.02969M8.04545 0.200743C7.92672 0.250456 7.819 0.323156 7.72849 0.414652L8.04545 0.200743ZM4.02969 12.125L11.351 12.125C11.6205 12.125 11.8391 11.9065 11.8391 11.6369C11.8391 11.3674 11.6205 11.1488 11.351 11.1488H4.02969C3.76013 11.1488 3.5416 11.3674 3.5416 11.6369C3.5416 11.9065 3.76013 12.125 4.02969 12.125ZM1.10117 11.1488V8.42248L8.41984 1.10383L8.42245 1.10118L11.1462 3.82491L11.1488 3.82753L3.82752 11.1488H1.10117ZM6.81525 2.01815C6.62464 1.82754 6.34184 1.89386 6.15123 2.08447C5.96062 2.27508 5.93438 2.5178 6.12499 2.70841L9.54159 6.12501C9.7322 6.31562 10.0412 6.31562 10.2318 6.12501C10.4225 5.9344 10.4225 5.62536 10.2318 5.43475L6.81525 2.01815Z" stroke="#E68F1D" stroke-width="0.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          </button>

          <!-- Delete Button -->
          <button
            @click="multiDelete"
            :disabled="selected.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': selected.length === 0 }"
            style="border: 1px solid #C62828; color: #C62828;"
            class="w-[40px] h-[40px] rounded-lg hover:bg-red-50 flex items-center justify-center transition-all">
         <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.25 2.55769C0.25 2.30279 0.455203 2.09615 0.708333 2.09615H10.7917C11.0448 2.09615 11.25 2.30279 11.25 2.55769C11.25 2.81259 11.0448 3.01923 10.7917 3.01923H0.708333C0.455203 3.01923 0.25 2.81259 0.25 2.55769Z" fill="#C62828"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.375 4.86538C4.62813 4.86538 4.83333 5.07202 4.83333 5.32692V9.01923C4.83333 9.27413 4.62813 9.48077 4.375 9.48077C4.12187 9.48077 3.91667 9.27413 3.91667 9.01923V5.32692C3.91667 5.07202 4.12187 4.86538 4.375 4.86538Z" fill="#C62828"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.125 4.86538C7.37813 4.86538 7.58333 5.07202 7.58333 5.32692V9.01923C7.58333 9.27413 7.37813 9.48077 7.125 9.48077C6.87187 9.48077 6.66667 9.27413 6.66667 9.01923V5.32692C6.66667 5.07202 6.87187 4.86538 7.125 4.86538Z" fill="#C62828"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.625 2.09615C1.87813 2.09615 2.08333 2.30279 2.08333 2.55769V11.3269H9.41667V2.55769C9.41667 2.30279 9.62187 2.09615 9.875 2.09615C10.1281 2.09615 10.3333 2.30279 10.3333 2.55769V11.3269C10.3333 11.5717 10.2368 11.8065 10.0648 11.9796C9.89294 12.1527 9.65978 12.25 9.41667 12.25H2.08333C1.84022 12.25 1.60706 12.1527 1.43515 11.9796C1.26324 11.8065 1.16667 11.5717 1.16667 11.3269V2.55769C1.16667 2.30279 1.37187 2.09615 1.625 2.09615Z" fill="#C62828"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.40273 0.655544C3.66059 0.395879 4.01033 0.25 4.375 0.25H7.125C7.48967 0.25 7.83941 0.395879 8.09727 0.655544C8.35513 0.91521 8.5 1.26739 8.5 1.63462V2.55769C8.5 2.81259 8.2948 3.01923 8.04167 3.01923C7.78854 3.01923 7.58333 2.81259 7.58333 2.55769V1.63462C7.58333 1.51221 7.53504 1.39481 7.44909 1.30826C7.36314 1.2217 7.24656 1.17308 7.125 1.17308H4.375C4.25344 1.17308 4.13686 1.2217 4.05091 1.30826C3.96496 1.39481 3.91667 1.51221 3.91667 1.63462V2.55769C3.91667 2.81259 3.71146 3.01923 3.45833 3.01923C3.2052 3.01923 3 2.81259 3 2.55769V1.63462C3 1.26739 3.14487 0.91521 3.40273 0.655544Z" fill="#C62828"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.25 2.55769C0.25 2.30279 0.455203 2.09615 0.708333 2.09615H10.7917C11.0448 2.09615 11.25 2.30279 11.25 2.55769C11.25 2.81259 11.0448 3.01923 10.7917 3.01923H0.708333C0.455203 3.01923 0.25 2.81259 0.25 2.55769Z" stroke="#C62828" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.375 4.86538C4.62813 4.86538 4.83333 5.07202 4.83333 5.32692V9.01923C4.83333 9.27413 4.62813 9.48077 4.375 9.48077C4.12187 9.48077 3.91667 9.27413 3.91667 9.01923V5.32692C3.91667 5.07202 4.12187 4.86538 4.375 4.86538Z" stroke="#C62828" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.125 4.86538C7.37813 4.86538 7.58333 5.07202 7.58333 5.32692V9.01923C7.58333 9.27413 7.37813 9.48077 7.125 9.48077C6.87187 9.48077 6.66667 9.27413 6.66667 9.01923V5.32692C6.66667 5.07202 6.87187 4.86538 7.125 4.86538Z" stroke="#C62828" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.625 2.09615C1.87813 2.09615 2.08333 2.30279 2.08333 2.55769V11.3269H9.41667V2.55769C9.41667 2.30279 9.62187 2.09615 9.875 2.09615C10.1281 2.09615 10.3333 2.30279 10.3333 2.55769V11.3269C10.3333 11.5717 10.2368 11.8065 10.0648 11.9796C9.89294 12.1527 9.65978 12.25 9.41667 12.25H2.08333C1.84022 12.25 1.60706 12.1527 1.43515 11.9796C1.26324 11.8065 1.16667 11.5717 1.16667 11.3269V2.55769C1.16667 2.30279 1.37187 2.09615 1.625 2.09615Z" stroke="#C62828" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.40273 0.655544C3.66059 0.395879 4.01033 0.25 4.375 0.25H7.125C7.48967 0.25 7.83941 0.395879 8.09727 0.655544C8.35513 0.91521 8.5 1.26739 8.5 1.63462V2.55769C8.5 2.81259 8.2948 3.01923 8.04167 3.01923C7.78854 3.01923 7.58333 2.81259 7.58333 2.55769V1.63462C7.58333 1.51221 7.53504 1.39481 7.44909 1.30826C7.36314 1.2217 7.24656 1.17308 7.125 1.17308H4.375C4.25344 1.17308 4.13686 1.2217 4.05091 1.30826C3.96496 1.39481 3.91667 1.51221 3.91667 1.63462V2.55769C3.91667 2.81259 3.71146 3.01923 3.45833 3.01923C3.2052 3.01923 3 2.81259 3 2.55769V1.63462C3 1.26739 3.14487 0.91521 3.40273 0.655544Z" stroke="#C62828" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          </button>

          <!-- Export Button -->
          <div class="relative w-[40px] h-[40px]" v-if="!hideAddExportButton">
            <button
           style="border: 1px solid var(--color-main); color: var(--color-main);"
              class="w-[40px] h-[40px] rounded-lg hover:bg-blue-50 flex items-center justify-center transition-all"
              @click="toggleExportDropdown($event)">
             <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9397 5.67407C12.0682 5.67407 12.1915 5.7249 12.2825 5.81567C12.3734 5.90645 12.425 6.02994 12.425 6.15845C12.4251 7.63661 12.4821 9.14476 12.425 10.6331C12.4186 10.8798 12.3622 11.1227 12.261 11.3479C12.1595 11.5736 12.0142 11.7775 11.8333 11.9465C11.6524 12.1155 11.4395 12.2471 11.2073 12.3333C10.977 12.4187 10.7321 12.4566 10.4866 12.4475V12.4485L1.97778 12.4504H1.97388V12.4495C1.72266 12.4424 1.47493 12.3858 1.24634 12.2815C1.01785 12.1772 0.812534 12.028 0.642822 11.843C0.473078 11.658 0.342093 11.4408 0.258057 11.2043C0.174008 10.9679 0.138536 10.7166 0.153564 10.4661C0.145618 9.02998 0.153563 7.59286 0.153564 6.15845C0.153564 6.02993 0.205173 5.90646 0.296143 5.81567C0.387092 5.72497 0.510461 5.67407 0.638916 5.67407C0.767274 5.67418 0.890825 5.725 0.981689 5.81567C1.07247 5.90643 1.12329 6.03007 1.12329 6.15845C1.12329 7.63188 1.10188 9.09856 1.12329 10.5676C1.12812 10.8956 1.25168 11.1163 1.43579 11.259C1.62526 11.4057 1.89473 11.4817 2.20435 11.4817H10.5559C10.7361 11.4857 10.9132 11.4349 11.0637 11.3362C11.2131 11.2382 11.3279 11.0967 11.3958 10.9319C11.4529 10.7224 11.4737 10.5048 11.4553 10.2883L11.4543 10.2756H11.4553V6.15845C11.4553 6.03001 11.5061 5.90644 11.5969 5.81567C11.6878 5.72494 11.8113 5.67411 11.9397 5.67407ZM6.28638 0.149658C6.41481 0.149713 6.53824 0.201514 6.62915 0.292236C6.71985 0.382933 6.77069 0.505757 6.77075 0.634033V7.45239L8.40063 5.82642L8.40259 5.82446C8.49404 5.73643 8.61647 5.68762 8.74341 5.68872C8.87044 5.68983 8.99235 5.74059 9.08228 5.83032C9.1722 5.92007 9.22277 6.04214 9.22388 6.16919C9.22491 6.29614 9.17643 6.41878 9.08813 6.51001L9.08618 6.51196L9.08521 6.51099L6.62915 8.96216C6.55195 9.0409 6.44952 9.08787 6.34009 9.09692C6.31571 9.10281 6.29435 9.10491 6.27661 9.10376C6.26734 9.10314 6.25877 9.10179 6.25317 9.10083C6.24831 9.09999 6.24331 9.09905 6.24243 9.09888H6.24536C6.13126 9.09291 6.02298 9.04554 5.94263 8.96411L3.4856 6.51099L3.48364 6.51001C3.39534 6.41878 3.34687 6.29614 3.3479 6.16919C3.34901 6.04213 3.39956 5.92007 3.4895 5.83032C3.57943 5.7406 3.70135 5.68982 3.82837 5.68872C3.9553 5.68764 4.07775 5.73641 4.16919 5.82446L4.17114 5.82642L5.80103 7.45239V0.634033C5.80108 0.50566 5.85277 0.382953 5.9436 0.292236C6.03456 0.201465 6.15788 0.149658 6.28638 0.149658Z" fill="var(--color-main)" stroke="var(--color-main)" stroke-width="0.3"/>
</svg>

            </button>
            <div v-if="showExportDropdown"
              class="absolute end-0 mt-2 w-48 bg-white border border-[var(--color-border)] rounded-lg shadow-lg z-50 overflow-hidden"
              @click.stop>
              <div class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors text-sm font-medium text-[#374151]"
                @click="handleExportAll">Export All Data</div>
              <div class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors text-sm font-medium text-[#374151]"
                @click="handleExportCurrent">Export Current Page</div>
              <div class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-t border-[#E5E7EB] text-sm font-medium text-[#374151]"
                @click="openColumnSelection">Select Columns</div>
            </div>
          </div>

          <!-- Import Button -->
          <div class="flex-shrink-0" v-if="!hideAddImportButton">
            <button
             style="border: 1px solid var(--color-main); color: var(--color-main);"
              class="w-[40px] h-[40px] rounded-lg hover:bg-blue-50 flex items-center justify-center transition-all"
              @click="toggleModal()">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9397 5.66919C12.0682 5.66919 12.1915 5.71998 12.2825 5.81079C12.3734 5.90163 12.425 6.02502 12.425 6.15356C12.4251 7.63303 12.4821 9.14249 12.425 10.6321C12.4185 10.8789 12.3622 11.1217 12.261 11.3469C12.1595 11.5728 12.0142 11.7764 11.8333 11.9456C11.6523 12.1148 11.4396 12.247 11.2073 12.3333C10.977 12.4187 10.7321 12.4566 10.4866 12.4475V12.4485L1.97778 12.4504H1.97388V12.4495C1.72264 12.4424 1.47494 12.3858 1.24634 12.2815C1.01781 12.1771 0.812548 12.0271 0.642822 11.842C0.473194 11.657 0.342045 11.4399 0.258057 11.2034C0.174054 10.9668 0.138576 10.7156 0.153564 10.4651C0.145614 9.0277 0.153564 7.58928 0.153564 6.15356C0.153564 6.02502 0.205186 5.90163 0.296143 5.81079C0.387078 5.72006 0.510452 5.66919 0.638916 5.66919C0.76731 5.6693 0.890834 5.72005 0.981689 5.81079C1.07249 5.90161 1.12329 6.02513 1.12329 6.15356C1.12329 7.62809 1.10188 9.09552 1.12329 10.5657C1.12805 10.8943 1.25144 11.1162 1.43579 11.259C1.62526 11.4058 1.89475 11.4807 2.20435 11.4807H10.5559C10.7361 11.4847 10.9132 11.4341 11.0637 11.3352C11.2131 11.2371 11.3279 11.0959 11.3958 10.9309C11.453 10.7211 11.4737 10.5031 11.4553 10.2864L11.4543 10.2737H11.4553V6.15356C11.4553 6.02507 11.506 5.90162 11.5969 5.81079C11.6878 5.72 11.8112 5.66923 11.9397 5.66919ZM6.3147 0.156494H6.32056C6.43732 0.161135 6.54834 0.209734 6.63013 0.293213L6.62915 0.294189L9.08716 2.74634L9.08813 2.74829C9.17641 2.83957 9.22587 2.96214 9.22485 3.08911C9.22375 3.2162 9.1722 3.33817 9.08228 3.42798C8.99246 3.51755 8.87123 3.56839 8.74438 3.56958C8.61731 3.57068 8.49405 3.52206 8.40259 3.43384L8.40161 3.43188L6.77075 1.80396V8.62817C6.77075 8.75669 6.72006 8.88012 6.62915 8.97095C6.53825 9.06173 6.41484 9.11249 6.28638 9.11255C6.1579 9.11255 6.03454 9.0617 5.9436 8.97095C5.85265 8.88011 5.80103 8.75672 5.80103 8.62817V1.80396L4.17114 3.43188L4.16919 3.43384C4.07775 3.52199 3.95537 3.57066 3.82837 3.56958C3.70129 3.56848 3.57942 3.51778 3.4895 3.42798C3.3996 3.33817 3.34901 3.21618 3.3479 3.08911C3.34688 2.96214 3.39537 2.83957 3.48364 2.74829L3.4856 2.74634L5.94263 0.292236C6.01601 0.217824 6.11296 0.173483 6.21606 0.161377C6.21916 0.160211 6.22231 0.15855 6.22583 0.157471C6.24492 0.151668 6.26584 0.149044 6.28735 0.150635C6.29743 0.151383 6.30638 0.154524 6.3147 0.156494Z" fill="var(--color-main)" stroke="var(--color-main)" stroke-width="0.3"/>
</svg>

            </button>
          </div>

          <!-- Add New Button -->
          <div class="flex-shrink-0" v-if="!hideAddNewButton">
            <button
              class="px-4 py-2 bg-[var(--color-main)] text-white rounded-lg bg-[var(--color-hover)] transition-all flex items-center justify-center gap-2 shadow-sm font-semibold h-[40px] text-sm"
              @click="openForm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              </svg>
              <span>{{ addNewButtonTitle || 'Add' }}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
    <!-- Table Container -->
    <div class="overflow-x-auto bg-white border border-[#D0D5DD] rounded-2xl shadow-sm">
      <table :id="id" class="w-full text-sm text-start">
        <!-- Table Head -->
        <thead class="bg-[#F8F9FA] text-[#1E293B]">
          <tr class="border-b border-[#D0D5DD]">
            <th class="px-5 py-2 w-12">
              <input type="checkbox" class="w-4 h-4 rounded border-[#D0D5DD] text-[#29457E] cursor-pointer outline-none" />
            </th>
            <th class="px-5 py-2 text-sm font-semibold text-[#1E293B] whitespace-nowrap w-12">#</th>
            <th v-for="(col, idx) in columns" :key="idx"
              v-show="visibleColumns.length === 0 || visibleColumns[idx + 2] !== false"
              class="px-5 py-2 text-sm font-semibold text-[#1E293B] whitespace-nowrap"
              :class="col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-end' : 'text-start')">
              <span v-if="col.sortable !== false && col.data && (visibleColumns.length === 0 || visibleColumns[idx] !== false)" @click="sortBy(col.data)"
                class="cursor-pointer select-none inline-flex items-center gap-1 hover:text-[#29457E] transition-colors">
                {{ col.title }}
                <span v-if="currentSort === col.data" class="text-[#29457E]">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </span>
              <span v-else-if="visibleColumns.length === 0 || visibleColumns[idx] !== false">{{ col.title }}</span>
            </th>
            <th class="px-5 py-2 text-sm font-semibold text-[#1E293B] text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <!-- Loading -->
        <tbody v-if="load">
          <tr>
            <td :colspan="columns.length + 3" class="text-center py-12">
              <div class="flex flex-col items-center gap-3">
                <div class="loader"></div>
                <span class="text-sm text-[#98A2B3]">Loading...</span>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Empty State -->
        <tbody v-else-if="!load && paginatedData.length === 0">
          <tr>
            <td :colspan="columns.length + 3" class="text-center py-12 text-[#98A2B3] text-sm">
              No data available
            </td>
          </tr>
        </tbody>

        <!-- Data Rows -->
        <tbody v-else class="divide-y divide-[#F2F4F7]">
          <tr v-for="(row, index) in paginatedData" :key="row.id || index"
            class="hover:bg-[#F8F9FA] transition-colors group">

            <!-- Checkbox -->
            <td class="px-5 py-4 w-12">
              <input type="checkbox" :value="row.id" v-model="selected"
                class="w-4 h-4 rounded border-[#D0D5DD] text-[#29457E] cursor-pointer outline-none" />
            </td>

            <!-- Row Number -->
            <td class="px-5 py-4 text-[#475467] font-medium text-sm w-12">
              {{ (currentPage - 1) * perPage + index + 1 }}
            </td>

            <!-- Data Cells -->
            <template v-for="(col, colIdx) in columns" :key="colIdx">
              <td v-show="visibleColumns.length === 0 || visibleColumns[colIdx + 2] !== false" class="px-5 py-4 text-[#475467] text-sm"
                :class="col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-end' : 'text-start')">
                <slot :name="col.id || col.title" :item="row" :rowIndex="colIdx">
                  <!-- Badge style for specific columns -->
                  <template v-if="col.badge">
                    <span class="inline-flex items-center px-3 py-1 rounded-md bg-[#EEF0F6] text-[#475467] text-xs font-medium">
                      {{ getCellValue(row, col) }}
                    </span>
                  </template>
                  <template v-else>
                    <div class="flex items-center gap-2">
                      <template v-if="shouldTruncate(getCellValue(row, col))">
                        <span class="truncate max-w-[180px]">{{ getTruncatedText(getCellValue(row, col)) }}</span>
                        <button
                          class="text-xs font-semibold text-[#29457E] hover:underline whitespace-nowrap"
                          @click="showFullContent(col.title, getCellValue(row, col))">
                          see more
                        </button>
                      </template>
                      <template v-else>
                        <span>{{ stripHtmlTags(getCellValue(row, col)) }}</span>
                      </template>
                    </div>
                  </template>
                </slot>
              </td>
            </template>

            <!-- Actions Column -->
            <td class="px-5 py-4 text-center">
              <div class="relative inline-block">
                <button
                  @click.stop="toggleRowMenu(row.id || index)"
                  class="p-2 hover:bg-[#F2F4F7] rounded-lg transition-colors flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="5" r="1.8" fill="#475467" />
                    <circle cx="12" cy="12" r="1.8" fill="#475467" />
                    <circle cx="12" cy="19" r="1.8" fill="#475467" />
                  </svg>
                </button>
                <!-- Row Actions Dropdown -->
                <div v-if="openMenuId === (row.id || index)"
                  class="absolute end-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-50 overflow-hidden py-1"
                  @click.stop>
                  <slot name="addAction" :item="row"></slot>
                  <slot name="AddStatus" :item="row"></slot>
                  <slot name="view" :item="row"></slot>
                  <slot name="taskComment" :item="row"></slot>
                  <slot name="edit" :item="row">
                    <button
                      @click="editItem(row); openMenuId = null"
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F5F5F5] transition-colors font-medium">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M16.474 5.408l2.118 2.117m-.756-3.98a2.5 2.5 0 0 1 3.536 0 2.5 2.5 0 0 1 0 3.536L5.854 22.599a1.5 1.5 0 0 1-.722.398l-3.66.903a.5.5 0 0 1-.607-.607l.903-3.66a1.5 1.5 0 0 1 .398-.722L17.836 3.545z"
                          stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      Edit
                    </button>
                  </slot>
                  <slot name="delete" :item="row">
                    <button
                      @click="deleteItem(row); openMenuId = null"
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#D92D20] hover:bg-[#FFF5F5] transition-colors font-medium">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M4 7h16M10 11v6m4-6v6M5 7l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                          stroke="#D92D20" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      Delete
                    </button>
                  </slot>
                </div>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex flex-wrap items-center justify-between gap-4 mt-5 py-2">
      <!-- Groups selector + count -->
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-[#475467]">Groups:</span>
        <div class="relative">
          <select
            v-model="perPage"
            class="appearance-none bg-white border border-[#D0D5DD] rounded-lg ps-3 pe-7 py-1.5 outline-none focus:ring-1 focus:ring-[#29457E] text-[#475467] text-sm h-[34px] min-w-[58px] cursor-pointer">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-[#98A2B3]">
            <svg width="10" height="10" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </div>
        <span class="text-sm font-medium text-[#475467]">
          {{ startRecord }} Of {{ totalRecords }} Items
        </span>
      </div>

      <!-- Page Navigation -->
      <nav class="flex items-center gap-1">
        <!-- Prev -->
        <button
          @click="currentPage > 1 ? goToPage(currentPage - 1) : null"
          :disabled="currentPage <= 1 || !canNavigate()"
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-[#6B80A6] text-white hover:bg-[#4A5F8A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :class="{ 'rotate-180': isArabic }">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center gap-0.5 mx-1">
          <button
            v-for="page in paginationPages"
            :key="page"
            @click="goToPage(page)"
            class="min-w-[30px] h-8 px-1.5 rounded-md text-sm font-medium transition-all"
            :class="currentPage === page
              ? 'text-[#29457E] font-bold text-base'
              : 'text-[#8F9BB3] hover:bg-[#EEF0F6]'">
            {{ page }}
          </button>
        </div>

        <!-- Next -->
        <button
          @click="currentPage < totalPages ? goToPage(currentPage + 1) : null"
          :disabled="currentPage >= totalPages || !canNavigate()"
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-[#6B80A6] text-white hover:bg-[#4A5F8A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :class="{ 'rotate-180': isArabic }">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </nav>
    </div>

    <!-- Content Full Text Modal -->
    <Teleport to="body">
      <div v-if="showContentModal" :dir="isArabic ? 'rtl' : 'ltr'"
        class="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4"
        @click="closeContentModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          @click.stop>
          <div class="flex items-center justify-between px-6 py-4 bg-[#F8F9FA] border-b border-[#E5E7EB]">
            <h4 class="text-base font-semibold text-[#1E293B]">{{ modalContent.title }}</h4>
            <button @click="closeContentModal"
              class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#E5E7EB] transition-colors text-[#6B7280]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="p-6">
            <p class="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{{ modalContent.content }}</p>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Import Modal -->
    <Teleport to="body">
      <div v-if="showModal" :dir="isArabic ? 'rtl' : 'ltr'"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          <div class="bg-[#29457E] px-6 py-4 flex items-center justify-between text-white">
            <h3 class="text-lg font-bold flex items-center gap-2">Import Data</h3>
            <button @click="toggleModal"
              class="w-8 h-8 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center text-xl">✕</button>
          </div>
          <div class="p-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 block">Upload File</label>
                <input type="file" ref="file"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#29457E] hover:file:bg-[#29457E] hover:file:text-white file:transition-all file:cursor-pointer border border-gray-200 rounded-xl p-2 outline-none"
                  required @change="handleFileUpload" />
              </div>
              <button type="button"
                class="w-full py-3 bg-[#29457E] text-white rounded-xl font-bold hover:bg-[#1E366A] shadow-lg transition-all"
                @click="handleImport">
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Export Column Selection Modal -->
    <Teleport to="body">
      <div v-if="showColumnSelectionModal" :dir="isArabic ? 'rtl' : 'ltr'"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        @click="closeColumnSelection">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" @click.stop>
          <div class="bg-[#29457E] px-6 py-4 flex items-center justify-between text-white">
            <h5 class="text-lg font-bold">Select Columns to Export</h5>
            <button @click="closeColumnSelection"
              class="hover:bg-white/20 p-1 rounded-full transition-colors text-xl">✕</button>
          </div>
          <div class="p-6">
            <div class="flex gap-3 mb-6">
              <button @click="selectAllExportColumns"
                class="px-4 py-2 border border-[#29457E] text-[#29457E] rounded-lg hover:bg-[#29457E] hover:text-white transition-all text-sm font-medium">
                Select All
              </button>
              <button @click="deselectAllExportColumns"
                class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                Deselect All
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pe-2">
              <div v-for="(column, index) in exportableColumns" :key="index"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#29457E] transition-all cursor-pointer"
                @click="selectedExportColumns.includes(column.data)
                  ? selectedExportColumns = selectedExportColumns.filter(c => c !== column.data)
                  : selectedExportColumns.push(column.data)">
                <input type="checkbox" v-model="selectedExportColumns" :value="column.data"
                  class="w-4 h-4 rounded text-[#29457E] cursor-pointer" />
                <span class="text-sm font-medium text-gray-700">{{ column.title }}</span>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button @click="closeColumnSelection"
                class="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all font-medium">
                Cancel
              </button>
              <button @click="exportSelectedColumns"
                class="px-6 py-2 bg-[#29457E] text-white rounded-lg hover:bg-[#1E366A] disabled:opacity-50 transition-all font-medium"
                :disabled="selectedExportColumns.length === 0 || isExporting">
                {{ isExporting ? 'Exporting...' : `Export Selected (${selectedExportColumns.length})` }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Filter Modal component -->
    <Filter 
      v-if="filters && filters.length > 0"
      :isOpen="isFilterOpen" 
      :filters="filters"
      @close="closeFilterModal" 
      @filter-applied="onFilterApplied" 
      @filter-removed="onFilterRemoved" 
      @filters-cleared="onFiltersCleared" 
      @operators-changed="onOperatorsChanged" 
      @filters-saved="onFiltersSaved" 
    />
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import Filter from "./Filter.vue";

export default {
  name: "DataTable",
  components: { Filter },
  emits: ["add-new", "edit-item", "flip-page"],
  props: {
    id: { type: String, required: true },
    columns: { type: Array, required: true },
    api: { type: Object, required: true },
    apiParams: { type: Object, default: () => ({}) },
    hideActions: {
      type: Function,
      default: () => (row) => ({ edit: false, delete: false }),
    },
    editItem: Function,
    openForm: Function,
    Statistics: Function,
    Configurations: Function,
    linkRequirement: Function,
    action: { type: Boolean, default: true },
    tableClass: { type: String, default: "table" },
    hideAddNewButton: { type: Boolean, default: false },
    hideStatisticsButton: { type: Boolean, default: true },
    hideAddExportButton: { type: Boolean, default: false },
    hideAddImportButton: { type: Boolean, default: false },
    hideConfigurationsButton: { type: Boolean, default: true },
    hideLinkRequirementButton: { type: Boolean, default: true },
    addNewButtonTitle: { type: String, default: "Add" },
    addNewButtonIcon: { type: String, default: "mdi-plus" },
    filters: { type: Array, default: () => [] },
    truncateLimit: { type: Number, default: 30, validator: (v) => v > 0 },
  },
  data() {
    return {
      isRtl: false,
      selected: [],
      data: [],
      load: false,
      apiParamsLocal: {},
      searchQuery: "",
      currentPage: 1,
      perPage: 10,
      goToPageInput: "",
      currentSort: null,
      sortDirection: "asc",
      sortable: true,
      totalRecords: 0,
      filteredRecords: 0,
      visibleColumns: [],
      showDropdown: false,
      showColumnModal: false,
      showModal: false,
      isFileColumnDisabled: true,
      file: {},
      file_columns: [],
      database_columns: [],
      fields: [],
      page: 0,
      showFilter: false,
      fetchTimeout: null,
      isFilterOpen: false,
      activeFilters: [],
      filterOperators: [],
      draggingIndex: null,
      dragOverIndex: null,
      columnOrder: [],
      showContentModal: false,
      modalContent: { title: "", content: "" },
      cellContentCache: new Map(),
      showExportDropdown: false,
      showPdfDropdown: false,
      showColumnSelectionModal: false,
      exportableColumns: [],
      selectedExportColumns: [],
      isExporting: false,
      // UI-only: track open row menu
      openMenuId: null,
    };
  },
  computed: {
    isArabic() {
      return this.$i18n?.locale === "ar";
    },
    processedColumns() {
      const baseColumns = [
        { title: "", data: null, defaultContent: "N/A" },
        { title: "#", data: null, defaultContent: "N/A", sort: false },
        ...this.columns,
      ];
      if (!this.hideActionsColumn) {
        baseColumns.push({
          title: this.$t ? this.$t("common.actions") : "Actions",
          data: null,
        });
      }
      return baseColumns;
    },
    paginatedData() { return this.data; },
    totalPages() { return Math.ceil(this.totalRecords / this.perPage); },
    startRecord() {
      if (this.data.length === 0) return 0;
      return (this.currentPage - 1) * this.perPage + 1;
    },
    endRecord() {
      if (this.data.length === 0) return 0;
      const start = (this.currentPage - 1) * this.perPage;
      return Math.min(start + this.data.length, this.currentPage * this.perPage);
    },
    paginationPages() {
      const pages = [];
      const maxPages = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
      let endPage = Math.min(this.totalPages, startPage + maxPages - 1);
      if (endPage - startPage + 1 < maxPages) {
        startPage = Math.max(1, endPage - maxPages + 1);
      }
      for (let i = startPage; i <= endPage; i++) { pages.push(i); }
      return pages;
    },
    visibleColumnCount() {
      if (this.visibleColumns.length === 0) return this.processedColumns.length;
      return this.visibleColumns.filter((v) => v !== false).length;
    },
    isValidPageNumber() {
      return this.goToPageInput && Number.isInteger(this.goToPageInput) &&
        this.goToPageInput >= 1 && this.goToPageInput <= this.totalPages;
    },
    orderedColumnIndexes() {
      if (this.columnOrder.length === 0) {
        return Array.from({ length: this.processedColumns.length }, (_, i) => i);
      }
      return this.columnOrder;
    },
    hideActionsColumn() { return this.action === false; },
  },
  watch: {
    columns: { deep: true, handler() { this.$nextTick(() => { this.initializeVisibleColumns(); }); } },
    processedColumns: {
      handler(newColumns) {
        if (newColumns.length > 0) {
          if (this.visibleColumns.length !== newColumns.length) {
            this.visibleColumns = newColumns.map(() => true);
          }
          this.loadColumnOrder();
        }
      },
      immediate: true,
    },
    columnOrder: { handler(newOrder) { if (newOrder.length > 0) this.saveColumnOrder(); }, deep: true },
    apiParams: { deep: true, handler() { this.currentPage = 1; this.debouncedFetchData(); } },
    searchQuery() { this.currentPage = 1; this.debouncedFetchData(); },
    perPage() { this.currentPage = 1; this.fetchData(); },
    currentPage() { this.fetchData(); },
    currentSort() { this.currentPage = 1; this.fetchData(); },
    sortDirection() { this.fetchData(); },
  },
  errorCaptured(err, vm, info) {
    console.error("DataTable Render Error:", err, info);
    alert("A rendering error occurred in the table: " + err.message + "\nCheck console for details.");
    return false; // prevent the error from bubbling up and crashing the app
  },
  created() {
    this.initializeVisibleColumns();
    this.loadExportableColumns();
  },
  mounted() {
    this.isRtl = this.$i18n?.locale === "ar";
    this.initializeVisibleColumns();
    this.fetchData();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    if (this.fetchTimeout) clearTimeout(this.fetchTimeout);
    document.removeEventListener("click", this.handleClickOutside);
    if (this.showContentModal) {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", this.handleEscapeKey);
    }
    this.clearCellContentCache();
  },
  methods: {
    toggleRowMenu(id) {
      this.openMenuId = this.openMenuId === id ? null : id;
    },
    canNavigate() { return this.data.length > 0 && this.totalRecords > 0 && !this.load; },
    goToPage(page) {
      if (!this.canNavigate()) return;
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
    handleGoToPage() {
      if (this.isValidPageNumber) { this.goToPage(this.goToPageInput); this.goToPageInput = ""; }
    },
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.filteredData || this.tableData || []);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, "data_export.xlsx");
    },
    toggleExportDropdown(event) {
      event.stopPropagation();
      this.showExportDropdown = !this.showExportDropdown;
      this.showPdfDropdown = false;
    },
    togglePdfDropdown(event) {
      event.stopPropagation();
      this.showPdfDropdown = !this.showPdfDropdown;
      this.showExportDropdown = false;
    },
    visibleExportableColumns() {
      return this.processedColumns.filter((col, index) => {
        if (index <= 1) return false;
        if (col.title === "Actions" || col.title === this.$t?.("common.actions")) return false;
        const columnKey = col.data || col.id;
        return columnKey && (this.visibleColumns.length === 0 || this.visibleColumns[index] !== false);
      }).map((col) => ({ title: col.title, data: col.data || col.id, id: col.id }));
    },
    async loadExportableColumns() {
      try {
        this.exportableColumns = this.columns.filter((col) => col.data || col.id)
          .map((col) => ({ title: col.title, data: col.data || col.id, id: col.id, originalData: col.data }));
      } catch (error) { this.exportableColumns = []; }
    },
    async handleExportAll() {
      this.showExportDropdown = false; this.isExporting = true;
      try {
        const visibleColumns = this.visibleExportableColumns();
        const columnKeys = visibleColumns.map((col) => col.data || col.id);
        const exportParams = this.buildApiParams();
        delete exportParams.page; delete exportParams.perPage;
        if (this.api.exportToExcel) {
          await this.api.exportToExcel({ exportAll: true, columns: columnKeys, filters: exportParams, async: true });
        }
      } catch (error) { console.error("Export failed:", error); } finally { this.isExporting = false; }
    },
    async handleExportCurrent() {
      this.showExportDropdown = false; this.isExporting = true;
      const visibleColumns = this.visibleExportableColumns();
      const columnKeys = visibleColumns.map((col) => col.data || col.id);
      try {
        const exportParams = this.buildApiParams();
        await this.api.exportToExcel({ exportAll: false, columns: columnKeys, filters: exportParams, async: true });
      } catch (error) { console.error("Export failed:", error); } finally { this.isExporting = false; }
    },
    openColumnSelection() {
      this.showExportDropdown = false; this.showColumnSelectionModal = true;
      const visibleColumns = this.visibleExportableColumns();
      this.selectedExportColumns = visibleColumns.map((col) => col.data || col.id);
    },
    closeColumnSelection() { this.showColumnSelectionModal = false; this.selectedExportColumns = []; },
    selectAllExportColumns() { this.selectedExportColumns = this.exportableColumns.map((col) => col.data); },
    deselectAllExportColumns() { this.selectedExportColumns = []; },
    async exportSelectedColumns() {
      if (this.selectedExportColumns.length === 0) return;
      this.isExporting = true;
      try {
        const exportParams = this.buildApiParams();
        delete exportParams.page; delete exportParams.perPage;
        await this.api.exportToExcel({ exportAll: true, columns: this.selectedExportColumns, filters: exportParams, async: true });
        this.closeColumnSelection();
      } catch (error) { console.error("Export failed:", error); } finally { this.isExporting = false; }
    },
    toggleModal() { this.file_columns = []; this.database_columns = []; this.fields = []; this.showModal = !this.showModal; },
    handleFileUpload(event) { this.file = event.target.files[0]; },
    async handleImport() {
      const formData = new FormData(); formData.append("file", this.file);
      try {
        const response = await this.api.fetchFileData(formData, {}, false);
        this.file_columns = response.data.file_columns;
        this.database_columns = response.data.database_columns;
      } catch (error) { console.error("Error importing file:", error); }
    },
    async saveImportedData() {
      try {
        await this.api.importFileData(this.fields, {}, false);
        this.file_columns = []; this.database_columns = []; this.fields = [];
        this.toggleModal(); this.fetchData();
      } catch (error) { console.error("Error importing file:", error); }
    },
    initializeVisibleColumns() {
      this.$nextTick(() => {
        if (this.processedColumns.length > 0) {
          this.visibleColumns = this.processedColumns.map(() => true);
        }
      });
    },
    debouncedFetchData() {
      if (this.fetchTimeout) clearTimeout(this.fetchTimeout);
      this.fetchTimeout = setTimeout(() => { this.fetchData(); }, 300);
    },
    async fetchData() {
      this.load = true;
      try {
        const params = this.buildApiParams();
        const response = await this.api.getAll(params);
        if (response.data && Array.isArray(response.data)) {
          this.data = response.data;
          this.totalRecords = response.recordsTotal || response.total || response.data.length;
          this.filteredRecords = response.recordsFiltered || response.filtered || response.data.length;
        } else if (Array.isArray(response)) {
          this.data = response; this.totalRecords = response.length; this.filteredRecords = response.length;
        } else {
          this.data = []; this.totalRecords = 0; this.filteredRecords = 0;
        }
        this.clearCellContentCache();
      } catch (error) {
        console.error("DataTable fetchData error:", error);
        alert("Failed to load table data: " + String(error));
        this.data = []; this.totalRecords = 0; this.filteredRecords = 0;
      } finally { this.load = false; }
    },
    buildApiParams() {
      const params = { perPage: this.perPage, page: this.currentPage, search: this.searchQuery };
      if (this.currentSort) params.sort = `${this.currentSort}|${this.sortDirection}`;
      if (this.activeFilters && this.activeFilters.length > 0) {
        const standardFilters = [];
        const specialFilters = {};
        this.activeFilters.forEach((filter) => {
          const filterType = filter.filterType || "filter";
          if (filterType === "filter" || filterType === "filterOr") {
            standardFilters.push(filter);
          } else {
            if (!specialFilters[filterType]) specialFilters[filterType] = [];
            specialFilters[filterType].push(filter);
          }
        });
        if (standardFilters.length > 0) {
          const completeFilterArray = [];
          standardFilters.forEach((filter) => {
            let filterValue; let filterOperator = "=";
            if (filter.type === "integer" || filter.type === "boolean") {
              filterValue = `${filter.value}-${filter.type}`;
            } else if (filter.type === "null") {
              filterValue = `-${filter.type}`; filterOperator = "!=";
            } else { filterValue = filter.value; }
            completeFilterArray.push(`${filter.key}|${filterValue}|${filterOperator}`);
          });
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
          const hasFilterOr = standardFilters.some((f) => f.filterType === "filterOr");
          params[hasFilterOr ? "filterOr" : "filter"] = completeFilterString;
        }
        Object.keys(specialFilters).forEach((filterType) => {
          const filtersForType = specialFilters[filterType];
          const filterArray = [];
          filtersForType.forEach((filter) => {
            let filterValue; let filterOperator = "=";
            if (filter.type === "integer" || filter.type === "boolean") {
              filterValue = `${filter.value}-${filter.type}`;
            } else if (filter.type === "null") {
              filterValue = `-${filter.type}`; filterOperator = "!=";
            } else { filterValue = filter.value; }
            filterArray.push(`${filter.key}|${filterValue}|${filterOperator}`);
          });
          if (filterArray.length === 1) {
            params[filterType] = filterArray[0];
          } else {
            let filterString = filterArray[0];
            for (let i = 1; i < filterArray.length; i++) filterString += "&&" + filterArray[i];
            params[filterType] = filterString;
          }
        });
      }
      const finalParams = { ...this.apiParams, ...params };
      Object.keys(this.apiParams).forEach((key) => {
        if (key.includes("filter") && this.apiParams[key] && params[key]) {
          finalParams[key] = this.apiParams[key] + "&&" + params[key];
        }
      });
      return finalParams;
    },
    sortBy(column) {
      if (this.currentSort === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else { this.currentSort = column; this.sortDirection = "asc"; }
    },
    showAllColumns() {
      const newVisibleColumns = [...this.visibleColumns];
      for (let i = 2; i < newVisibleColumns.length; i++) newVisibleColumns[i] = true;
      this.visibleColumns = newVisibleColumns;
    },
    hideAllColumns() {
      const newVisibleColumns = [...this.visibleColumns];
      for (let i = 2; i < newVisibleColumns.length; i++) newVisibleColumns[i] = false;
      this.visibleColumns = newVisibleColumns;
    },
    toggleDropdown(event) { this.showDropdown = !this.showDropdown; },
    handleClickOutside(event) {
      this.openMenuId = null;
      this.showExportDropdown = false;
      this.showDropdown = false;
    },
    toggleFilter() { this.showFilter = !this.showFilter; },
    toggleColumn(index) {
      if (index <= 1) return;
      const newVisibleColumns = [...this.visibleColumns];
      newVisibleColumns[index] = !newVisibleColumns[index];
      this.visibleColumns = newVisibleColumns;
    },
    openFilterModal() {
      if (!this.filters || this.filters.length === 0) return;
      this.isFilterOpen = true;
    },
    closeFilterModal() { this.isFilterOpen = false; },
    onFilterApplied(filterData) {
      const existingIndex = this.activeFilters.findIndex((f) => f.key === filterData.key);
      if (existingIndex >= 0) { this.activeFilters[existingIndex] = filterData; } else { this.activeFilters.push(filterData); }
      if (this.currentPage === 1) { this.fetchData(); } else { this.currentPage = 1; }
    },
    onFilterRemoved(filterData) {
      this.activeFilters = this.activeFilters.filter((f) => !(f.key === filterData.key && f.value === filterData.value));
      if (this.currentPage === 1) { this.fetchData(); } else { this.currentPage = 1; }
    },
    onFiltersCleared() {
      this.activeFilters = []; this.filterOperators = [];
      if (this.currentPage === 1) { this.fetchData(); } else { this.currentPage = 1; }
    },
    onOperatorsChanged(operators) {
      this.filterOperators = operators;
      if (this.currentPage === 1) { this.fetchData(); } else { this.currentPage = 1; }
    },
    onFiltersSaved(filtersData) {
      this.activeFilters = filtersData.filters || []; this.filterOperators = filtersData.operators || [];
      if (this.currentPage === 1) { this.fetchData(); } else { this.currentPage = 1; }
    },
    onOperatorChanged(operator) {
      this.filterOperators = [operator];
      if (this.currentPage === 1) { this.fetchData(); } else { this.currentPage = 1; }
    },
    getStorageKey() {
      const columnTitles = this.processedColumns.map((col) => col.title).join("|");
      return `datatable_column_order_${this.id}_${btoa(columnTitles).slice(0, 10)}`;
    },
    saveColumnOrder() {
      try { localStorage.setItem(this.getStorageKey(), JSON.stringify(this.columnOrder)); } catch (error) {}
    },
    loadColumnOrder() {
      try {
        const savedOrder = localStorage.getItem(this.getStorageKey());
        if (savedOrder) {
          const parsedOrder = JSON.parse(savedOrder);
          if (parsedOrder.length === this.processedColumns.length &&
            parsedOrder.every((index) => index < this.processedColumns.length)) {
            this.columnOrder = parsedOrder; return;
          }
        }
      } catch (error) {}
      this.columnOrder = Array.from({ length: this.processedColumns.length }, (_, i) => i);
    },
    resetColumnOrder() {
      this.columnOrder = Array.from({ length: this.processedColumns.length }, (_, i) => i);
      try { localStorage.removeItem(this.getStorageKey()); } catch (error) {}
    },
    getCellValue(row, column) { if (!column?.data) return ""; return row[column.data] ?? ""; },
    stripHtmlTags(content) {
      if (!content) return "";
      return String(content)
        .replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
    },
    shouldTruncate(content) {
      if (!content && content !== 0) return false;
      return this.stripHtmlTags(content).length > this.truncateLimit;
    },
    getTruncatedText(content) {
      if (!content && content !== 0) return "";
      const cleanContent = this.stripHtmlTags(content);
      const cacheKey = `${cleanContent}_${this.truncateLimit}`;
      if (this.cellContentCache.has(cacheKey)) return this.cellContentCache.get(cacheKey);
      const result = cleanContent.length > this.truncateLimit
        ? cleanContent.substring(0, this.truncateLimit).trim() : cleanContent;
      this.cellContentCache.set(cacheKey, result);
      return result;
    },
    showFullContent(title, content) {
      this.modalContent.title = title || "Content Details";
      this.modalContent.content = this.stripHtmlTags(content) || "";
      this.showContentModal = true;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", this.handleEscapeKey);
    },
    closeContentModal() {
      this.showContentModal = false; this.modalContent.title = ""; this.modalContent.content = "";
      document.body.style.overflow = "";
      document.removeEventListener("keydown", this.handleEscapeKey);
    },
    handleEscapeKey(event) { if (event.key === "Escape" && this.showContentModal) this.closeContentModal(); },
    clearCellContentCache() { this.cellContentCache.clear(); },
    async deleteItem(data) {
      try { await this.api.delete(0, [data.id].map(String)); this.fetchData(); } catch (error) {}
    },
    async multiDelete() {
      if (this.selected.length === 0) { alert("Please select items to delete"); return; }
      try { await this.api.delete(0, this.selected.map(String)); this.selected = []; this.fetchData(); } catch (error) {}
    },
    refreshTable() { this.fetchData(); },
    reorderColumns(fromIndex, toIndex) {
      const newOrder = [...this.orderedColumnIndexes];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedItem);
      this.columnOrder = newOrder;
    },
    onDragStart(event, orderIndex) {
      this.draggingIndex = orderIndex; event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", orderIndex.toString());
      event.target.style.opacity = "0.5";
    },
    onDragOver(event, targetIndex) { this.dragOverIndex = targetIndex; },
    onDrop(event, targetIndex) {
      event.preventDefault();
      const sourceIndex = parseInt(event.dataTransfer.getData("text/plain"));
      if (sourceIndex !== targetIndex && sourceIndex !== null) this.reorderColumns(sourceIndex, targetIndex);
      this.draggingIndex = null; this.dragOverIndex = null;
      const draggedElement = event.target.closest(".column-item");
      if (draggedElement) draggedElement.style.opacity = "1";
    },
    onDragEnd(event) { event.target.style.opacity = "1"; this.draggingIndex = null; this.dragOverIndex = null; },
  },
};
</script>

<style scoped>
.loader {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  box-sizing: border-box;
  border-top: 3px solid #29457E;
  border-left: 3px solid #29457E;
  border-right: 3px solid transparent;
  animation: loader 0.7s infinite linear;
}
@keyframes loader {
  to { transform: rotate(360deg); }
}
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
:deep(tbody td) {
  border-bottom: 1px solid #E4E7EC;
}
</style>