<template>
    <div class="w-full">
        <div v-if="users && users.length" class="flex justify-center">
            <div class="relative flex items-center h-8 min-w-[32px]">
                <!-- Member badges with spacing -->
                <span v-for="(user, index) in visibleUsers" :key="user.id"
                    class="absolute w-8 h-8 rounded-full text-white flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 border-white flex-shrink-0 transition-transform duration-200 hover:scale-110 hover:z-[100] cursor-pointer"
                    :style="{
                        right: isRtl ? `${index * spacing}px` : 'auto',
                        left: !isRtl ? `${index * spacing}px` : 'auto',
                        zIndex: index + 1,
                        backgroundColor: getColor(user.id),
                    }" :title="user.full_name || user.name" @click="openUserDialog(user)">
                    {{ getInitials(user.full_name || user.name) }}
                </span>

                <!-- + badge for remaining users -->
                <span v-if="remainingCount > 0"
                    class="absolute min-w-[32px] h-8 px-2 rounded-full bg-gradient-to-br from-[var(--color-main)] to-[var(--color-hover)] text-white flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 border-white flex-shrink-0 whitespace-nowrap transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer z-10"
                    :style="{
                        right: isRtl ? `${maxVisible * spacing}px` : 'auto',
                        left: !isRtl ? `${maxVisible * spacing}px` : 'auto'
                    }" @click="openAllUsersDialog">
                    +{{ remainingCount }}
                </span>
            </div>
        </div>
        <span v-else class="text-sm text-gray-400 italic">{{ emptyText }}</span>

        <!-- Teleport dialogs outside to avoid z-index issues with parent modals -->
        <Teleport to="body">
            <!-- All Users Dialog -->
            <v-dialog v-model="showAllUsersDialog" max-width="500px" persistent scrollable class="z-[10000]">
                <v-card class="rounded-2xl overflow-hidden shadow-2xl">
                    <v-card-title class="!p-0">
                        <div
                            class="bg-[var(--color-main)] px-6 py-4 flex items-center justify-between text-white shadow-lg">
                            <div class="flex flex-col">
                                <h5 class="text-lg font-bold m-0 leading-tight">All Members</h5>
                                <span class="text-xs opacity-80 font-medium">{{ users.length }} total members</span>
                            </div>
                            <button @click="showAllUsersDialog = false"
                                class="hover:bg-white/20 p-2 rounded-full transition-all text-white">
                                <v-icon size="20">mdi-close</v-icon>
                            </button>
                        </div>
                    </v-card-title>

                    <v-card-text class="!p-6 bg-[var(--color-bg)]" style="max-height: 400px">
                        <div class="flex flex-col gap-3">
                            <div v-for="user in users" :key="user.id"
                                class="flex items-center gap-4 p-3 bg-white border border-[var(--color-border)] rounded-xl cursor-pointer transition-all hover:bg-[var(--color-bg-selected)] hover:translate-x-1 group"
                                @click="
                                    openUserDialog(user);
                                showAllUsersDialog = false;
                                ">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-sm transition-transform group-hover:scale-110"
                                    :style="{ backgroundColor: getColor(user.id) }">
                                    {{ getInitials(user.full_name || user.name) }}
                                </div>
                                <div class="flex flex-col overflow-hidden">
                                    <span class="text-sm font-bold text-[var(--color-text-primary)] truncate">
                                        {{ user.full_name || user.name }}
                                    </span>
                                    <span class="text-xs text-gray-500 truncate" v-if="user.email">
                                        {{ user.email }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </Teleport>
    </div>
</template>

<script>
export default {
    name: "AvatarGroup",

    props: {
        users: {
            type: Array,
            required: true,
            default: () => [],
        },
        maxVisible: {
            type: Number,
            default: 3,
        },
        spacing: {
            type: Number,
            default: 20, // px spacing between avatars
        },
        clickable: {
            type: Boolean,
            default: true,
        },
        emptyText: {
            type: String,
            default: "N/A",
        },
        colors: {
            type: Array,
            default: () => [
                "#6E3894",
                "#FF6B6B",
                "#4ECDC4",
                "#45B7D1",
                "#96CEB4",
                "#FFEAA7",
                "#DDA0DD",
                "#98D8C8",
                "#F7DC6F",
                "#BB8FCE",
                "#85C1E9",
                "#F8C471",
                "#82E0AA",
                "#F1948A",
                "#7FB3D5",
                "#D7BDE2",
                "#76D7C4",
                "#F9E79F",
                "#AED6F1",
                "#E59866",
            ],
        },
    },

    data() {
        return {
            showUserDialog: false,
            showAllUsersDialog: false,
            selectedUser: null,
        };
    },

    emits: ["click", "user-click"],

    computed: {
        visibleUsers() {
            return this.users.slice(0, this.maxVisible);
        },

        remainingCount() {
            return Math.max(0, this.users.length - this.maxVisible);
        },

        isRtl() {
            return document.documentElement.dir === 'rtl' || this.$i18n?.locale === 'ar';
        }
    },

    methods: {
        getInitials(fullName) {
            if (!fullName) return "NA";
            const names = fullName.trim().split(" ");

            if (names.length === 1) {
                return fullName.substring(0, 2).toUpperCase();
            }

            return (
                names[0].charAt(0) + names[names.length - 1].charAt(0)
            ).toUpperCase();
        },

        getColor(userId) {
            if (!userId) return this.colors[0];
            // Simple hash function for consistent colors
            let hash = 0;
            const seed = String(userId);
            for (let i = 0; i < seed.length; i++) {
                hash = seed.charCodeAt(i) + ((hash << 5) - hash);
            }
            const index = Math.abs(hash) % this.colors.length;
            return this.colors[index];
        },

        openUserDialog(user) {
            if (this.clickable) {
                this.selectedUser = user;
                // Logic to show individual user info can be added here or emitted
                this.$emit("user-click", user);
            }
        },

        openAllUsersDialog() {
            if (this.clickable) {
                this.showAllUsersDialog = true;
            }
        },
    },
};
</script>

<style scoped>
/* Scoped styles removed in favor of Tailwind CSS */
/* We keep custom scrollbar for the dialog text if needed, but Tailwind classes can handle most things */
</style>
