<template>
  <AuthForm>

    <div id="header" class="text-center">
      <p class="logo">Banki<span>e</span></p>
      <div class="portal-badge">
        <span class="portal-dot" />
        Employee Portal
      </div>
      <h1 class="text-heading text-heading-section font-light tracking-section">
        Staff sign in
      </h1>
      <p class="text-body">Access the employee dashboard</p>
    </div>

    <div class="section-divider" />

    <form class="space-y-4" @submit.prevent="handleLogin">

      <BaseInput
        v-model="form.email"
        label="Work email *"
        type="email"
        placeholder="employee@bankie.com"
        :error="errors.email"
      />

      <BaseInput
        v-model="form.password"
        label="Password *"
        type="password"
        :error="errors.password"
      />

      <Transition name="fade">
        <div v-if="auth.error" class="api-error">
          <AlertCircle class="api-error-icon" />
          {{ auth.error }}
        </div>
      </Transition>

      <BaseButton type="submit" :loading="auth.loading" :disabled="auth.loading">
        Sign in
      </BaseButton>

    </form>

    <p id="footer" class="text-center text-caption text-body">
      Customer?
      <RouterLink to="/login" class="text-primary">Go to customer login</RouterLink>
    </p>

  </AuthForm>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import AuthForm   from '../components/auth/AuthForm.vue'
import BaseInput  from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { AlertCircle } from 'lucide-vue-next'

const auth   = useAuthStore()
const router = useRouter()

const EMPLOYEE_ROLES = ['EMPLOYEE', 'ADMIN']

onMounted(() => {
  if (auth.token && EMPLOYEE_ROLES.includes(auth.role)) {
    router.replace('/employee/dashboard')
  }
})

const form   = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

Object.keys(form).forEach(key => {
  watch(() => form[key], () => {
    errors[key] = ''
    auth.error  = null
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
  if (!success) return

  if (EMPLOYEE_ROLES.includes(auth.role)) {
    router.push('/employee/dashboard')
  } else {
    // logout() resets every Pinia store and would wipe auth.error,
    // so capture the message, log out, then set the error.
    const wrongPortalMsg = 'This portal is for employees only. Please use the customer login.'
    auth.logout()
    auth.error = wrongPortalMsg
  }
}
</script>

<style scoped src="../assets/styles/views/EmployeeLogin.css" />
