<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 2026-10-10 12:00:00 UTC+8 = 2026-10-10T04:00:00Z
const TARGET = new Date('2026-10-10T04:00:00Z').getTime()

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => clearInterval(timer))

const remaining = computed(() => Math.max(0, TARGET - now.value))
const done = computed(() => remaining.value === 0)

const days = computed(() => Math.floor(remaining.value / 86_400_000))
const hours = computed(() => Math.floor((remaining.value % 86_400_000) / 3_600_000))
const minutes = computed(() => Math.floor((remaining.value % 3_600_000) / 60_000))
const seconds = computed(() => Math.floor((remaining.value % 60_000) / 1_000))

function pad(n: number) { return String(n).padStart(2, '0') }

const units = computed(() => [
  { value: days.value,    label: '天',  labelEn: 'DAYS' },
  { value: hours.value,   label: '小時', labelEn: 'HRS'  },
  { value: minutes.value, label: '分鐘', labelEn: 'MIN'  },
  { value: seconds.value, label: '秒',  labelEn: 'SEC'  },
])
</script>

<template>
  <div v-if="done" class="mt-6 text-center">
    <p class="font-display text-2xl text-gold tracking-widest animate-pulse">今天是我們最幸福的日子 ✦</p>
  </div>

  <div v-else class="mt-6 flex items-start justify-center gap-3 md:gap-6 select-none">
    <template v-for="(unit, i) in units" :key="unit.labelEn">
      <!-- Unit block -->
      <div class="flex flex-col items-center gap-1">
        <!-- Number -->
        <div
          class="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center
                 border border-cream/25 bg-charcoal/30 backdrop-blur-sm overflow-hidden"
        >
          <!-- Subtle top sheen -->
          <div class="absolute inset-x-0 top-0 h-1/2 bg-white/5 pointer-events-none" />
          <span class="font-display text-3xl md:text-4xl font-light text-cream tabular-nums leading-none">
            {{ pad(unit.value) }}
          </span>
        </div>
        <!-- Label -->
        <span class="font-sans text-[10px] tracking-widest text-cream/60 uppercase">
          {{ unit.labelEn }}
        </span>
      </div>

      <!-- Colon separator (not after last) -->
      <span
        v-if="i < units.length - 1"
        class="font-display text-2xl text-cream/40 mt-3 leading-none animate-pulse"
      >:</span>
    </template>
  </div>
</template>
