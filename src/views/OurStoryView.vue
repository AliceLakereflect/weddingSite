<script setup lang="ts">
import WdSectionTitle from '@/components/WdSectionTitle.vue'
import WdDivider from '@/components/WdDivider.vue'

const timeline = [
  {
    year: '相遇',
    title: '緣起',
    desc: '在最對的時間，遇見了最對的人。兩顆心，因為一個偶然，悄悄地靠近。',
  },
  {
    year: '相知',
    title: '走進彼此',
    desc: '從陌生到熟悉，從朋友到戀人，每一步都走得踏實而溫暖。',
  },
  {
    year: '相守',
    title: '許下承諾',
    desc: '民國115年10月10日，我們在牛耳藝術渡假村，當著所有親友的面，許下一輩子的承諾。',
  },
]
</script>

<template>
  <div class="pt-16">
    <section class="section-wrapper">
      <WdSectionTitle title="我們的故事" subtitle="Our Story" center />

      <div class="mt-16 space-y-16">
        <!-- Timeline item -->
        <div
          v-for="(item, i) in timeline"
          :key="i"
          class="flex flex-col md:flex-row gap-8 items-start"
          :class="i % 2 === 1 ? 'md:flex-row-reverse' : ''"
        >
          <div class="flex-1 flex flex-col items-center md:items-end" :class="i % 2 === 1 ? 'md:items-start' : ''">
            <span class="font-swei text-xs text-gold tracking-widest uppercase mb-2">{{ item.year }}</span>
            <h3 class="font-display text-2xl text-charcoal">{{ item.title }}</h3>
            <p class="mt-3 font-serif text-sm text-wood-600 leading-relaxed max-w-xs" :class="i % 2 === 1 ? 'md:text-left' : 'md:text-right'">
              {{ item.desc }}
            </p>
          </div>
          <div class="hidden md:flex flex-col items-center">
            <div class="w-px flex-1 bg-wood-200" />
            <div class="w-3 h-3 rounded-full border-2 border-gold bg-cream my-2" />
            <div class="w-px flex-1 bg-wood-200" />
          </div>
          <div class="flex-1 bg-wood-50 aspect-video flex items-center justify-center">
            <span class="text-wood-200 text-5xl select-none">✦</span>
          </div>
        </div>
      </div>

      <WdDivider ornament />
    </section>
  </div>
</template>

