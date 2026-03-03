<template>
    <div class="w-full" :dir="isRtl ? 'rtl' : 'ltr'">
        <v-autocomplete v-model="selectedUsers" :items="users" :disabled="disabled"
            :placeholder="placeholder || $t('common.please_select_users')" :label="label" variant="outlined"
            :menu-icon="elegantMode ? undefined : 'mdi-chevron-down'" color="var(--color-main)" :menu-props="{
                contentClass: 'user-select-menu-custom',
                maxHeight: '300px',
            }" :multiple="multiple" item-title="full_name" item-value="id" class="custom-user-autocomplete"
            :class="[customClass]" :clearable="clearable" @update:modelValue="handleSelection"
            @update:menu="handleMenuToggle" @update:search="handleSearch" :hide-details="hideDetails"
            :density="elegantMode ? 'default' : 'compact'" :loading="loading" :no-data-text="noDataText"
            :prepend-inner-icon="prependInnerIcon" :chips="elegantMode && multiple"
            :closable-chips="elegantMode && multiple" :error-messages="errorMessages" :rules="rules">
            <!-- Loading skeleton -->
            <template v-if="loading && users.length === 0" v-slot:prepend-item>
                <div v-for="n in 3" :key="`skeleton-${n}`" class="flex items-center gap-3 p-3 animate-pulse">
                    <div class="w-9 h-9 rounded-full bg-gray-200"></div>
                    <div class="flex-1 h-4 bg-gray-200 rounded w-1/2"></div>
                    <div class="w-5 h-5 bg-gray-200 rounded-full"></div>
                </div>
            </template>

            <!-- Custom item rendering -->
            <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props" @click="multiple ? toggleUser(item.raw) : selectSingleUser(item.raw)"
                    class="!px-3 !py-2 !my-0.5 hover:!bg-[var(--color-bg-selected)] transition-colors cursor-pointer rounded-lg mx-2">
                    <template v-slot:prepend>
                        <v-icon v-if="elegantMode" class="me-2" color="var(--color-main)">mdi-account</v-icon>
                        <div v-else class="flex items-center me-3">
                            <div class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm border-2 border-white transition-all overflow-hidden"
                                :class="{ 'ring-2 ring-[var(--color-main)] scale-105': isUserSelected(item.raw.id) }"
                                :style="{ backgroundColor: item.raw.avatarColor }">
                                {{ item.raw.initials }}
                            </div>
                        </div>
                    </template>
                    <v-list-item-title class="!text-sm !font-medium !text-[var(--color-text-primary)]">
                        {{ item.raw.full_name }}
                    </v-list-item-title>
                </v-list-item>
            </template>

            <!-- Custom selection display -->
            <template v-slot:selection="{ item }">
                <!-- Elegant mode with chips -->
                <v-chip v-if="elegantMode && multiple" closable @click:close="removeUser(item.value)" class="me-1">
                    <v-icon start size="16">mdi-account</v-icon>
                    <span class="text-xs">{{ getSelectedUserData(item.value).full_name || item.title }}</span>
                </v-chip>

                <!-- Elegant mode single select -->
                <span v-else-if="elegantMode && !multiple" class="text-sm font-medium">
                    {{ getSelectedUserData(item.value).full_name || item.title }}
                </span>

                <!-- Default custom chip style -->
                <div v-else
                    class="flex items-center gap-2 bg-[var(--color-bg-selected)] border border-[var(--color-border)] rounded-full py-0.5 pe-2 ps-0.5 my-0.5 me-1 max-h-8 animate-in fade-in zoom-in duration-200">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm shrink-0"
                        :style="{ backgroundColor: getSelectedUserData(item.value).avatarColor }">
                        {{ getSelectedUserData(item.value).initials }}
                    </div>
                    <span class="text-xs font-semibold text-[var(--color-text-primary)] truncate max-w-[120px]">
                        {{ getSelectedUserData(item.value).full_name || item.title }}
                    </span>
                    <v-icon size="14"
                        class="text-gray-400 hover:text-red-500 hover:bg-red-50 p-0.5 rounded-full transition-all cursor-pointer"
                        @click.stop="removeUser(item.value)">
                        mdi-close
                    </v-icon>
                </div>
            </template>

            <!-- Load more indicator -->
            <template v-slot:append-item>
                <div v-if="loadingMore" class="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50/50">
                    <v-progress-circular indeterminate color="var(--color-main)" size="24"
                        width="2"></v-progress-circular>
                    <span class="text-[11px] text-gray-500 font-medium">Loading more users...</span>
                </div>
                <div v-else-if="hasMoreUsers && users.length > 0" ref="loadMoreTrigger" class="h-px w-full"></div>
            </template>
        </v-autocomplete>
    </div>
</template>

<script>
import User from "@/API/User/User";

export default {
    name: "UserSelect",
    props: {
        modelValue: {
            type: [Number, String, Array],
            default: null,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: "",
        },
        filterUsers: {
            type: Array,
            default: () => [],
        },
        apiParams: {
            type: Object,
            default: () => ({}),
        },
        // Elegant mode props for consistent modal styling
        elegantMode: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: "",
        },
        prependInnerIcon: {
            type: String,
            default: "",
        },
        customClass: {
            type: String,
            default: "",
        },
        hideDetails: {
            type: [Boolean, String],
            default: false,
        },
        clearable: {
            type: Boolean,
            default: true,
        },
        errorMessages: {
            type: [String, Array],
            default: () => [],
        },
        rules: {
            type: Array,
            default: () => [],
        },
    },

    emits: ["update:modelValue", "change"],

    data() {
        return {
            users: [],
            loading: false,
            loadingMore: false,
            userApi: new User(),
            page: 1,
            perPage: 10,
            hasMoreUsers: true,
            totalRecords: 0,
            searchQuery: "",
            searchTimeout: null,
            isMenuOpen: false,
            observer: null,
            selectedUsersCache: {}, // Cache for selected users data on search
            pendingFetch: false, // Track if we're already fetching selected users
        };
    },

    computed: {
        selectedUsers: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
                this.$emit("change", value);
            },
        },

        hasUsers() {
            return Array.isArray(this.users) && this.users.length > 0;
        },

        noDataText() {
            if (this.loading && this.users.length === 0) {
                return "";
            }
            if (this.searchQuery && this.users.length === 0) {
                return "No users found";
            }
            return this.users.length === 0 ? "No users available" : "";
        },

        isRtl() {
            return this.$i18n?.locale === 'ar' || document.documentElement.dir === 'rtl';
        }
    },

    mounted() {
        this.fetchUsers().then(() => {
            // Fetch data for already selected users
            return this.fetchSelectedUsersData();
        });
    },

    beforeUnmount() {
        // Clean up observer
        if (this.observer) {
            this.observer.disconnect();
        }
        // Clean up search timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    },

    methods: {
        fetchUsers(reset = true) {
            // Prevent multiple simultaneous calls
            if (this.loading || this.loadingMore) return Promise.resolve();

            if (reset) {
                this.loading = true;
                this.page = 1;
                this.users = [];
                this.hasMoreUsers = true;
            } else {
                this.loadingMore = true;
            }

            const baseParams = {
                select: "id|full_name",
                perPage: this.perPage,
                page: this.page,
            };

            // Merge with custom API params
            const params = {
                ...baseParams,
                ...this.apiParams,
            };

            // Add search parameter if search query exists
            if (this.searchQuery && this.searchQuery.trim()) {
                params.search = this.searchQuery.trim();
            }

            return this.userApi.getAll(params)
                .then(response => {
                    // Handle the response structure: { data: [...], recordsTotal: 45, recordsFiltered: 45 }
                    let newUsers = [];
                    let totalRecords = 0;

                    if (response && response.data && Array.isArray(response.data)) {
                        newUsers = response.data;
                        totalRecords = response.recordsTotal || response.recordsFiltered || 0;
                    } else if (Array.isArray(response)) {
                        // Fallback for simple array response
                        newUsers = response;
                        totalRecords = response.length;
                    }

                    this.totalRecords = totalRecords;

                    // Filter out users if filterUsers prop is provided
                    if (this.filterUsers.length > 0) {
                        newUsers = newUsers.filter(
                            (user) =>
                                !this.filterUsers.some(
                                    (filteredUser) => filteredUser.id === user.id
                                )
                        );
                    }

                    // Pre-compute initials and avatar colors for better performance
                    const processedUsers = newUsers.map((user) => ({
                        ...user,
                        initials: this.computeInitials(user.full_name),
                        avatarColor: this.computeAvatarColor(user.id),
                    }));

                    if (reset) {
                        this.users = processedUsers;
                    } else {
                        this.users = [...this.users, ...processedUsers];
                    }

                    // Check if there are more users to load based on total records
                    const totalLoaded = this.users.length;
                    this.hasMoreUsers = totalLoaded < this.totalRecords;
                })
                .catch(error => {
                    console.error("Error fetching users:", error);
                    if (reset) {
                        this.users = [];
                    }
                    this.hasMoreUsers = false;
                })
                .finally(() => {
                    this.loading = false;
                    this.loadingMore = false;
                });
        },

        loadMoreUsers() {
            if (this.loadingMore || !this.hasMoreUsers) return;

            this.page++;
            this.fetchUsers(false).then(() => {
                // Reconnect observer after loading more
                this.$nextTick(() => {
                    this.setupIntersectionObserver();
                });
            });
        },

        setupIntersectionObserver() {
            // Disconnect existing observer
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            // Only set up observer if menu is open and there are more users
            if (!this.isMenuOpen || !this.hasMoreUsers) return;

            // Wait for next tick to ensure DOM is updated
            this.$nextTick(() => {
                const trigger = this.$refs.loadMoreTrigger;
                if (!trigger) return;

                this.observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (
                                entry.isIntersecting &&
                                this.hasMoreUsers &&
                                !this.loadingMore &&
                                !this.loading
                            ) {
                                this.loadMoreUsers();
                            }
                        });
                    },
                    {
                        root: null,
                        rootMargin: "100px",
                        threshold: 0,
                    }
                );

                this.observer.observe(trigger);
            });
        },

        handleMenuToggle(isOpen) {
            this.isMenuOpen = isOpen;

            if (isOpen) {
                // Setup observer when menu opens
                this.setupIntersectionObserver();
            } else {
                // Clean up observer when menu closes
                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }
            }
        },

        handleSearch(value) {
            // Clear existing timeout
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            // Update search query
            this.searchQuery = value || "";

            // Debounce search - wait 500ms after user stops typing
            this.searchTimeout = setTimeout(() => {
                this.fetchUsers(true);
            }, 500);
        },

        computeInitials(name) {
            if (!name) return "U";
            const names = name.trim().split(" ");
            if (names.length === 1) {
                return names[0].charAt(0).toUpperCase();
            }
            return (
                names[0].charAt(0) + names[names.length - 1].charAt(0)
            ).toUpperCase();
        },

        computeAvatarColor(userId) {
            const colors = [
                "#FF7043",
                "#42A5F5",
                "#66BB6A",
                "#AB47BC",
                "#FFA726",
                "#26C6DA",
                "#EF5350",
                "#7E57C2",
            ];
            const index = userId ? userId % colors.length : 0;
            return colors[index];
        },

        getSelectedUserData(userId) {
            // First check in loaded users
            const user = this.users.find((u) => u.id === userId);
            if (user) return user;

            // Then check in selected users cache
            if (this.selectedUsersCache[userId]) {
                return this.selectedUsersCache[userId];
            }

            // Trigger fetch if not found and not already loading
            if (userId && !this.loading && !this.pendingFetch) {
                this.pendingFetch = true;
                this.$nextTick(() => {
                    this.fetchSelectedUsersData().finally(() => {
                        this.pendingFetch = false;
                    });
                });
            }

            // Return default if not found (show empty while loading instead of ID)
            return {
                id: userId,
                full_name: "",
                initials: "...",
                avatarColor: "#FFA726",
            };
        },

        fetchSelectedUsersData() {
            if (!this.modelValue) return Promise.resolve();

            const selectedIds = this.multiple
                ? Array.isArray(this.modelValue)
                    ? this.modelValue
                    : []
                : [this.modelValue];

            if (selectedIds.length === 0) return Promise.resolve();

            // Find IDs that are not in current users list and not in cache
            const missingIds = selectedIds.filter(
                (id) =>
                    id && !this.users.find((u) => u.id === id) && !this.selectedUsersCache[id]
            );

            if (missingIds.length === 0) return Promise.resolve();

            // Fetch missing users data using filterIn for specific IDs
            return this.userApi.getAll({
                select: "id|full_name",
                filterIn: `id|${missingIds.join(",")}`,
            })
                .then(response => {
                    let fetchedUsers = [];
                    if (response && response.data && Array.isArray(response.data)) {
                        fetchedUsers = response.data;
                    } else if (Array.isArray(response)) {
                        fetchedUsers = response;
                    }

                    // Process and cache the fetched users
                    fetchedUsers.forEach((user) => {
                        const processedUser = {
                            ...user,
                            initials: this.computeInitials(user.full_name),
                            avatarColor: this.computeAvatarColor(user.id),
                        };
                        this.selectedUsersCache[user.id] = processedUser;

                        // Also add to users array if not present
                        if (!this.users.find((u) => u.id === user.id)) {
                            this.users.unshift(processedUser);
                        }
                    });

                    // Force re-render
                    this.$forceUpdate();
                })
                .catch(error => {
                    console.error("Error fetching selected users data:", error);
                });
        },

        selectSingleUser(user) {
            // Cache the selected user data
            if (user && user.id && !this.selectedUsersCache[user.id]) {
                this.selectedUsersCache[user.id] = {
                    ...user,
                    initials: user.initials || this.computeInitials(user.full_name),
                    avatarColor: user.avatarColor || this.computeAvatarColor(user.id),
                };
            }

            // For single select, toggle selection
            const newValue = this.modelValue === user.id ? null : user.id;
            // Emit directly to bypass autocomplete's internal state
            this.$emit("update:modelValue", newValue);
            this.$emit("change", newValue);
        },

        toggleUser(user) {
            if (!this.multiple) return;

            // Cache the selected user data
            if (user && user.id && !this.selectedUsersCache[user.id]) {
                this.selectedUsersCache[user.id] = {
                    ...user,
                    initials: user.initials || this.computeInitials(user.full_name),
                    avatarColor: user.avatarColor || this.computeAvatarColor(user.id),
                };
            }

            const currentSelection = Array.isArray(this.modelValue)
                ? [...this.modelValue]
                : [];
            const userIndex = currentSelection.indexOf(user.id);

            if (userIndex > -1) {
                currentSelection.splice(userIndex, 1);
            } else {
                currentSelection.push(user.id);
            }

            // Emit directly to bypass autocomplete's internal state
            this.$emit("update:modelValue", currentSelection);
            this.$emit("change", currentSelection);
        },

        removeUser(userId) {
            if (this.multiple) {
                const currentSelection = Array.isArray(this.modelValue)
                    ? [...this.modelValue]
                    : [];
                const userIndex = currentSelection.indexOf(userId);

                if (userIndex > -1) {
                    currentSelection.splice(userIndex, 1);
                    // Emit directly to bypass autocomplete's internal state
                    this.$emit("update:modelValue", currentSelection);
                    this.$emit("change", currentSelection);
                }
            } else {
                // For single select, clear the selection
                this.$emit("update:modelValue", null);
                this.$emit("change", null);
            }
        },

        isUserSelected(userId) {
            if (this.multiple) {
                return (
                    Array.isArray(this.selectedUsers) &&
                    this.selectedUsers.includes(userId)
                );
            }
            return this.selectedUsers === userId;
        },

        handleSelection(value) {
            // Ensure the model value is always emitted, even when clearing
            this.$emit("update:modelValue", value);
            this.$emit("change", value);

            // When a user is selected, cache their data
            // This ensures user name displays even after search is cleared
            if (!value || (Array.isArray(value) && value.length === 0)) return;

            this.$nextTick(() => {
                const selectedIds = this.multiple
                    ? Array.isArray(value)
                        ? value
                        : []
                    : [value];

                selectedIds.forEach((id) => {
                    // First, try to find user in current users list
                    const userInList = this.users.find((u) => u.id === id);

                    if (userInList) {
                        // Cache the complete user data with all properties
                        if (!this.selectedUsersCache[id]) {
                            this.selectedUsersCache[id] = {
                                id: userInList.id,
                                full_name: userInList.full_name,
                                initials: userInList.initials,
                                avatarColor: userInList.avatarColor,
                            };
                        }

                        // Also ensure user stays in the users array
                        // This prevents the user from disappearing when search is cleared
                        const userIndex = this.users.findIndex((u) => u.id === id);
                        if (userIndex === -1) {
                            this.users.unshift(userInList);
                        }
                    } else if (this.selectedUsersCache[id]) {
                        // User is in cache but not in current users list
                        // Add cached user to users array so it displays
                        const cachedUser = this.selectedUsersCache[id];
                        if (!this.users.find((u) => u.id === cachedUser.id)) {
                            this.users.unshift(cachedUser);
                        }
                    }
                });
            });
        },

        getSelectedUserNames() {
            if (!this.selectedUsers || !this.hasUsers) return [];

            if (this.multiple) {
                return this.users
                    .filter((user) => this.selectedUsers.includes(user.id))
                    .map((user) => user.full_name || "Unknown User");
            } else {
                const user = this.users.find((user) => user.id === this.selectedUsers);
                return user ? [user.full_name || "Unknown User"] : [];
            }
        },

        // Public method to refresh users list
        refreshUsers() {
            return this.fetchUsers(true);
        },
    },

    watch: {
        // Watch modelValue changes to fetch missing selected users data
        modelValue: {
            handler() {
                this.fetchSelectedUsersData();
            },
            deep: true,
        },
    },
};
</script>

<style scoped>
/* Scoped styles refactored to use theme variables and consistent UI */
:deep(.custom-user-autocomplete) {
    --field-border-radius: 10px;
}

:deep(.custom-user-autocomplete .v-field) {
    border-radius: var(--field-border-radius) !important;
    background-color: #fff !important;
    transition: all 0.2s ease !important;
}

:deep(.custom-user-autocomplete .v-field--variant-outlined .v-field__outline__start) {
    border-radius: var(--field-border-radius) 0 0 var(--field-border-radius) !important;
    border-color: var(--color-border) !important;
}

:deep(.custom-user-autocomplete .v-field--variant-outlined .v-field__outline__end) {
    border-radius: 0 var(--field-border-radius) var(--field-border-radius) 0 !important;
    border-color: var(--color-border) !important;
}

:deep(.custom-user-autocomplete .v-field--variant-outlined .v-field__outline__notch) {
    border-color: var(--color-border) !important;
}

:deep(.custom-user-autocomplete .v-field--focused .v-field__outline__start),
:deep(.custom-user-autocomplete .v-field--focused .v-field__outline__end),
:deep(.custom-user-autocomplete .v-field--focused .v-field__outline__notch) {
    border-color: var(--color-main) !important;
    border-width: 2px !important;
}

:deep(.user-select-menu-custom) {
    border-radius: 12px !important;
    border: 1px solid var(--color-border) !important;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
    margin-top: 4px !important;
    overflow: hidden !important;
}

/* RTL Support for selection chips */
:deep(.custom-user-autocomplete[dir="rtl"] .v-field__input) {
    flex-direction: row-reverse !important;
    justify-content: flex-end !important;
}
</style>
