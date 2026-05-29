<template>
  <div class="dash">
    <div class="layout">
      <EmployeeSidebar :pending-count="employeeStore.pendingUsers.length" />

      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">
            New Transfer
          </h2>
          <p class="text-caption text-body">
            Move funds from one customer's checking account to another.
          </p>
        </div>

        <!-- Success state -->
        <div v-if="success" class="success-card">
          <div class="success-head">
            <CheckCircle class="success-icon" />
            <div>
              <h3 class="success-title">Transfer completed</h3>
              <p class="success-sub">Transaction #{{ success.id }}</p>
            </div>
          </div>

          <dl class="success-grid">
            <div><dt>From</dt><dd class="mono">{{ success.fromIban }}</dd></div>
            <div><dt>To</dt><dd class="mono">{{ success.toIban }}</dd></div>
            <div><dt>Amount</dt><dd class="mono amount">€{{ success.amount }}</dd></div>
            <div><dt>Initiated by</dt><dd>{{ success.initiatedByName || `User #${success.initiatedBy}` }}</dd></div>
            <div class="full"><dt>Timestamp</dt><dd>{{ formatTimestamp(success.timestamp) }}</dd></div>
          </dl>

          <div class="success-actions">
            <button class="btn-secondary" @click="resetForm">New transfer</button>
          </div>
        </div>

        <!-- Form -->
        <form v-else class="transfer-card" @submit.prevent="handleSubmit">
          <div class="field">
            <label class="label">Source IBAN</label>
            <input
              v-model.trim="form.fromIban"
              class="input mono"
              :class="{ 'has-error': errors.fromIban }"
              placeholder="NL00BANK0000000000"
              autocomplete="off"
              spellcheck="false"
            />
            <p v-if="errors.fromIban" class="field-error">{{ errors.fromIban }}</p>
            <button type="button" class="link-btn" @click="openSearch('source')">
              <Search class="link-icon" /> Find by customer name
            </button>
          </div>

          <div class="field">
            <label class="label">Destination IBAN</label>
            <input
              v-model.trim="form.toIban"
              class="input mono"
              :class="{ 'has-error': errors.toIban }"
              placeholder="NL00BANK0000000000"
              autocomplete="off"
              spellcheck="false"
            />
            <p v-if="errors.toIban" class="field-error">{{ errors.toIban }}</p>
            <button type="button" class="link-btn" @click="openSearch('destination')">
              <Search class="link-icon" /> Find by customer name
            </button>
          </div>

          <div class="field">
            <label class="label">Amount (EUR)</label>
            <div class="amount-wrap">
              <span class="amount-prefix">€</span>
              <input
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0.01"
                class="input amount-input"
                :class="{ 'has-error': errors.amount }"
                placeholder="0.00"
              />
            </div>
            <p v-if="errors.amount" class="field-error">{{ errors.amount }}</p>
          </div>

          <p v-if="formError" class="form-error">
            <AlertCircle class="form-error-icon" />
            {{ formError }}
          </p>

          <div class="actions">
            <button type="button" class="btn-secondary" :disabled="submitting" @click="resetForm">
              Clear
            </button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              <Loader2 v-if="submitting" class="btn-icon spin" />
              {{ submitting ? 'Submitting…' : 'Initiate transfer' }}
            </button>
          </div>
        </form>

        <!-- Inline search panel -->
        <div v-if="searchTarget" class="search-card">
          <div class="search-head">
            <p class="section-label">
              Find IBAN for {{ searchTarget === 'source' ? 'source' : 'destination' }} customer
            </p>
            <button class="icon-btn" @click="closeSearch" aria-label="Close">
              <X class="link-icon" />
            </button>
          </div>

          <div class="search-row">
            <input
              v-model="search.firstName"
              class="input"
              placeholder="First name"
              @keyup.enter="runSearch"
            />
            <input
              v-model="search.lastName"
              class="input"
              placeholder="Last name"
              @keyup.enter="runSearch"
            />
            <button class="btn-primary" :disabled="!canSearch || accountStore.searchLoading" @click="runSearch">
              <Loader2 v-if="accountStore.searchLoading" class="btn-icon spin" />
              <Search v-else class="btn-icon" />
              Search
            </button>
          </div>

          <div v-if="accountStore.searchError" class="search-error">
            {{ accountStore.searchError }}
          </div>

          <div
            v-else-if="accountStore.searched && !accountStore.searchResults.length"
            class="search-empty"
          >
            No customers found.
          </div>

          <div v-else-if="accountStore.searchResults.length" class="results-list">
            <button
              v-for="(r, i) in accountStore.searchResults"
              :key="i"
              type="button"
              class="result-row"
              @click="pickResult(r)"
            >
              <div class="result-info">
                <p class="result-name">{{ r.firstName }} {{ r.lastName }}</p>
                <p class="result-iban mono">{{ r.iban }}</p>
              </div>
              <span class="result-pick">Use →</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { CheckCircle, Search, AlertCircle, Loader2, X } from 'lucide-vue-next'
import EmployeeSidebar from '../../components/employee/EmployeeSidebar.vue'
import { useEmployeeStore } from '../../stores/employeeStore'
import { useAccountStore }  from '../../stores/accountStore'
import { createTransfer }   from '../../api/transactions'
import { validateIban, validateAmount, mapTransferError } from '../../composables/validation'
import { formatTimestamp } from '../../composables/format'

const employeeStore = useEmployeeStore()
const accountStore  = useAccountStore()

const form = reactive({
  fromIban: '',
  toIban:   '',
  amount:   null,
})

const errors = reactive({
  fromIban: '',
  toIban:   '',
  amount:   '',
})

const formError  = ref('')
const submitting = ref(false)
const success    = ref(null)

const searchTarget = ref(null) // 'source' | 'destination' | null
const search = reactive({ firstName: '', lastName: '' })
const canSearch = computed(() => search.firstName.trim() && search.lastName.trim())

// Clear field error as user types
Object.keys(form).forEach(key => {
  watch(() => form[key], () => { errors[key] = ''; formError.value = '' })
})

const validate = () => {
  errors.fromIban = validateIban(form.fromIban)
  errors.toIban   = validateIban(form.toIban)
  errors.amount   = validateAmount(form.amount)
  return !errors.fromIban && !errors.toIban && !errors.amount
}

const handleSubmit = async () => {
  formError.value = ''
  if (!validate()) return

  submitting.value = true
  try {
    const res = await createTransfer({
      fromIban: form.fromIban,
      toIban:   form.toIban,
      amount:   Number(form.amount),
    })
    success.value = res.data
  } catch (err) {
    const { field, message } = mapTransferError(err)
    if (field) errors[field] = message
    else       formError.value = message
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  form.fromIban = ''
  form.toIban   = ''
  form.amount   = null
  errors.fromIban = ''
  errors.toIban   = ''
  errors.amount   = ''
  formError.value = ''
  success.value   = null
  closeSearch()
}

const openSearch = (target) => {
  searchTarget.value = target
  accountStore.clearSearch()
  search.firstName = ''
  search.lastName  = ''
}

const closeSearch = () => {
  searchTarget.value = null
}

const runSearch = async () => {
  if (!canSearch.value) return
  await accountStore.searchCustomers(search.firstName.trim(), search.lastName.trim())
}

const pickResult = (r) => {
  if (searchTarget.value === 'source')      form.fromIban = r.iban
  if (searchTarget.value === 'destination') form.toIban   = r.iban
  closeSearch()
}

onMounted(() => {
  if (!employeeStore.users.length) employeeStore.fetchUsers()
})
</script>

<style scoped src="../../assets/styles/employee/EmployeeTransfer.css" />
