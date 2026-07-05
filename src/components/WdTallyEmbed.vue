<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{
  formId: string
  transparent?: boolean
  alignLeft?: boolean
  hideTitle?: boolean
}>()

onMounted(() => {
  if (!document.querySelector('script[src="https://tally.so/widgets/embed.js"]')) {
    const script = document.createElement('script')
    script.src = 'https://tally.so/widgets/embed.js'
    script.async = true
    document.head.appendChild(script)
  }
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
