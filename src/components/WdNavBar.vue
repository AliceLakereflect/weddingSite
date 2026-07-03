<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { features } from '@/config/features'

const route = useRoute()
const menuOpen = ref(false)

const navLinks = [
  { to: '/', label: 'HOME' },
  ...(features.ourStory ? [{ to: '/story', label: '我們的故事' }] : []),
  ...(features.gallery ? [{ to: '/gallery', label: '婚紗相簿' }] : []),
  ...(features.rsvp ? [{ to: '/rsvp', label: 'RSVP' }] : []),
]

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-wood-100">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo / couple name -->
      <RouterLink
        to="/"
        class="font-display text-xl text-charcoal tracking-wider hover:text-wood-600 transition-colors"
        @click="closeMenu"
      >
        Nathan <span class="text-gold mx-1">&</span> Alice
      </RouterLink>

      <!-- Desktop nav -->
      <ul class="hidden md:flex items-center gap-8">
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink
            :to="link.to"
            class="nav-link text-charcoal hover:text-wood-600"
            :class="route.path === link.to ? 'text-wood-600 border-b border-wood-500 pb-0.5' : ''"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden p-2 text-charcoal hover:text-wood-600 transition-colors"
        :aria-label="menuOpen ? '關閉選單' : '開啟選單'"
        @click="menuOpen = !menuOpen"
      >
        <svg v-if="!menuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile dropdown -->
    <Transition name="slide-down">
      <ul
        v-if="menuOpen"
        class="md:hidden bg-cream border-t border-wood-100 px-6 pb-4 flex flex-col gap-1"
      >
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink
            :to="link.to"
            class="nav-link block py-3 text-charcoal hover:text-wood-600 border-b border-wood-50"
            :class="route.path === link.to ? 'text-wood-600' : ''"
            @click="closeMenu"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </Transition>
  </nav>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
