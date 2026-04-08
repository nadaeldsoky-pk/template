<template>
    <div class="logo-container" :class="{ 'rail': rail }">
        <transition name="fade" mode="out-in">
            <div v-if="rail" key="small" class="logo-small-wrapper">
                <img src="/smallLogo.png" alt="Small Logo" class="logo-img-small" />
            </div>
            <div v-else key="full" class="logo-full-wrapper">
                <img src="/logo.png" alt="Logo" class="logo-img-full" />
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
defineProps({
    rail: {
        type: Boolean,
        required: true
    }
})
</script>

<style scoped>
.logo-container {
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    /* Match AppBar border for seamless joining */
    border-bottom: 1px solid #e0e0e0 !important;
    position: sticky;
    top: 0;
    transition: all 0.3s ease;
    overflow: hidden;
    z-index: 100;
}

.logo-full-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
}

.logo-small-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
}

.logo-img-full {
    max-width: 100%;
    max-height: 50px;
    /* Slight margin from container edges */
    height: auto;
    object-fit: contain;
}

.logo-img-small {
    max-width: 100%;
    max-height: 50px;
    height: auto;
    object-fit: contain;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
