<template>
    <AuthForm>
        <div id="header" class="text-center">
            <p class="logo">Banki<span>e</span></p>
            <h1 class="text-heading text-heading-section font-light tracking-section">
                Welcome back
            </h1>
            <p class="text-body">Sign in to your account</p>
        </div>

        <div class="section-divider" />

        <form class="space-y-4" @submit.prevent="handleLogin">
            <BaseInput v-model="form.email" label="Email *" type="email" placeholder="user@example.com"
                :error="errors.email" />

            <BaseInput v-model="form.password" label="Password *" type="password" :error="errors.password" />

            <Transition name="fade">
                <div v-if="auth.error" class="api-error">
                    <AlertCircle class="api-error-icon" />
                    {{ auth.error }}
                </div>
            </Transition>

            <BaseButton type="submit" :loading="auth.loading">
                Sign in
            </BaseButton>
        </form>

        <p id="footer" class="text-center text-caption text-body">
            Don't have an account?
            <RouterLink to="/register" class="text-primary">Sign up</RouterLink>
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

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

const hasErrors = computed(() => Object.values(errors).some(e => e))

Object.keys(form).forEach(key => {
    watch(() => form[key], () => {
        errors[key] = ''
        auth.error = null
    })
})

const validate = () => {
    let valid = true
    if (!form.email.trim()) {
        errors.email = 'Email is required'; valid = false
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = 'Enter a valid email address'; valid = false
    }
    if (!form.password) {
        errors.password = 'Password is required'; valid = false
    }
    return valid
}

const handleLogin = async () => {
    auth.error = null
    if (!validate()) return
    const success = await auth.login({ ...form })
    if (success) router.push('/dashboard')
}
</script>

<style scoped src="../assets/styles/views/Login.css" />