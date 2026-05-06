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
          </div>
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
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { User, Mail } from 'lucide-vue-next'
import { useAuthStore }  from '../stores/authStore'
import DashboardSidebar from '../components/dashboard/DashboardSidebar.vue'
import { useUserInitials } from '../composables/useUserInitials';

const auth = useAuthStore()
const { initials } = useUserInitials()
</script>

<style scoped src="../assets/styles/views/ProfilePage.css" />
