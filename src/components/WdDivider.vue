<script setup lang="ts">
defineProps<{
  ornament?: boolean
}>()
</script>

<template>
  <div class="flex items-center gap-4 my-8">
    <span class="flex-1 h-px bg-wood-200" />
    <span v-if="ornament" class="text-champagne text-lg select-none">✦</span>
    <span class="flex-1 h-px bg-wood-200" />
  </div>
</template>
