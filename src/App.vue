<script setup lang="ts">
import { RouterView } from 'vue-router'
import WdNavBar from '@/components/WdNavBar.vue'
import WdFooter from '@/components/WdFooter.vue'
</script>

<template>
  <WdNavBar />
  <main>
    <RouterView />
  </main>
  <WdFooter />
</template>
