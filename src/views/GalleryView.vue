<script setup lang="ts">
import WdSectionTitle from '@/components/WdSectionTitle.vue'
import WdGalleryGrid from '@/components/WdGalleryGrid.vue'

const galleryFiles = import.meta.glob('../../public/gallery/*.{jpg,jpeg,png,webp,avif,gif,svg}')

const images = Object.keys(galleryFiles)
  .sort((a, b) => a.localeCompare(b))
  .map((filePath) => {
    const fileName = filePath.split('/').pop() ?? ''
    const alt = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')

    return {
      src: `${import.meta.env.BASE_URL}gallery/${fileName}`,
      alt,
    }
  })
</script>

<template>
  <div class="pt-16">
    <section class="section-wrapper">
      <WdSectionTitle title="婚紗相簿" subtitle="Photo Gallery" center />
      <div class="mt-10">
        <WdGalleryGrid :images="images" />
      </div>
    </section>
  </div>
</template>
