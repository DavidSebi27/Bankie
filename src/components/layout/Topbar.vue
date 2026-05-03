<template>
    <div class="topbar">
        <h1 class="logo">Banki<span>e</span></h1>
        <div class="topbar-right">
            <button class="notif-btn" aria-label="Notifications">
                <Bell class="w-4 h-4 text-body" />
                <span class="notif-dot" />
            </button>
            <div class="avatar">{{ initials }}</div>
        </div>
    </div>
</template>

<style scoped>
.topbar {
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    padding: 0 2rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
}

.logo {
    font-size: 1.25rem;
    font-weight: 300;
    letter-spacing: -0.64px;
    color: var(--color-heading);
}

.logo span {
    color: var(--color-primary);
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.notif-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    transition: border-color 0.2s;
}

.notif-btn:hover {
    border-color: var(--color-border-purple);
}

.notif-dot {
    position: absolute;
    top: 7px;
    right: 7px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-ruby);
    border: 1.5px solid white;
}

.avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    color: white;
}
</style>