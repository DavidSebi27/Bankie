<template>
  <div>
    <div class="approvals-header">
      <p class="approvals-title">
        {{ store.pendingUsers.length }} request{{ store.pendingUsers.length !== 1 ? 's' : '' }} pending
      </p>
      <button class="refresh-btn" :disabled="store.loading" @click="store.fetchUsers()">
        <RefreshCw class="refresh-icon" :class="{ 'refresh-spin': store.loading }" />
        Refresh
      </button>
    </div>

    <div v-if="store.loading && !store.users.length" class="state-box">
      <Loader2 class="state-icon spin" />
      <p class="state-title">Loading requests…</p>
    </div>

    <div v-else-if="!store.pendingUsers.length" class="state-box">
      <CheckCircle class="state-icon state-icon-success" />
      <p class="state-title">All caught up</p>
      <p class="state-sub">No pending approval requests right now.</p>
    </div>

    <div v-else class="requests-list">
      <div v-for="user in store.pendingUsers" :key="user.id" class="request-card">
        <div class="user-avatar">{{ initials(user) }}</div>

        <div class="user-info">
          <p class="user-name">{{ user.firstName }} {{ user.lastName }}</p>
          <p class="user-email">{{ user.email }}</p>
          <div class="user-meta">
            <span class="meta-item">
              <Hash class="meta-icon" /> {{ user.bsn }}
            </span>
            <span class="meta-item">
              <Phone class="meta-icon" /> {{ user.phoneNumber }}
            </span>
          </div>
        </div>

        <span class="status-badge">Pending</span>

        <div class="approve-form">
          <div class="approve-field">
            <label>Absolute Limit</label>
            <input
              v-model.number="forms[user.id].absoluteLimit"
              type="number"
              placeholder="e.g. 0 or -500"
            />
            <p class="field-hint">
              The minimum balance allowed. Use 0 or a negative number to allow overdraft (e.g. -500 means up to €500 overdraft).
            </p>
          </div>
          <div class="approve-field">
            <label>Daily Transfer Limit</label>
            <input
              v-model.number="forms[user.id].dailyTransferLimit"
              type="number"
              placeholder="e.g. 1000"
            />
            <p class="field-hint">
              The maximum total amount this customer can transfer out per day (e.g. 1000 means €1,000/day).
            </p>
          </div>
          <p v-if="errors[user.id]" class="error-msg">{{ errors[user.id] }}</p>
          <p v-if="successes[user.id]" class="success-msg">{{ successes[user.id] }}</p>
          <button
            class="btn-approve"
            :disabled="approving[user.id]"
            @click="handleApprove(user.id)"
          >
            {{ approving[user.id] ? 'Approving…' : 'Approve & Create Accounts' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { RefreshCw, Loader2, CheckCircle, Hash, Phone } from 'lucide-vue-next'
import { useEmployeeStore } from '../../stores/employeeStore'
import { approveCustomer } from '../../api/accounts'

const store = useEmployeeStore()

const forms     = reactive({})
const approving = reactive({})
const errors    = reactive({})
const successes = reactive({})

store.pendingUsers.forEach(u => initForm(u.id))

store.$subscribe(() => {
  store.pendingUsers.forEach(u => {
    if (!forms[u.id]) initForm(u.id)
  })
})

function initForm(id) {
  forms[id]     = { absoluteLimit: 0, dailyTransferLimit: 1000 }
  approving[id] = false
  errors[id]    = null
  successes[id] = null
}

const initials = (user) =>
  `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()

async function handleApprove(userId) {
  errors[userId]    = null
  successes[userId] = null

  const { absoluteLimit, dailyTransferLimit } = forms[userId]

  if (absoluteLimit === '' || dailyTransferLimit === '') {
    errors[userId] = 'Both fields are required.'; return
  }
  if (dailyTransferLimit <= 0) {
    errors[userId] = 'Daily transfer limit must be a positive number.'; return
  }
  if (absoluteLimit > 0) {
    errors[userId] = 'Absolute limit must be zero or negative.'; return
  }

  approving[userId] = true
  try {
    await approveCustomer(userId, absoluteLimit, dailyTransferLimit)
    successes[userId] = 'Customer approved and accounts created!'
    await store.fetchUsers()
  } catch (err) {
    errors[userId] = err.response?.data?.message || 'Failed to approve customer.'
  } finally {
    approving[userId] = false
  }
}
</script>

<style scoped src="../../assets/styles/employee/PendingApprovals.css" />