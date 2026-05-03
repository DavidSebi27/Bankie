<template>
    <AuthForm>
        <div class="text-center" id="header">
            <h1 class="text-heading text-heading-section font-light tracking-section">
                Create account
            </h1>
            <p class="text-body">
                Start your banking journey
            </p>
        </div>


        <form class="space-y-4" @submit.prevent="handleRegister">

            <div class="grid grid-cols-2 gap-4">
                <BaseInput v-model="form.firstName" label="First name *" placeholder="First name"
                    :error="errors.firstName" />
                <BaseInput v-model="form.lastName" label="Last name *" placeholder="Last name"
                    :error="errors.lastName" />
            </div>

            <BaseInput v-model="form.email" type="email" label="Email *" placeholder="user@example.com"
                :error="errors.email" />

            <BaseInput v-model="form.password" type="password" label="Password *" :error="errors.password" />

            <BaseInput v-model="form.bsn" label="BSN *" :error="errors.bsn" />

            <BaseInput v-model="form.phoneNumber" label="Phone number *" :error="errors.phoneNumber" />

            <BaseButton :loading="auth.loading" type="submit"
                :disabled="auth.loading || Object.values(errors).some(e => e)">
                Create account
            </BaseButton>

        </form>
        <p class="text-center text-caption" id="footer">
            Already have an account?
            <RouterLink to="/login" class="text-primary">
                Sign in
            </RouterLink>
        </p>

    </AuthForm>
</template>

<script setup>
import AuthForm from '../components/auth/AuthForm.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { reactive, watch } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bsn: '',
    phoneNumber: ''
})

const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bsn: '',
    phoneNumber: ''
})

// Dynamically clear errors when the user types in any field
Object.keys(form).forEach(key => {
    watch(() => form[key], () => { errors[key] = '' })
})

const validate = () => {
    let valid = true
    if (!form.firstName) {
        errors.firstName = 'First name is required'
        valid = false
    }

    if (!form.lastName) {
        errors.lastName = 'Last name is required'
        valid = false
    }

    if (!form.email) {
        errors.email = 'Email is required'
        valid = false
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = 'Invalid email'
        valid = false
    }

    if (!form.password) {
        errors.password = 'Password is required'
        valid = false
    } else if (
        form.password.length < 8 || !/\d/.test(form.password) || !/[A-Z]/.test(form.password) ||
        !/[a-z]/.test(form.password) || !/[!@#$%^&*(),.?":{}|<>]/.test(form.password)
    ) {
        errors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
        valid = false
    }

    if (!form.bsn) {
        errors.bsn = 'BSN is required'
        valid = false
    } else if (!/^\d{8,9}$/.test(form.bsn)) {
        errors.bsn = 'Invalid BSN'
        valid = false
    }

    if (!form.phoneNumber) {
        errors.phoneNumber = 'Phone number is required'
        valid = false
    }

    return valid
}

const handleRegister = async () => {
    if (!validate()) return

    const success = await auth.register({ ...form })

    if (success) {
        router.push('/login')
    }
}
</script>

<style scoped>
#header {
    margin: 1rem 0;
}

#header h1 {
    margin: 1rem 0;
}

#footer {
    margin-top: 1rem;
}
</style>