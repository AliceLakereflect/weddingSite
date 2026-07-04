<script setup lang="ts">
import WdHero from '@/components/WdHero.vue'
import WdDivider from '@/components/WdDivider.vue'
import WdSectionTitle from '@/components/WdSectionTitle.vue'
import WdInfoItem from '@/components/WdInfoItem.vue'
import WdButton from '@/components/WdButton.vue'
import WdCountdown from '@/components/WdCountdown.vue'
</script>

<template>
  <!-- Hero -->
  <WdHero bg-url="./hero.jpg" :overlay-opacity="0.45">
    <div class="flex flex-col items-center gap-6 text-cream text-center">
      <p class="font-sans text-xs tracking-[0.4em] uppercase text-cream/70">We Invite You to Celebrate</p>
      <h1 class="font-display text-6xl md:text-8xl font-light tracking-wider leading-none">
        Nathan
        <span class="block text-champagne text-4xl md:text-5xl my-2">&amp;</span>
        Alice
      </h1>
      <p class="font-sans text-sm tracking-[0.3em] text-cream/80 uppercase mt-2">
        民國一一五年十月十日
      </p>
      <WdDivider ornament />
      <p class="font-serif text-base text-cream/70">牛耳藝術渡假村 · 南投縣埔里鎮</p>
      <WdCountdown />
    </div>
  </WdHero>

  <!-- Wedding Info Section -->
  <section id="wedding-info" class="section-wrapper">
    <WdSectionTitle title="婚禮資訊" subtitle="Wedding Details" center />

    <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-0 border border-wood-100 divide-x divide-wood-100">
      <WdInfoItem label="日期" value="民國115年10月10日（六）農曆丙午年九月初一">
        <template #icon>
          <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </template>
      </WdInfoItem>
      <WdInfoItem label="時間" value="12:00 入席 12:30 準時開席">
        <template #icon>
          <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </template>
      </WdInfoItem>
      <WdInfoItem label="地點" value="牛耳藝術渡假村">
        <template #icon>
          <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </template>
      </WdInfoItem>
      <WdInfoItem label="交通" value="國道六號 → 愛蘭交流道下約5分鐘，備有免費停車場">
        <template #icon>
          <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1m8-1h2m-2 0l-1-5H5l-1 5m9 0H6" />
          </svg>
        </template>
      </WdInfoItem>
    </div>

    <!-- Timing Banner -->
    <div class="mt-8 bg-wood-50 border border-wood-200 rounded-none px-8 py-5 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-center">
      <div class="flex items-center gap-3">
        <span class="text-gold text-lg">✦</span>
        <span class="font-sans text-sm tracking-widest text-wood-600">12:00 入席</span>
      </div>
      <div class="hidden md:block h-6 w-px bg-wood-200" />
      <div class="flex items-center gap-3">
        <span class="text-gold text-lg">✦</span>
        <span class="font-sans text-sm tracking-widest text-wood-600">12:30 準時開席</span>
      </div>
    </div>

    <!-- Google Maps CTA -->
    <div class="mt-10 flex flex-col items-center gap-3">
      <p class="font-sans text-xs text-wood-400 tracking-wider">545 南投縣埔里鎮中山路四段1號</p>
      <WdButton
        as="a"
        href="https://maps.google.com/?q=牛耳藝術渡假村"
        target="_blank"
        variant="outline"
        size="md"
      >
        在 Google 地圖上查看地點
      </WdButton>
    </div>
  </section>

  <WdDivider ornament />

  <!-- Parents section -->
  <section class="section-wrapper pt-0">
    <WdSectionTitle title="婚宴主人" subtitle="Hosted By" center />
    <div class="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20 text-center">
      <div>
        <p class="font-sans text-xs text-wood-400 tracking-widest uppercase mb-2">新郎</p>
        <p class="font-display text-3xl text-charcoal">林昇暉</p>
      </div>
      <div class="text-gold text-2xl font-display">&amp;</div>
      <div>
        <p class="font-sans text-xs text-wood-400 tracking-widest uppercase mb-2">新娘</p>
        <p class="font-display text-3xl text-charcoal">李淑因</p>
        <p class="font-sans text-xs text-wood-400 mt-1">李進益先生 · 劉少芬女士 之令千金</p>
      </div>
    </div>
  </section>
</template>
