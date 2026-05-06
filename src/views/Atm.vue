<template>
  <div class="atm">
    <div class="atm-frame">
      <header class="atm-brand">
        <Banknote class="brand-icon" />
        <span class="brand-name">Bankie ATM</span>
      </header>

      <!-- 1) Logged in but wrong role / unapproved → block -->
      <section v-if="block" class="atm-card block-card">
        <AlertCircle class="block-icon" />
        <h2 class="block-title">{{ block.title }}</h2>
        <p class="block-sub">{{ block.message }}</p>
        <button class="atm-btn atm-btn-ghost" @click="handleSignOut">
          <LogOut class="btn-icon" /> Sign out
        </button>
      </section>

      <!-- 2) Approved customer → ATM dashboard -->
      <section v-else-if="ready" class="atm-card dashboard">
        <div class="welcome">
          <p class="welcome-eyebrow">Signed in as</p>
          <h2 class="welcome-name">
            {{ auth.user?.firstName }} {{ auth.user?.lastName }}
          </h2>
        </div>

        <div v-if="loadingAccounts" class="state-row">
          <Loader2 class="state-icon spin" />
          <span>Loading accounts…</span>
        </div>

        <div v-else-if="accountsError" class="state-row error">
          <AlertCircle class="state-icon" />
          <span>{{ accountsError }}</span>
          <button class="atm-btn atm-btn-ghost" @click="loadAccounts">Retry</button>
        </div>

        <div v-else-if="!accounts.length" class="state-row">
          <CircleSlash class="state-icon" />
          <span>No accounts available.</span>
        </div>

        <div v-else class="accounts">
          <article v-for="acct in accounts" :key="acct.id" class="account">
            <div class="account-head">
              <Wallet class="account-icon" />
              <div class="account-meta">
                <p class="account-label">{{ acct.type || acct.name || 'Account' }}</p>
                <p class="account-iban">{{ acct.iban }}</p>
              </div>
              <p class="account-balance">€{{ formatBalance(acct.balance) }}</p>
            </div>

            <div class="account-actions">
              <button class="atm-btn atm-btn-deposit" disabled title="Coming soon">
                <ArrowDownToLine class="btn-icon" /> Deposit
              </button>
              <button class="atm-btn atm-btn-withdraw" disabled title="Coming soon">
                <ArrowUpFromLine class="btn-icon" /> Withdraw
              </button>
            </div>
          </article>

          <p class="note">Deposit and withdraw are coming soon.</p>
        </div>

        <button class="end-session" @click="handleSignOut">
          <LogOut class="btn-icon" /> End session
        </button>
      </section>

      <!-- 3) Default: login form -->
      <form v-else class="atm-card login-form" @submit.prevent="handleLogin">
        <p class="login-prompt">Insert your credentials to begin.</p>

        <BaseInput
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="user@example.com"
          :error="errors.email"
        />
        <BaseInput
          v-model="form.password"
          type="password"
          label="Password"
          :error="errors.password"
        />

        <p v-if="loginError" class="form-error">{{ loginError }}</p>

        <BaseButton :loading="auth.loading" type="submit">
          Sign in
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import {
  Banknote, AlertCircle, Loader2, CircleSlash, Wallet,
  ArrowDownToLine, ArrowUpFromLine, LogOut,
} from 'lucide-vue-next'
import BaseInput  from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { useAuthStore } from '../stores/authStore'
import { getMyAccounts } from '../api/accounts'

const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})
const errors = reactive({
  email: '',
  password: '',
})
const loginError = ref('')

Object.keys(form).forEach(key => {
  watch(() => form[key], () => { errors[key] = ''; loginError.value = '' })
})

const accounts        = ref([])
const loadingAccounts = ref(false)
const accountsError   = ref(null)

const block = computed(() => {
  if (!auth.token) return null
  if (auth.role && auth.role !== 'CUSTOMER') {
    return {
      title: 'This terminal is for customers',
      message: 'Employee accounts can\'t be used at the ATM.',
    }
  }
  if (auth.role === 'CUSTOMER' && auth.user && auth.user.approved === false) {
    return {
      title: 'Account not activated',
      message: 'Your account isn\'t activated yet. Please contact a Bankie employee.',
    }
  }
  return null
})

const ready = computed(() =>
  auth.token && auth.role === 'CUSTOMER' && auth.user?.approved === true
)

const loadAccounts = async () => {
  loadingAccounts.value = true
  accountsError.value   = null
  try {
    const res = await getMyAccounts()
    accounts.value = Array.isArray(res.data) ? res.data : (res.data?.content ?? [])
  } catch (err) {
    if (err.response?.status === 404) {
      // Per the oracle defense, 404 here is indistinguishable. Keep it generic.
      accounts.value = []
    } else {
      accountsError.value = err.response?.data?.message || 'Failed to load accounts'
    }
  } finally {
    loadingAccounts.value = false
  }
}

const validate = () => {
  let ok = true
  if (!form.email)    { errors.email    = 'Email is required'; ok = false }
  if (!form.password) { errors.password = 'Password is required'; ok = false }
  return ok
}

const handleLogin = async () => {
  loginError.value = ''
  if (!validate()) return

  const success = await auth.login({ email: form.email, password: form.password })
  if (!success) {
    loginError.value = auth.error || 'Login failed'
    return
  }

  // role/approved checks happen reactively via computed `block` and `ready`.
  form.password = ''
}

const handleSignOut = () => {
  auth.logout()
  accounts.value = []
}

watch(ready, (isReady) => {
  if (isReady) loadAccounts()
}, { immediate: true })

onMounted(() => {
  if (auth.token && !auth.initialized) auth.fetchUser()
})

const formatBalance = (b) => {
  if (b == null) return '0.00'
  return typeof b === 'string' ? b : String(b)
}
</script>

<style scoped src="../assets/styles/views/Atm.css" />
