<script setup lang="ts">
defineProps<{
  label: string
  value?: string
  icon?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center text-center gap-2 p-6">
    <div class="w-10 h-10 text-forest-500 flex items-center justify-center">
      <slot name="icon">
        <span class="text-2xl text-gold">{{ icon }}</span>
      </slot>
    </div>
    <p class="font-sans text-xs text-wood-400 tracking-widest uppercase">{{ label }}</p>
    <div class="font-serif text-base text-charcoal leading-snug">
      <slot>{{ value }}</slot>
    </div>
  </div>
</template>
