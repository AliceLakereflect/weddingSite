<script setup lang="ts">
import WdSectionTitle from '@/components/WdSectionTitle.vue'
import WdDivider from '@/components/WdDivider.vue'

const videos = [
  {
    title: '我們的相遇',
    subtitle: 'Where our Story Began',
    url: 'https://youtu.be/pkf-Sa96mYE',
  },
  {
    title: '滿滿的祝福',
    subtitle: 'Filled with love and blessings',
    url: 'https://youtu.be/zYdciBLzNkc',
  },
]

function getEmbedUrl(rawUrl: string) {
  if (!rawUrl) return ''

  const match = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)

  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}?rel=0`
  }

  return rawUrl
}
</script>

<template>
  <div class="pt-16">
    <section class="section-wrapper">
      <WdSectionTitle title="我們的故事" subtitle="Our Story" center />

      <div class="mt-20">
        <div class="mb-8 text-center">
          <p class="font-swei text-xs text-gold tracking-[0.28em] uppercase">Memory Clip</p>
        </div>

        <div class="grid gap-8 md:grid-cols-2">
          <div v-for="(video, index) in videos" :key="video.title" class="space-y-4">
            <div class="text-center">
              <h3 class="font-display text-2xl text-charcoal">{{ video.title }}</h3>
              <p class="mt-2 font-swei text-[11px] text-wood-500 tracking-[0.2em] uppercase">{{ video.subtitle }}</p>
            </div>

            <div
              v-if="getEmbedUrl(video.url)"
              class="overflow-hidden rounded-2xl border border-wood-100 bg-wood-50 shadow-[0_20px_45px_rgba(88,68,52,0.08)]"
            >
              <iframe
                class="aspect-video w-full"
                :src="getEmbedUrl(video.url)"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              />
            </div>

            <div
              v-else
              class="aspect-video rounded-2xl border border-dashed border-wood-200 bg-wood-50 flex items-center justify-center text-center px-6"
            >
              <div>
                <p class="font-swei text-sm text-wood-500 tracking-[0.2em] uppercase">Video coming soon</p>
                <p class="mt-3 font-serif text-sm text-wood-600">
                  請把第 {{ index + 1 }} 個 YouTube 連結貼進去，頁面就會自動嵌入。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WdDivider ornament />
    </section>
  </div>
</template>

