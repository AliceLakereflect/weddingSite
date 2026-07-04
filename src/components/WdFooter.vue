<script setup lang="ts">
import { useWeddingConfig } from '@/composables/useWeddingConfig'
const config = useWeddingConfig()
</script>

<template>
  <footer class="bg-wood-900 text-cream/80 py-12 mt-0">
    <div class="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4 text-center">
      <p class="font-display text-3xl text-cream tracking-wide">
        林昇暉 <span class="text-gold mx-2">&</span> 李淑因
      </p>
      <p class="font-sans text-sm tracking-widest text-cream/60 whitespace-pre-line">
        {{ config?.footerText }}
      </p>
      <div class="h-px w-16 bg-gold/40 my-1" />
      <p class="font-sans text-xs text-cream/40">
        {{ config?.copyright }}
      </p>
    </div>
  </footer>
</template>
