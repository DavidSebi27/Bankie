<template>
  <main class="content-centered">
    <div class="page-header">
      <h2 class="text-heading-section font-light tracking-section">
        Welcome, {{ firstName }}
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

<style scoped>
.content-centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header { width: 100%; margin-bottom: 1.75rem; }

.pending-card {
  width: 100%;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 36px 40px;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.pending-orb { position: absolute; border-radius: 50%; pointer-events: none; }
.pending-orb-1 {
  top: -80px; right: -80px;
  width: 260px; height: 260px;
  background: radial-gradient(circle, rgba(83,58,253,0.08), transparent 70%);
}
.pending-orb-2 {
  bottom: -60px; left: -60px;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(249,107,238,0.07), transparent 70%);
}

.pending-icon-wrap {
  width: 56px; height: 56px;
  border-radius: 16px;
  background: #eeeeff;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
  position: relative; z-index: 1;
}
.pending-clock { width: 26px; height: 26px; color: var(--color-primary); }

.pending-title {
  font-size: 1.25rem; font-weight: 300;
  color: var(--color-heading);
  letter-spacing: -0.5px;
  margin-bottom: 10px;
  position: relative; z-index: 1;
}
.pending-body {
  font-size: 14px; color: var(--color-body);
  line-height: 1.6; max-width: 360px;
  margin: 0 auto 8px;
  position: relative; z-index: 1;
}
.pending-eta {
  font-size: 12px; color: var(--color-body);
  opacity: 0.7; margin-bottom: 32px;
  position: relative; z-index: 1;
}

.pending-steps {
  text-align: left;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 28px;
  background: #fafbff;
  position: relative; z-index: 1;
}

.step { display: flex; align-items: flex-start; gap: 12px; }
.step-line {
  width: 2px; height: 20px;
  background: var(--color-primary-light);
  margin: 4px 0 4px 14px;
}
.step-line-muted { background: var(--color-border); }

.step-dot {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: #eeeeff;
  display: flex; align-items: center; justify-content: center;
}
.step-dot-active { background: var(--color-primary); }
.step-dot-muted  { background: var(--color-border); }

.step-icon { width: 14px; height: 14px; color: var(--color-primary); }
.step-dot-active .step-icon { color: white; }
.step-icon-muted { color: var(--color-body); opacity: 0.4; }

@keyframes spin { to { transform: rotate(360deg); } }
.step-spin { animation: spin 1.4s linear infinite; }

.step-info { padding-top: 3px; }
.step-label { font-size: 13px; font-weight: 500; color: var(--color-label); }
.step-label-muted { color: var(--color-body); opacity: 0.5; }
.step-sub { font-size: 11px; color: var(--color-body); margin-top: 1px; }

.pending-refresh-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px; border-radius: 8px;
  font-size: 13px; font-weight: 500; cursor: pointer;
  border: 1px solid var(--color-border-purple);
  background: #eeeeff; color: var(--color-primary);
  transition: all 0.15s;
  position: relative; z-index: 1;
}
.pending-refresh-btn:hover:not(:disabled) { background: #e0e0ff; border-color: var(--color-primary); }
.pending-refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.refresh-icon { width: 14px; height: 14px; }
@keyframes refresh-spin { to { transform: rotate(360deg); } }
.refresh-spin { animation: refresh-spin 0.8s linear infinite; }
</style>