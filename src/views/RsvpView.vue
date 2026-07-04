<script setup lang="ts">
import WdSectionTitle from '@/components/WdSectionTitle.vue'
import WdTallyEmbed from '@/components/WdTallyEmbed.vue'
import { useWeddingConfig } from '@/composables/useWeddingConfig'
import { useRouter } from 'vue-router'

const config = useWeddingConfig()
const router = useRouter()

function onFormSubmitted() {
  router.push('/thankyou')
}
</script>

<template>
  <div class="pt-16">
    <section class="section-wrapper">
      <!-- Timing banner -->
      <div class="mb-10 bg-wood-50 border border-wood-200 px-8 py-5 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-center">
        <div class="flex items-center gap-3">
          <span class="text-gold text-lg">✦</span>
          <span class="font-sans text-sm tracking-widest text-wood-600">{{ config?.checkinTime }} 入席</span>
        </div>
        <div class="hidden md:block h-6 w-px bg-wood-200" />
        <div class="flex items-center gap-3">
          <span class="text-gold text-lg">✦</span>
          <span class="font-sans text-sm tracking-widest text-wood-600">{{ config?.startTime }} 準時開席</span>
        </div>
      </div>

      <WdSectionTitle title="出席回覆" subtitle="RSVP" center />
      <p class="mt-4 text-center font-sans text-sm text-wood-400 max-w-md mx-auto leading-relaxed">
        請於 <strong class="text-wood-600">2026年9月10日</strong> 前完成回覆，感謝您！
      </p>

      <div class="mt-10">
        <WdTallyEmbed v-if="config?.tallyFormId" :form-id="config.tallyFormId" :transparent="true" :hide-title="true" :align-left="true" @submitted="onFormSubmitted" />
      </div>
    </section>
  </div>
</template>
