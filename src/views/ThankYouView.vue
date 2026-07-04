<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeddingConfig } from '@/composables/useWeddingConfig'

const router = useRouter()
const config = useWeddingConfig()
const countdown = ref(60)

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearInterval(timer)
      router.push('/')
    }
  }, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Background image -->
    <img
      src="/thankyou.jpg"
      alt=""
      class="absolute inset-0 w-full h-full object-cover"
    />
    <!-- Subtle dark overlay for text readability -->
    <div class="absolute inset-0 bg-black/15" />

    <!-- Top-left: thankYouMessage -->
    <div class="absolute top-48 left-8 md:top-36 md:left-14 max-w-sm md:max-w-lg ml-16">
      <p
        class="font-display text-cream text-xl md:text-4xl p-4 drop-shadow-md whitespace-pre-line"
        style="text-shadow: 0 1px 6px rgba(0,0,0,0.45)"
      >
        {{ config?.thankYouMessage1 }}
      </p>
      <p
        class="font-display text-cream text-xl md:text-2xl p-4 l drop-shadow-md whitespace-pre-line"
        style="text-shadow: 0 1px 6px rgba(0,0,0,0.45)"
      >
        {{ config?.thankYouMessage2 }}
      </p>
      <p
        class="font-display text-cream text-xl md:text-2xl p-4 drop-shadow-md whitespace-pre-line"
        style="text-shadow: 0 1px 6px rgba(0,0,0,0.45)"
      >
        {{ config?.thankYouMessage3 }}
      </p>
    </div>

    <!-- Bottom-right: thankYouGreeting + countdown -->
    <div class="absolute bottom-10 right-8 md:bottom-14 md:right-14 text-right">
      <p
        class="font-display text-cream text-2xl md:text-5xl drop-shadow-md"
        style="text-shadow: 0 1px 6px rgba(0,0,0,0.45)"
      >
        {{ config?.thankYouGreeting }}
      </p>
      <p class="font-sans text-cream/70 text-xs tracking-widest mt-3 uppercase">
        {{ countdown }} 秒後返回首頁 or <RouterLink to="/" class="underline">立即返回</RouterLink>
      </p>
      <!-- countdown bar -->
      <div class="mt-2 h-px bg-cream/20 w-40 ml-auto overflow-hidden">
        <div
          class="h-full bg-cream/60 transition-all duration-1000 ease-linear"
          :style="{ width: `${(countdown / 60) * 100}%` }"
        />
      </div>
    </div>
  </div>
</template>
