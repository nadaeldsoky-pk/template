<template>
    <div class="w-full">
        <v-select :key="`vselect-${name}`" :options="internalOptions" :disabled="disabled" :label="optionLabel"
            :reduce="reduceFunction" v-model="displayValue" :multiple="multiple" :placeholder="placeholder"
            @option:selected="onOptionSelected" @option:deselected="onOptionDeselected"
            @update:modelValue="handleUpdate" :filterable="filterable" :clearable="clearable"
            :selectable="selectableFunction" :dir="isRtl ? 'rtl' : 'ltr'" @open="onOpen" @search="onSearch"
            :appendToBody="true" :calculatePosition="calculateDropdownPosition" class="custom-v-select"
            :class="{ 'has-error': validationError }">
            <!-- option slot -->
            <template #option="slotProps">
                <slot name="option" v-bind="slotProps">
                    <div class="flex items-center py-1 px-2 text-sm">
                        {{ slotProps[optionLabel] }}
                    </div>
                </slot>
            </template>

            <!-- selected option slot -->
            <template #selected-option="slotProps">
                <slot name="selected-option" v-bind="slotProps">
                    <div class="text-sm font-medium">
                        {{ slotProps[optionLabel] }}
                    </div>
                </slot>
            </template>

            <!-- infinite scroll -->
            <template #list-footer>
                <li v-show="hasMorePages" ref="loadMoreTrigger"
                    class="flex items-center justify-center p-3 text-xs text-gray-400 italic">
                    <span v-if="loading" class="flex items-center gap-2">
                        <svg class="animate-spin h-4 w-4 text-[var(--color-main)]" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Loading more...
                    </span>
                </li>
            </template>
        </v-select>

        <!-- Display validation error message -->
        <div v-if="validationError"
            class="text-red-500 text-[10px] sm:text-xs mt-1 ms-3 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            {{ validationError }}
        </div>

        <!-- vee-validate -->
        <Field :name="name" :rules="rules" v-model="internalValue" style="display: none" />
    </div>
</template>

<script>
import VueSelect from "vue-select";
import { Field } from "vee-validate";

export default {
    name: "LazySelectField",

    components: {
        "v-select": VueSelect,
        Field,
    },

    props: {
        modelValue: { default: null },
        options: { type: [Array, String], default: null },
        apiParams: { type: Object, default: () => ({}) },
        perPage: { type: Number, default: 10 },
        disabled: { type: Boolean, default: false },
        optionLabel: { type: String, default: "name" },
        optionValue: { type: String, default: "id" },
        multiple: { type: Boolean, default: false },
        placeholder: { type: String, default: "Please select" },
        filterable: { type: Boolean, default: true },
        clearable: { type: Boolean, default: true },
        selectable: { type: Function, default: null },
        onUpdate: { type: Function, default: null },
        name: { type: String, required: true },
        rules: { type: [String, Object, Function], default: "" },
        apiPathPattern: {
            type: String,
            default: "flat",
            validator: (value) => ["flat", "nested"].includes(value),
        },
        FolderName: {
            type: String,
            default: "",
        },
        BaseModule: {
            type: String,
            default: "",
        },
    },

    data() {
        return {
            internalOptions: [],
            loading: false,
            currentPage: 1,
            hasMorePages: false,
            apiInstance: null,
            observer: null,
            searchQuery: "",
            searchTimeout: null,
            searchLoadedOptions: new Map(), // Store options loaded via search with their original position
            temporaryOptions: new Set(), // Track temporarily added options (selected but not in current page)
        };
    },

    computed: {
        internalValue: {
            get() {
                return this.modelValue;
            },
            set(val) {
                this.$emit("update:modelValue", val);
            },
        },
        validationError() {
            if (!this.rules || (Array.isArray(this.rules) && this.rules.length === 0)) {
                return null;
            }

            if (Array.isArray(this.rules)) {
                for (const rule of this.rules) {
                    if (typeof rule === 'function') {
                        const result = rule(this.internalValue);
                        if (result !== true && typeof result === 'string') {
                            return result;
                        }
                    }
                }
            } else if (typeof this.rules === 'function') {
                const result = this.rules(this.internalValue);
                if (result !== true && typeof result === 'string') {
                    return result;
                }
            }

            return null;
        },

        displayValue: {
            get() {
                if (!this.modelValue) return this.multiple ? [] : null;

                if (this.multiple) {
                    const ids = Array.isArray(this.modelValue) ? this.modelValue : [];
                    return this.internalOptions.filter((opt) =>
                        ids.includes(opt[this.optionValue])
                    );
                } else {
                    return (
                        this.internalOptions.find(
                            (opt) => opt[this.optionValue] === this.modelValue
                        ) || null
                    );
                }
            },
            set(value) {
                // Handled by handleUpdate
            },
        },

        reduceFunction() {
            return (item) => item[this.optionValue];
        },

        selectableFunction() {
            // return this.selectable || (() => true);
            return (() => true);
        },

        isLazyMode() {
            return typeof this.options === "string" && this.options.length;
        },

        apiModuleName() {
            return this.isLazyMode ? this.options : null;
        },

        isRtl() {
            return this.$i18n?.locale === 'ar' || document.documentElement.dir === 'rtl';
        }
    },

    mounted() {
        if (this.isLazyMode) {
            this.initializeApi().then(() => {
                this.loadOptions(true).then(() => {
                    this.fetchSelectedOptions();
                });
                this.setupIntersectionObserver();
            });
        } else if (Array.isArray(this.options)) {
            this.internalOptions = this.options;
        }
    },

    watch: {
        modelValue(newVal, oldVal) {
            // Clean up temporary options when value changes
            this.cleanupTemporaryOptions();
            this.fetchSelectedOptions();
        },
        options: {
            handler(newOptions) {
                if (Array.isArray(newOptions)) {
                    this.internalOptions = newOptions;
                }
            },
            immediate: true,
        },
        apiParams: {
            handler(newParams, oldParams) {
                if (this.isLazyMode && JSON.stringify(newParams) !== JSON.stringify(oldParams)) {
                    this.loadOptions(true);
                }
            },
            deep: true,
        },
    },

    methods: {
        calculateDropdownPosition(dropdownList, component, { width, top, left }) {
            dropdownList.style.top = top;
            dropdownList.style.left = left;
            dropdownList.style.width = width;
            dropdownList.style.zIndex = 999999;

            const reposition = () => {
                const rect = component.$el.getBoundingClientRect();
                const dropdownHeight = dropdownList.offsetHeight || 200;
                const spaceBelow = window.innerHeight - rect.bottom;
                const openAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

                dropdownList.style.left = `${rect.left + window.scrollX}px`;
                dropdownList.style.width = `${rect.width}px`;

                if (openAbove) {
                    dropdownList.style.top = `${rect.top + window.scrollY - dropdownHeight}px`;
                } else {
                    dropdownList.style.top = `${rect.bottom + window.scrollY}px`;
                }
            };

            // جمع كل الـ parents اللي بتعمل scroll
            const scrollableParents = [];
            let el = component.$el.parentElement;
            while (el) {
                const { overflow, overflowY } = window.getComputedStyle(el);
                if (/auto|scroll/.test(overflow + overflowY)) {
                    scrollableParents.push(el);
                }
                el = el.parentElement;
            }
            scrollableParents.push(window);

            scrollableParents.forEach((parent) => {
                parent.addEventListener("scroll", reposition, { passive: true });
            });
            window.addEventListener("resize", reposition, { passive: true });

            // Cleanup لما الـ dropdown يتقفل
            const observer = new MutationObserver(() => {
                if (!document.body.contains(dropdownList)) {
                    scrollableParents.forEach((parent) => {
                        parent.removeEventListener("scroll", reposition);
                    });
                    window.removeEventListener("resize", reposition);
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        onOptionSelected(option) {
            if (!option) return;

            const id = option[this.optionValue];

            // Store the option for future reference
            this.searchLoadedOptions.set(id, option);

            // Check if this option is already in internalOptions
            const existsInOptions = this.internalOptions.some(
                opt => opt[this.optionValue] === id
            );

            if (!existsInOptions) {
                // Mark this as a temporary option
                this.temporaryOptions.add(id);
                // Add to the beginning temporarily (will be removed on deselect or refresh)
                this.internalOptions.unshift(option);
            }
        },

        onOptionDeselected(option) {
            if (!option) return;

            const id = option[this.optionValue];

            // Keep it in searchLoadedOptions for future searches
            this.searchLoadedOptions.set(id, option);

            // If it was a temporary option, remove it from internalOptions
            if (this.temporaryOptions.has(id)) {
                this.internalOptions = this.internalOptions.filter(
                    opt => opt[this.optionValue] !== id
                );
                this.temporaryOptions.delete(id);
            }
        },

        cleanupTemporaryOptions() {
            // Remove temporary options that are no longer selected
            const selectedIds = new Set();
            if (this.modelValue) {
                const ids = this.multiple
                    ? (Array.isArray(this.modelValue) ? this.modelValue : [])
                    : [this.modelValue];
                ids.forEach(id => selectedIds.add(id));
            }

            // Remove temporary options that are not selected anymore
            const optionsToRemove = [];
            this.temporaryOptions.forEach(id => {
                if (!selectedIds.has(id)) {
                    optionsToRemove.push(id);
                }
            });

            if (optionsToRemove.length > 0) {
                this.internalOptions = this.internalOptions.filter(
                    opt => !optionsToRemove.includes(opt[this.optionValue])
                );
                optionsToRemove.forEach(id => this.temporaryOptions.delete(id));
            }
        },

        fetchSelectedOptions() {
            if (!this.modelValue || !this.apiInstance) return Promise.resolve();

            const ids = this.multiple
                ? Array.isArray(this.modelValue)
                    ? this.modelValue
                    : []
                : [this.modelValue];

            const existingIds = new Set(
                this.internalOptions.map((opt) => opt[this.optionValue])
            );

            const missingIds = ids.filter((id) => id && !existingIds.has(id));

            if (!missingIds.length) return Promise.resolve();

            return this.apiInstance
                .getAll({
                    filterIn: `id|${missingIds.join(",")}`,
                    select: `${this.optionValue}|${this.optionLabel}`,
                })
                .then((res) => {
                    const currentExistingIds = new Set(
                        this.internalOptions.map((opt) => opt[this.optionValue])
                    );

                    const newItems = (res?.data || res || []).filter(
                        (item) => !currentExistingIds.has(item[this.optionValue])
                    );

                    if (newItems.length > 0) {
                        // Add to beginning temporarily
                        this.internalOptions.unshift(...newItems);
                        newItems.forEach(item => {
                            this.searchLoadedOptions.set(item[this.optionValue], item);
                            this.temporaryOptions.add(item[this.optionValue]);
                        });
                    }
                });
        },

        initializeApi() {
            return new Promise(async (resolve, reject) => {
                try {
                    let context;
                    if (this.BaseModule) {
                        context = require.context("@/modules", true, /\.ts$/);
                    } else {
                        context = require.context("@/API", true, /\.ts$/);
                    }
                    let filePath;
                    if (this.apiPathPattern === "nested") {
                        if (this.BaseModule) {
                            filePath = `./${this.BaseModule}/API/${this.apiModuleName}/${this.apiModuleName}.ts`;
                        } else if (this.FolderName) {
                            filePath = `./${this.FolderName}/${this.apiModuleName}/${this.apiModuleName}.ts`;
                        } else {
                            filePath = `./${this.apiModuleName}/${this.apiModuleName}.ts`;
                        }
                    } else {
                        filePath = `./${this.apiModuleName}/${this.apiModuleName}.ts`;
                    }

                    const foundPath = context
                        .keys()
                        .find((key) => key.includes(filePath.replace("./", "")));
                    if (!foundPath) {
                        reject(new Error(`File not found: ${filePath}`));
                        return;
                    }

                    // The module might be a Promise, so await it
                    let apiModule = context(foundPath);

                    // Check if it's a Promise and await it
                    if (apiModule instanceof Promise) {
                        apiModule = await apiModule;
                    }

                    // Handle different export patterns
                    let ApiClass;
                    if (apiModule.default) {
                        ApiClass = apiModule.default;
                    } else if (typeof apiModule === "function") {
                        ApiClass = apiModule;
                    } else {
                        // Try to find the first exported class
                        const exportedClass = Object.values(apiModule).find(
                            (exp) => typeof exp === "function",
                        );
                        if (exportedClass) {
                            ApiClass = exportedClass;
                        } else {
                            reject(new Error(`No valid class found in ${filePath}`));
                            return;
                        }
                    }

                    // Verify it's a constructor
                    if (typeof ApiClass !== "function") {
                        reject(
                            new Error(
                                `ApiClass is not a constructor in ${filePath}. Type: ${typeof ApiClass}`,
                            ),
                        );
                        return;
                    }

                    this.apiInstance = new ApiClass();
                    console.log(`✅ Successfully loaded API from: ${foundPath}`);
                    resolve();
                } catch (err) {
                    console.error("Failed to load API module:", err);
                    reject(err);
                }
            });
        },
        loadOptions(reset = false) {
            if (!this.apiInstance) return Promise.resolve();
            if (this.loading) return Promise.resolve();

            if (reset) {
                this.currentPage = 1;

                // Preserve only currently selected options when resetting
                const selectedIds = new Set();
                if (this.modelValue) {
                    const ids = this.multiple
                        ? (Array.isArray(this.modelValue) ? this.modelValue : [])
                        : [this.modelValue];
                    ids.forEach(id => selectedIds.add(id));
                }

                // Keep only selected items
                const preservedOptions = this.internalOptions.filter(opt =>
                    selectedIds.has(opt[this.optionValue])
                );

                this.internalOptions = preservedOptions;

                // Update temporary options to only include currently selected
                const newTemporaryOptions = new Set();
                this.temporaryOptions.forEach(id => {
                    if (selectedIds.has(id)) {
                        newTemporaryOptions.add(id);
                    }
                });
                this.temporaryOptions = newTemporaryOptions;
            }

            this.loading = true;

            const params = {
                ...this.apiParams,
                page: this.currentPage,
                perPage: this.perPage,
                search: this.searchQuery || undefined,
            };

            return this.apiInstance
                .getAll(params)
                .then((res) => {
                    const data = res?.data || [];

                    const existingIds = new Set(
                        this.internalOptions.map((opt) => opt[this.optionValue])
                    );

                    const uniqueData = data.filter(
                        (item) => !existingIds.has(item[this.optionValue])
                    );

                    // Store search results
                    if (this.searchQuery) {
                        uniqueData.forEach(item => {
                            this.searchLoadedOptions.set(item[this.optionValue], item);
                        });
                    }

                    // Add new options at the end (maintaining API order)
                    this.internalOptions.push(...uniqueData);

                    // Remove temporary markers for options that are now loaded from API
                    uniqueData.forEach(item => {
                        this.temporaryOptions.delete(item[this.optionValue]);
                    });

                    this.hasMorePages = this.internalOptions.length < (res?.recordsFiltered || 0);
                })
                .finally(() => (this.loading = false));
        },

        loadMore() {
            if (this.hasMorePages) {
                this.currentPage++;
                this.loadOptions();
            }
        },

        setupIntersectionObserver() {
            if (this.observer) this.observer.disconnect();

            this.$nextTick(() => {
                if (this.$refs.loadMoreTrigger) {
                    this.observer = new IntersectionObserver(
                        (e) => e[0].isIntersecting && this.loadMore(),
                        {
                            root: this.$el.querySelector(".vs__dropdown-menu"),
                            threshold: 0.1,
                        }
                    );
                    this.observer.observe(this.$refs.loadMoreTrigger);
                }
            });
        },

        onOpen() {
            this.setupIntersectionObserver();
        },

        onSearch(q) {
            if (!this.isLazyMode) return;

            this.searchQuery = q;
            clearTimeout(this.searchTimeout);

            this.searchTimeout = setTimeout(() => {
                this.loadOptions(true);
            }, 500);
        },

        handleUpdate(val) {
            // Emit the update
            this.$emit("update:modelValue", val);

            if (this.onUpdate) {
                let selectedOption = null;
                if (this.multiple) {
                    const ids = Array.isArray(val) ? val : [];
                    selectedOption = this.internalOptions.filter((opt) =>
                        ids.includes(opt[this.optionValue])
                    );
                } else {
                    selectedOption = this.internalOptions.find(
                        (opt) => opt[this.optionValue] === val
                    ) || null;
                }
                this.onUpdate(val, selectedOption);
            }
        },
    },
};
</script>

<style scoped>
@import "vue-select/dist/vue-select.css";

/* Custom styles for vue-select using project variables and Tailwind concepts */
:deep(.custom-v-select) {
    --vs-font-size: 0.875rem;
    --vs-line-height: 1.25rem;
    --vs-border-radius: 0.75rem;
    --vs-border-color: var(--color-border);
    --vs-border-width: 1px;
    --vs-border-style: solid;

    --vs-selected-bg: var(--color-bg-selected);
    --vs-selected-color: var(--color-text-primary);

    --vs-dropdown-bg: #fff;
    --vs-dropdown-color: var(--color-text-primary);
    --vs-dropdown-option-color: var(--color-text-primary);

    --vs-dropdown-option--active-bg: var(--color-main);
    --vs-dropdown-option--active-color: #fff;

    --vs-transition-duration: 0.2s;
}

:deep(.custom-v-select .vs__dropdown-toggle) {
    padding: 0.5rem 0.25rem;
    background-color: var(--color-bg);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0.75rem;
}

:deep(.custom-v-select .vs__dropdown-toggle:hover) {
    border-color: var(--color-main);
}

:deep(.custom-v-select.vs--open .vs__dropdown-toggle) {
    border-bottom-color: transparent;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-color: var(--color-main);
    box-shadow: 0 0 0 4px rgba(var(--color-main-rgb), 0.1);
}

:deep(.custom-v-select .vs__dropdown-menu) {
    border-radius: 0 0 0.75rem 0.75rem;
    border-color: var(--color-main);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    padding: 0.25rem;
}

:deep(.custom-v-select .vs__dropdown-option) {
    border-radius: 0.5rem;
    margin: 0.125rem 0;
    padding: 0.5rem 0.75rem;
    transition: all 0.15s ease;
}

:deep(.custom-v-select .vs__selected) {
    background-color: var(--color-bg-selected);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    padding: 0.125rem 0.5rem;
    margin: 0.125rem;
}

:deep(.custom-v-select .vs__actions) {
    padding: 0 0.5rem;
}

:deep(.custom-v-select .vs__clear) {
    fill: #9ca3af;
    transition: fill 0.2s;
}

:deep(.custom-v-select .vs__clear:hover) {
    fill: #6b7280;
}

:deep(.custom-v-select.has-error .vs__dropdown-toggle) {
    border-color: #ef4444 !important;
    background-color: #fef2f2;
}

:deep(.custom-v-select.has-error .vs__dropdown-toggle:focus-within) {
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
}

/* RTL Support */
:deep(.custom-v-select[dir="rtl"] .vs__actions) {
    padding-left: 0.5rem;
    padding-right: 0;
}

:deep(.custom-v-select[dir="rtl"] .vs__selected) {
    margin-left: 0.25rem;
    margin-right: 0;
}
</style>