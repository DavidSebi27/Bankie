<template>
    <AuthForm>
        <div id="header" class="text-center">
            <p class="logo">Banki<span>e</span></p>
            <h1 class="text-heading text-heading-section font-light tracking-section">
                Create account
            </h1>
            <p class="text-body">Start your banking journey</p>
        </div>
        <div class="section-divider" />
        <form class="space-y-4" @submit.prevent="handleRegister">
            <div class="grid-2">
                <BaseInput v-model="form.firstName" label="First name *" placeholder="James"
                    :error="errors.firstName" />
                <BaseInput v-model="form.lastName" label="Last name *" placeholder="Doe" :error="errors.lastName" />
            </div>

            <BaseInput v-model="form.email" type="email" label="Email *" placeholder="user@example.com"
                :error="errors.email" />

            <div>
                <BaseInput v-model="form.password" type="password" label="Password *" :error="errors.password" />
                <div v-if="form.password" class="pw-strength">
                    <div class="pw-bars">
                        <div v-for="i in 4" :key="i" class="pw-bar" :class="pwBarClass(i)" />
                    </div>
                    <span class="pw-label" :class="pwLabelClass">{{ pwLabel }}</span>
                </div>
                <p v-else class="field-hint">
                    Min. 8 characters with uppercase, number &amp; symbol
                </p>
            </div>

            <BaseInput v-model="form.confirmPassword" type="password" label="Confirm password *"
                :error="errors.confirmPassword" />

            <div class="grid-2">
                <div>
                    <BaseInput v-model="form.bsn" label="BSN *" placeholder="12345678" :error="errors.bsn" />
                    <p class="field-hint">8 or 9 digit citizen number</p>
                </div>
                <BaseInput v-model="form.phoneNumber" label="Phone number *" placeholder="+31 6 12345678"
                    :error="errors.phoneNumber" />
            </div>

            <Transition name="fade">
                <div v-if="auth.error" class="api-error">
                    <AlertCircle class="api-error-icon" />
                    {{ auth.error }}
                </div>
            </Transition>

            <BaseButton type="submit" :loading="auth.loading" :disabled="auth.loading || hasErrors">
                Create account
            </BaseButton>
        </form>
        <p id="footer" class="text-center text-caption">
            Already have an account?
            <RouterLink to="/login" class="text-primary">Sign in</RouterLink>
        </p>
    </AuthForm>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import AuthForm from '../components/auth/AuthForm.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { AlertCircle } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bsn: '',
    phoneNumber: '',
})

const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bsn: '',
    phoneNumber: '',
})

Object.keys(form).forEach(key => {
    watch(() => form[key], () => {
        errors[key] = ''
        auth.error = null
    })
})

// Re-validate confirmPassword live when password changes
watch(() => form.password, () => {
    if (form.confirmPassword && form.confirmPassword !== form.password) {
        errors.confirmPassword = 'Passwords do not match'
    } else {
        errors.confirmPassword = ''
    }
})

const hasErrors = computed(() => Object.values(errors).some(e => e))

const pwScore = computed(() => {
    const p = form.password
    if (!p) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
    if (/\d/.test(p)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(p)) score++
    return score
})

const pwLabel = computed(() => {
    const s = pwScore.value
    if (s <= 1) return 'Weak — add uppercase, number & symbol'
    if (s === 2) return 'Fair — keep going'
    if (s === 3) return 'Good — almost there'
    return 'Strong password'
})

const pwLabelClass = computed(() => ({
    'pw-weak': pwScore.value <= 1,
    'pw-fair': pwScore.value === 2,
    'pw-good': pwScore.value === 3,
    'pw-strong': pwScore.value === 4,
}))

const pwBarClass = (i) => {
    if (i > pwScore.value) return ''
    if (pwScore.value <= 1) return 'bar-weak'
    if (pwScore.value === 2) return 'bar-fair'
    if (pwScore.value === 3) return 'bar-good'
    return 'bar-strong'
}

const validate = () => {
    let valid = true

    if (!form.firstName.trim()) { errors.firstName = 'First name is required'; valid = false }
    if (!form.lastName.trim()) { errors.lastName = 'Last name is required'; valid = false }

    if (!form.email.trim()) {
        errors.email = 'Email is required'; valid = false
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = 'Enter a valid email address'; valid = false
    }

    if (!form.password) {
        errors.password = 'Password is required'; valid = false
    } else if (pwScore.value < 4) {
        errors.password = 'Password must include uppercase, lowercase, number & symbol'
        valid = false
    }

    if (!form.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password'; valid = false
    } else if (form.confirmPassword !== form.password) {
        errors.confirmPassword = 'Passwords do not match'; valid = false
    }

    if (!form.bsn) {
        errors.bsn = 'BSN is required'; valid = false
    } else if (!/^\d{8,9}$/.test(form.bsn)) {
        errors.bsn = 'BSN must be 8 or 9 digits'; valid = false
    }

    if (!form.phoneNumber.trim()) { errors.phoneNumber = 'Phone number is required'; valid = false }

    return valid
}

const handleRegister = async () => {
    auth.error = null
    if (!validate()) return
    const { confirmPassword, ...payload } = form
    const success = await auth.register(payload)
    if (success) router.push('/login')
}
</script>

<style scoped src="../assets/styles/views/Register.css" />