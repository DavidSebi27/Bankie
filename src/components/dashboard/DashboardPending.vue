<template>
  <main class="content-centered">
    <div class="page-header">
      <h2 class="text-heading-section font-light tracking-section">
        {{ firstName ? `Welcome, ${firstName}` : 'Welcome!' }}
      </h2>
      <p class="text-caption text-body">Your account is being set up</p>
    </div>

    <div class="pending-card">
      <!-- Glow orbs -->
      <div class="pending-orb pending-orb-1" />
      <div class="pending-orb pending-orb-2" />

      <div class="pending-icon-wrap">
        <Clock class="pending-clock" />
      </div>

      <h3 class="pending-title">Account under review</h3>
      <p class="pending-body">
        Our team is verifying your details. You'll get full access to Bankie
        as soon as your account is approved.
      </p>
      <p class="pending-eta">This usually takes less than 24 hours.</p>

      <!-- Steps -->
      <div class="pending-steps">
        <div class="step">
          <div class="step-dot">
            <CheckCircle class="step-icon" />
          </div>
          <div class="step-info">
            <p class="step-label">Registration complete</p>
            <p class="step-sub">Your details have been submitted</p>
          </div>
        </div>

        <div class="step-line" />

        <div class="step">
          <div class="step-dot step-dot-active">
            <Loader2 class="step-icon step-spin" />
          </div>
          <div class="step-info">
            <p class="step-label">Identity verification</p>
            <p class="step-sub">Our team is reviewing your account</p>
          </div>
        </div>

        <div class="step-line step-line-muted" />

        <div class="step">
          <div class="step-dot step-dot-muted">
            <Wallet class="step-icon step-icon-muted" />
          </div>
          <div class="step-info">
            <p class="step-label step-label-muted">Account activated</p>
            <p class="step-sub">Full access to all features</p>
          </div>
        </div>
      </div>

      <button class="pending-refresh-btn" :disabled="refreshing" @click="emit('refresh')">
        <RefreshCw class="refresh-icon" :class="{ 'refresh-spin': refreshing }" />
        {{ refreshing ? 'Checking…' : 'Refresh status' }}
      </button>
    </div>
  </main>
</template>

<script setup>
import { Clock, CheckCircle, Loader2, Wallet, RefreshCw } from 'lucide-vue-next'

defineProps({
  firstName: { type: String, default: '' },
  refreshing: { type: Boolean, default: false }
})

const emit = defineEmits(['refresh'])
</script>

<style scoped src="../../assets/styles/dashboard/DashboardPending.css" />