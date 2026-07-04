<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  formId: string
  transparent?: boolean
  alignLeft?: boolean
  hideTitle?: boolean
}>()

const emit = defineEmits<{ submitted: [] }>()

function onMessage(e: MessageEvent) {
  if (!e.data) return
  // Tally sends either { type: 'tally-form-submitted' } or { isTally: true, type: 'form-submit' }
  const isSubmit =
    e.data.type === 'tally-form-submitted' ||
    (e.data.isTally === true && e.data.type === 'form-submit')
  if (isSubmit) emit('submitted')
}

onMounted(() => {
  if (!document.querySelector('script[src="https://tally.so/widgets/embed.js"]')) {
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.async = true
    document.head.appendChild(script)
  }
  window.addEventListener('message', onMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', onMessage)
})
</script>

<template>
  <div class="w-full">
    <iframe
      :src="`https://tally.so/embed/${formId}?${alignLeft ? 'alignLeft=1&' : ''}${hideTitle ? 'hideTitle=1&' : ''}${transparent !== false ? 'transparentBackground=1&' : ''}dynamicHeight=1`"
      loading="lazy"
      width="100%"
      height="500"
      frameborder="0"
      marginheight="0"
      marginwidth="0"
      title="RSVP 表單"
      class="w-full border-none"
    />
  </div>
</template>
