<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  images?: { src: string; alt: string }[]
}>()

const imageItems = ref<(HTMLElement | null)[]>([])
const visibleIndexes = ref<Set<number>>(new Set())
const selectedIndex = ref<number | null>(null)
const selectedImage = computed(() => {
  if (selectedIndex.value === null || !props.images) {
    return null
  }

  return props.images[selectedIndex.value] ?? null
})
let observer: IntersectionObserver | null = null

function markVisible(index: number) {
  if (visibleIndexes.value.has(index)) {
    return
  }

  const next = new Set(visibleIndexes.value)
  next.add(index)
  visibleIndexes.value = next
}

function setImageItemRef(index: number, el: unknown) {
  imageItems.value[index] = el instanceof HTMLElement ? el : null
}

function observeImages() {
  observer?.disconnect()

  if (!props.images || props.images.length === 0) {
    return
  }

  if (!window.IntersectionObserver) {
    visibleIndexes.value = new Set(props.images.map((_, i) => i))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue
        }

        const rawIndex = (entry.target as HTMLElement).dataset.index
        const index = Number(rawIndex)
        if (Number.isNaN(index)) {
          continue
        }

        markVisible(index)
        observer?.unobserve(entry.target)
      }
    },
    {
      rootMargin: '180px 0px',
      threshold: 0.01,
    },
  )

  imageItems.value.forEach((el) => {
    if (el) {
      observer?.observe(el)
    }
  })
}

function openLightbox(index: number) {
  selectedIndex.value = index
}

function closeLightbox() {
  selectedIndex.value = null
}

function showPrevImage() {
  if (selectedIndex.value === null || !props.images || props.images.length === 0) {
    return
  }

  const length = props.images.length
  selectedIndex.value = (selectedIndex.value - 1 + length) % length
}

function showNextImage() {
  if (selectedIndex.value === null || !props.images || props.images.length === 0) {
    return
  }

  const length = props.images.length
  selectedIndex.value = (selectedIndex.value + 1) % length
}

function handleKeydown(event: KeyboardEvent) {
  if (selectedIndex.value === null) {
    return
  }

  if (event.key === 'Escape') {
    closeLightbox()
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    showPrevImage()
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    showNextImage()
  }
}

watch(
  () => props.images,
  async () => {
    visibleIndexes.value = new Set()
    await nextTick()
    observeImages()
  },
  { immediate: true },
)

watch(
  () => selectedIndex.value,
  (value) => {
    document.body.style.overflow = value === null ? '' : 'hidden'
  },
)

onMounted(() => {
  observeImages()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
    <template v-if="images && images.length > 0">
      <div
        v-for="(img, i) in images"
        :key="i"
        :ref="(el) => setImageItemRef(i, el)"
        :data-index="i"
        class="relative aspect-square overflow-hidden group cursor-pointer"
        role="button"
        tabindex="0"
        @click="openLightbox(i)"
        @keydown.enter.prevent="openLightbox(i)"
        @keydown.space.prevent="openLightbox(i)"
      >
        <img
          v-if="visibleIndexes.has(i)"
          :src="img.src"
          :alt="img.alt"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        />
        <div v-else class="w-full h-full bg-wood-100 animate-pulse" />
        <div class="absolute inset-0 bg-charcoal opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </div>
    </template>
    <!-- Placeholder grid when no images -->
    <template v-else>
      <div
        v-for="i in 12"
        :key="i"
        class="aspect-square bg-wood-100 flex items-center justify-center"
      >
        <span class="text-wood-300 text-3xl select-none">✦</span>
      </div>
    </template>
  </div>

  <Teleport to="body">
    <div
      v-if="selectedImage"
      class="fixed inset-0 z-50 bg-charcoal/90 flex items-center justify-center p-4 md:p-8"
      @click.self="closeLightbox"
    >
      <button
        class="absolute top-4 right-4 md:top-6 md:right-6 text-cream/90 hover:text-cream text-3xl leading-none"
        type="button"
        aria-label="Close image preview"
        @click="closeLightbox"
      >
        ×
      </button>

      <button
        v-if="images && images.length > 1"
        class="absolute left-3 md:left-6 text-cream/90 hover:text-cream bg-charcoal/40 hover:bg-charcoal/60 rounded-full w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-2xl"
        type="button"
        aria-label="Previous image"
        @click.stop="showPrevImage"
      >
        ‹
      </button>

      <img
        :src="selectedImage.src"
        :alt="selectedImage.alt"
        class="max-w-full max-h-[86vh] object-contain shadow-2xl"
        decoding="async"
      />

      <button
        v-if="images && images.length > 1"
        class="absolute right-3 md:right-6 text-cream/90 hover:text-cream bg-charcoal/40 hover:bg-charcoal/60 rounded-full w-11 h-11 md:w-12 md:h-12 flex items-center justify-center text-2xl"
        type="button"
        aria-label="Next image"
        @click.stop="showNextImage"
      >
        ›
      </button>

      <p
        v-if="selectedIndex !== null && images && images.length > 1"
        class="absolute bottom-4 md:bottom-6 text-cream/80 font-swei text-xs tracking-[0.2em]"
      >
        {{ selectedIndex + 1 }} / {{ images.length }}
      </p>
    </div>
  </Teleport>
</template>
