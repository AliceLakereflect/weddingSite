<script setup lang="ts">
defineProps<{
  formId: string
  transparent?: boolean
}>()
</script>

<template>
  <div class="relative w-full min-h-96">
    <iframe
      :src="`https://tally.so/embed/${formId}?${transparent !== false ? 'transparentBackground=1&' : ''}dynamicHeight=1`"
      loading="lazy"
      width="100%"
      height="600"
      frameborder="0"
      marginheight="0"
      marginwidth="0"
      title="RSVP 表單"
      class="w-full border-none"
      style="min-height: 600px;"
    />
  </div>
</template>
