<script setup lang="ts">
defineProps<{
  bgUrl?: string
  overlayOpacity?: number
}>()
</script>

<template>
  <section
    class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
  >
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      :style="bgUrl ? `background-image: url('${bgUrl}')` : 'background-color: #c9a97a'"
    />
    <!-- Overlay -->
    <div
      class="absolute inset-0 bg-charcoal"
      :style="`opacity: ${overlayOpacity ?? 0.45}`"
    />
    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center justify-center w-full h-full px-6">
      <slot />
    </div>
    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
      <svg class="w-6 h-6 text-cream opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>
</template>
