<template>
    <button :type="type" class="btn btn-primary w-full flex justify-center items-center" :disabled="loading">
        <span v-if="!loading">
            <slot />
        </span>

        <span v-else class="animate-pulse">
            Loading...
        </span>
    </button>
</template>

<script setup>
defineProps({
    loading: Boolean,
    type: {
        type: String,
        default: 'button'
    }
})
</script>