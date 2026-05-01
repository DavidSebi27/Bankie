<template>
    <div class="space-y-1">
        <label v-if="label" class="text-label text-sm">
            {{ label }}
        </label>

        <input :type="type" :placeholder="placeholder" class="input w-full" :value="modelValue" :class="[
            'input',
            error ? 'input-error' : ''
        ]" @input="emit('update:modelValue', $event.target.value)" />
        <p v-if="error" class="text-ruby text-caption">
            {{ error }}
        </p>
    </div>
</template>
<script setup>
defineProps({
    modelValue: String,
    type: {
        type: String,
        default: 'text'
    },
    placeholder: String,
    label: String,
    error: String
})

const emit = defineEmits(['update:modelValue'])
</script>