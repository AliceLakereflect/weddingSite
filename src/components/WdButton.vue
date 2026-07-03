<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  as?: 'button' | 'a'
  href?: string
  target?: string
}>(), {
  variant: 'primary',
  size: 'md',
  as: 'button',
})
</script>

<template>
  <component
    :is="as"
    :href="as === 'a' ? href : undefined"
    :target="as === 'a' ? target : undefined"
    class="inline-flex items-center justify-center font-sans tracking-widest uppercase transition-all duration-200 cursor-pointer"
    :class="[
      variant === 'primary'
        ? 'bg-wood-500 text-cream border border-wood-500 hover:bg-wood-600 hover:border-wood-600'
        : 'bg-transparent text-wood-500 border border-wood-500 hover:bg-wood-50',
      size === 'sm' ? 'px-4 py-2 text-xs' : size === 'lg' ? 'px-8 py-4 text-sm' : 'px-6 py-3 text-xs',
    ]"
  >
    <slot />
  </component>
</template>
