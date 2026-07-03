<script setup lang="ts">
defineProps<{
  images?: { src: string; alt: string }[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
    <template v-if="images && images.length > 0">
      <div
        v-for="(img, i) in images"
        :key="i"
        class="relative aspect-square overflow-hidden group cursor-pointer"
      >
        <img
          :src="img.src"
          :alt="img.alt"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-charcoal opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </div>
    </template>
    <!-- Placeholder grid when no images -->
    <template v-else>
      <div
        v-for="i in 12"
        :key="i"
        class="aspect-square bg-wood-100 flex items-center justify-center"
      >
        <span class="text-wood-300 text-3xl select-none">✦</span>
      </div>
    </template>
  </div>
</template>
