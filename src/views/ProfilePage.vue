<template>
  <div class="dash">
    <div class="layout">
      <DashboardSidebar />

      <main class="content">
        <div class="page-header">
          <h2 class="text-heading-section font-light tracking-section">Profile</h2>
          <p class="text-caption text-body">Your personal information</p>
        </div>

        <div class="profile-header">
          <div class="profile-avatar">{{ initials }}</div>
          <div class="profile-identity">
            <p class="profile-name">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
            <div class="profile-badges">
              <span class="badge badge-customer">Customer</span>
              <span v-if="auth.user?.approved" class="badge badge-approved">Approved</span>
              <span v-else class="badge badge-pending">Pending approval</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-card-header">
            <User class="info-card-icon" />
            <p class="info-card-title">Personal Information</p>
          </div>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-key">First name</span>
              <span class="info-val">{{ auth.user?.firstName ?? '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">Last name</span>
              <span class="info-val">{{ auth.user?.lastName ?? '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-key">BSN</span>
              <span class="info-val info-val-mono">{{ auth.user?.bsn ?? '—' }}</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-card-header">
            <Mail class="info-card-icon" />
            <p class="info-card-title">Contact Information</p>
            <button v-if="!editing" class="btn-edit" @click="startEdit">Edit</button>
          </div>

          <template v-if="!editing">
            <div class="info-grid">
              <div class="info-row">
                <span class="info-key">Email address</span>
                <span class="info-val">{{ auth.user?.email ?? '—' }}</span>
              </div>
              <div class="info-row">
                <span class="info-key">Phone number</span>
                <span class="info-val info-val-mono">{{ auth.user?.phoneNumber ?? '—' }}</span>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="info-grid">
              <div class="info-row">
                <label class="info-key" for="edit-email">Email address</label>
                <input id="edit-email" v-model="form.email" class="info-input" type="email" />
              </div>
              <div class="info-row">
                <label class="info-key" for="edit-phone">Phone number</label>
                <input id="edit-phone" v-model="form.phoneNumber" class="info-input" type="tel" />
              </div>
            </div>
            <p v-if="saveError" class="error-msg">{{ saveError }}</p>
            <p v-if="saveSuccess" class="success-msg">{{ saveSuccess }}</p>
            <div class="edit-actions">
              <button class="btn-save" :disabled="saving" @click="saveEdit">
                {{ saving ? 'Saving…' : 'Save changes' }}
              </button>
              <button class="btn-cancel" @click="cancelEdit">Cancel</button>
            </div>
          </template>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, Mail } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import { useUserInitials } from '../composables/useUserInitials'
import { updateMe } from '../api/auth'

const auth = useAuthStore()
const { initials } = useUserInitials()

const editing = ref(false)
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')
const form = ref({ email: '', phoneNumber: '' })

function startEdit() {
  form.value = { email: auth.user?.email ?? '', phoneNumber: auth.user?.phoneNumber ?? '' }
  saveError.value = ''
  saveSuccess.value = ''
  editing.value = true
}

function cancelEdit() {
  editing.value = false
}

async function saveEdit() {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = ''
  try {
    await updateMe(form.value)
    // Re-fetch through the store so the update is persisted to localStorage,
    // otherwise the edit gets wiped on the next page refresh.
    await auth.fetchUser()
    saveSuccess.value = 'Contact information updated.'
    editing.value = false
  } catch (e) {
    saveError.value = e?.response?.data?.message ?? 'Failed to save changes.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped src="../assets/styles/views/ProfilePage.css" />