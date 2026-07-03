<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  center?: boolean
}>()
</script>

<template>
  <div :class="center ? 'text-center' : ''">
    <h2 class="font-display text-4xl md:text-5xl font-light text-charcoal tracking-wide leading-tight">
      {{ title }}
    </h2>
    <div
      class="mt-3 mx-auto h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      :class="center ? 'w-32' : 'w-24'"
    />
    <p v-if="subtitle" class="mt-4 font-sans text-sm text-wood-500 tracking-widest uppercase">
      {{ subtitle }}
    </p>
  </div>
</template>
