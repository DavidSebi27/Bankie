<template>
    <div class="min-h-screen flex items-center justify-center px-4 bg-bg relative">
        <div class="gradient"></div>

        <div class="relative w-full max-w-md">
            <BaseCard>
                <slot />
            </BaseCard>
        </div>

    </div>
</template>

<script setup>
import BaseCard from '../ui/BaseCard.vue'
</script>