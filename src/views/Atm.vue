<template>
  <div class="atm">
    <div class="atm-frame">
      <header class="atm-brand">
        <div class="brand-mark">
          <Banknote class="brand-icon" />
          <span class="brand-name">Bankie ATM</span>
        </div>
        <RouterLink to="/dashboard" class="exit-link">
          <ArrowLeft class="exit-icon" /> Exit ATM
        </RouterLink>
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
          <article v-for="acct in accounts" :key="acct.iban" class="account">
            <div class="account-head">
              <Wallet class="account-icon" />
              <div class="account-meta">
                <p class="account-label">{{ acct.type || acct.name || 'Account' }}</p>
                <p class="account-iban">{{ acct.iban }}</p>
              </div>
              <p class="account-balance">€{{ formatBalance(acct.balance) }}</p>
            </div>

            <!-- Default action buttons -->
            <div v-if="action?.iban !== acct.iban" class="account-actions">
              <button class="atm-btn atm-btn-deposit" @click="startAction(acct, 'deposit')">
                <ArrowDownToLine class="btn-icon" /> Deposit
              </button>
              <button class="atm-btn atm-btn-withdraw" @click="startAction(acct, 'withdraw')">
                <ArrowUpFromLine class="btn-icon" /> Withdraw
              </button>
            </div>

            <!-- Inline action form -->
            <form v-else class="action-form" @submit.prevent="submitAction(acct)">
              <p class="action-prompt">
                {{ action.type === 'deposit' ? 'Deposit to' : 'Withdraw from' }}
                <strong>{{ acct.type || 'Account' }}</strong>
              </p>

              <div class="amount-wrap">
                <span class="amount-prefix">€</span>
                <input
                  ref="amountInputRef"
                  v-model.number="action.amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  class="amount-input"
                  :class="{ 'has-error': action.error }"
                  placeholder="0.00"
                  :disabled="action.submitting"
                />
              </div>

              <div class="quick-amounts">
                <button
                  v-for="q in quickAmounts"
                  :key="q"
                  type="button"
                  class="quick-btn"
                  :disabled="action.submitting"
                  @click="action.amount = q"
                >
                  €{{ q }}
                </button>
              </div>

              <p v-if="action.error" class="action-error">
                <AlertCircle class="action-error-icon" />
                {{ action.error }}
              </p>

              <p v-if="action.success" class="action-success">
                <CheckCircle class="action-success-icon" />
                {{ action.success }}
              </p>

              <div class="action-buttons">
                <button
                  type="button"
                  class="atm-btn atm-btn-ghost"
                  :disabled="action.submitting"
                  @click="cancelAction"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="atm-btn"
                  :class="action.type === 'deposit' ? 'atm-btn-deposit' : 'atm-btn-withdraw'"
                  :disabled="action.submitting || !(action.amount > 0)"
                >
                  <Loader2 v-if="action.submitting" class="btn-icon spin" />
                  {{ action.submitting
                    ? (action.type === 'deposit' ? 'Depositing…' : 'Withdrawing…')
                    : (action.type === 'deposit' ? 'Confirm deposit' : 'Confirm withdraw') }}
                </button>
              </div>
            </form>
          </article>
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
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Banknote, AlertCircle, CheckCircle, Loader2, CircleSlash, Wallet,
  ArrowDownToLine, ArrowUpFromLine, ArrowLeft, LogOut,
} from 'lucide-vue-next'
import BaseInput  from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import { useAuthStore } from '../stores/authStore'
import { getMyAccounts } from '../api/accounts'
import { deposit, withdraw } from '../api/transactions'

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

const quickAmounts = [20, 50, 100, 200]

// Inline action state — one at a time across the page
const action = ref(null)
const amountInputRef = ref(null)

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

const startAction = (acct, type) => {
  action.value = {
    iban: acct.iban,
    type, // 'deposit' | 'withdraw'
    amount: null,
    submitting: false,
    error: '',
    success: '',
  }
  nextTick(() => amountInputRef.value?.focus())
}

const cancelAction = () => {
  action.value = null
}

const submitAction = async (acct) => {
  if (!action.value) return
  const { type, amount } = action.value
  if (!(amount > 0)) return

  action.value.submitting = true
  action.value.error      = ''
  action.value.success    = ''

  try {
    const fn = type === 'deposit' ? deposit : withdraw
    await fn({ iban: acct.iban, amount: Number(amount) })

    action.value.success = type === 'deposit'
      ? `€${amount} deposited.`
      : `€${amount} dispensed. Please collect your cash.`

    // Refresh balances before closing the form
    await loadAccounts()

    // Auto-close after a short pause so the user reads the confirmation
    setTimeout(() => {
      if (action.value && action.value.iban === acct.iban) cancelAction()
    }, 2500)
  } catch (err) {
    const status  = err.response?.status
    const message = err.response?.data?.message

    if (status === 400) {
      action.value.error = message || 'Invalid amount or IBAN'
    } else if (status === 422) {
      // Surface the business-rule message verbatim
      action.value.error = message || 'Transaction declined'
    } else if (status === 404) {
      action.value.error = 'Session expired. Please sign out and back in.'
    } else {
      action.value.error = message || 'Something went wrong. Please try again.'
    }
  } finally {
    if (action.value) action.value.submitting = false
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
  action.value   = null
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
