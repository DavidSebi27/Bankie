<template>
    <AuthForm>
        <div class="text-center" id="header">
            <h1 class="text-heading text-heading-section font-light tracking-section">
                Welcome back
            </h1>
            <p class="text-body">Sign in to your account</p>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
            <BaseInput label="Email *" type="email" placeholder="user@example.com" :error="errors.email"
                v-model="form.email" />
            <BaseInput label="Password *" type="password" :error="errors.password" v-model="form.password" />

            <BaseButton :loading="auth.loading" type="submit"
                :disabled="auth.loading || Object.values(errors).some(e => e)">
                Sign in
            </BaseButton>
        </form>
        <p class="text-center text-caption text-body" id="footer">
            Don't have an account?
            <RouterLink to="/register" class="text-primary">
                Sign up
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
    email: '',
    password: ''
})

const errors = reactive({
    email: '',
    password: ''
})

// Dynamically clear errors when the user types in any field
Object.keys(form).forEach(key => {
    watch(() => form[key], () => { errors[key] = '' })
})

const validate = () => {
    let valid = true
    if (!form.email) { errors.email = 'Email is required'; valid = false }
    if (!form.password) { errors.password = 'Password is required'; valid = false }
    return valid
}

const handleLogin = async () => {
    if (!validate()) return

    const success = await auth.login({ ...form })

    if (success) {
        router.push('/dashboard')
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