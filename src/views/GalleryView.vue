<script setup lang="ts">
import WdSectionTitle from '@/components/WdSectionTitle.vue'
import WdGalleryGrid from '@/components/WdGalleryGrid.vue'
</script>

<template>
  <div class="pt-16">
    <section class="section-wrapper">
      <WdSectionTitle title="婚紗相簿" subtitle="Photo Gallery" center />
      <p class="mt-4 text-center font-swei text-sm text-wood-400 tracking-wide">相片即將上線，敬請期待。</p>
      <div class="mt-10">
        <WdGalleryGrid :images="[]" />
      </div>
    </section>
  </div>
</template>
