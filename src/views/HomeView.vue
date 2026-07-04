<script setup lang="ts">
import WdHero from '@/components/WdHero.vue'
import WdDivider from '@/components/WdDivider.vue'
import WdSectionTitle from '@/components/WdSectionTitle.vue'
import WdInfoItem from '@/components/WdInfoItem.vue'
import WdButton from '@/components/WdButton.vue'
import WdCountdown from '@/components/WdCountdown.vue'
import { useWeddingConfig } from '@/composables/useWeddingConfig'

const config = useWeddingConfig()
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
        {{ config?.dateZh }}
      </p>
      <WdDivider ornament />
      <p class="font-serif text-base text-cream/70">{{ config?.venue }} · {{ config?.city }}</p>
      <WdCountdown />
    </div>
  </WdHero>

  <!-- RSVP CTA -->
  <section class="section-wrapper">
    <div class="max-w-xl mx-auto px-6 flex flex-col items-center gap-6">
      <p class="font-display text-xl text-charcoal font-light">期待您的蒞臨</p>
      <div class="h-px w-12 bg-gold/50" />
      <p class="font-sans text-sm text-wood-400 tracking-wide leading-relaxed">
        請於婚禮前填寫出席回覆，讓我們為您做好準備
      </p>
      <RouterLink to="/rsvp">
        <WdButton variant="primary" size="lg" class="!px-16 !py-5 !text-base mt-2">
          線上回覆出席 &nbsp;RSVP
        </WdButton>
      </RouterLink>
    </div>
  </section>
  
  <WdDivider ornament />

  <!-- Parents section -->
  <section class="section-wrapper">
    <WdSectionTitle title="婚宴主人" subtitle="Hosted By" center />
    <div class="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-20 text-center">
      <div class="md:ml-20">
        <p class="font-sans text-xs text-wood-400 tracking-widest uppercase mb-2">新郎</p>
        <p class="font-display text-3xl text-charcoal">林昇暉</p>
      </div>
      <div class="text-gold text-2xl font-display">&amp;</div>
      <div>
        <p class="font-sans text-xs text-wood-400 tracking-widest uppercase mb-2">新娘</p>
        <p class="font-display text-3xl text-charcoal">李淑因</p>
        <p class="font-sans text-xs text-wood-400 mt-1">李進益先生 · 劉少芬女士 之次女</p>
      </div>
    </div>
  </section>

  <WdDivider ornament />

  <!-- Wedding Info Section -->
  <section id="wedding-info" class="section-wrapper">
    <WdSectionTitle title="婚禮資訊" subtitle="Wedding Details" center />

    <div class="mt-12 grid grid-cols-2 gap-0 border border-wood-100 divide-x divide-wood-100">
      <WdInfoItem label="日期">
        <template #icon>
          <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </template>
        <span class="block">{{ config?.dateGregorian }}</span>
        <span class="block text-sm text-wood-400 mt-0.5">{{ config?.dateLunar }}</span>
      </WdInfoItem>
      <WdInfoItem label="地點" :value="config?.venue ?? ''">
        <template #icon>
          <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </template>
      </WdInfoItem>
    </div>

    <!-- Timing Banner -->
    <div class="mt-8 bg-wood-50 border border-wood-200 rounded-none px-8 py-5 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-center">
      <div class="flex items-center gap-3 md:ml-8">
        <span class="text-gold text-lg">✦</span>
        <span class="font-sans text-sm tracking-widest text-wood-600">{{ config?.checkinTime }} 入席</span>
      </div>
      <div class="hidden md:block h-6 w-px bg-wood-200" />
      <div class="flex items-center gap-3">
        <span class="text-gold text-lg">✦</span>
        <span class="font-sans text-sm tracking-widest text-wood-600">{{ config?.startTime }} 準時開席</span>
      </div>
    </div>

    <!-- Google Maps CTA -->
    <div class="mt-10 flex flex-col items-center gap-3">
      <p class="font-sans text-xs text-wood-400 tracking-wider">{{ config?.address }}</p>
      <WdButton
        as="a"
        :href="config?.mapsUrl"
        target="_blank"
        variant="outline"
        size="md"
      >
        在 Google 地圖上查看地點
      </WdButton>
    </div>

    <!-- Transportation Details -->
    <div v-if="config?.transportation?.length" class="mt-8 border border-wood-100">
      <div class="flex items-center gap-3 px-6 py-4 border-b border-wood-100">
        <svg class="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 1m8-1h2m-2 0l-1-5H5l-1 5m9 0H6" />
        </svg>
        <span class="font-sans text-xs text-wood-400 tracking-widest uppercase">交通資訊</span>
      </div>
      <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-wood-100">
        <div v-for="item in config.transportation" :key="item.title" class="px-6 py-5">
          <p class="font-sans text-xs text-gold tracking-wider mb-2">{{ item.title }}</p>
          <p class="font-serif text-sm text-charcoal/80 leading-relaxed">{{ item.detail }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
