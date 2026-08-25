<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import WdSectionTitle from '@/components/WdSectionTitle.vue'
import WdGalleryGrid from '@/components/WdGalleryGrid.vue'
import { hasSupabaseConfig, supabase } from '@/lib/supabase'

interface GalleryImage {
  src: string
  alt: string
  uploadedAt: number
}

const MAX_FILE_SIZE = 5
const BUCKET_NAME = 'wedding-day-gallery'

const uploadedImages = ref<GalleryImage[]>([])
const uploadError = ref('')
const uploadSuccess = ref('')
const isUploading = ref(false)
const isLoading = ref(false)

const canUpload = computed(() => hasSupabaseConfig)

const images = computed(() =>
  uploadedImages.value
    .slice()
    .sort((a, b) => b.uploadedAt - a.uploadedAt)
    .map(({ src, alt }) => ({ src, alt })),
)

function parseCreatedAt(value: string | null) {
  if (!value) {
    return 0
  }

  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

async function loadGalleryImages() {
  uploadError.value = ''

  if (!supabase) {
    uploadedImages.value = []
    return
  }

  const client = supabase

  isLoading.value = true
  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .list('', {
      limit: 200,
      sortBy: { column: 'name', order: 'desc' },
    })

  isLoading.value = false

  if (error) {
    uploadError.value = '讀取相簿失敗，請確認 Supabase bucket 與權限設定。'
    uploadedImages.value = []
    return
  }

  uploadedImages.value = data
    .filter((item) => !item.name.endsWith('/'))
    .map((item) => {
      const { data: publicUrlData } = client.storage.from(BUCKET_NAME).getPublicUrl(item.name)

      return {
        src: publicUrlData.publicUrl,
        alt: fileNameToAlt(item.name),
        uploadedAt: parseCreatedAt(item.created_at),
      }
    })
}

function fileNameToAlt(name: string) {
  return name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')
}

async function uploadSingleFile(file: File) {
  if (!supabase) {
    throw new Error('尚未設定 Supabase 環境變數。')
  }

  if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
    throw new Error(`檔案 ${file.name} 超過 ${MAX_FILE_SIZE}MB，請先壓縮後再上傳。`)
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const safeBaseName = fileNameToAlt(file.name).replace(/[^a-zA-Z0-9 _-]/g, '').trim().replace(/\s+/g, '-') || 'photo'
  const objectName = `${Date.now()}-${crypto.randomUUID()}.${ext.toLowerCase()}`
  const filePath = `${safeBaseName}-${objectName}`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  })

  if (error) {
    throw new Error('上傳失敗，請確認 Supabase bucket 與上傳權限設定。')
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  uploadedImages.value.unshift({
    src: publicUrlData.publicUrl,
    alt: fileNameToAlt(file.name),
    uploadedAt: Date.now(),
  })
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])

  uploadError.value = ''
  uploadSuccess.value = ''

  if (files.length === 0) {
    return
  }

  if (!canUpload.value) {
    uploadError.value = '尚未設定 Supabase 環境變數，暫時無法上傳。'
    input.value = ''
    return
  }

  isUploading.value = true

  try {
    for (const file of files) {
      await uploadSingleFile(file)
    }
    uploadSuccess.value = `成功上傳 ${files.length} 張照片。`
    await loadGalleryImages()
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : '上傳失敗，請稍後再試。'
  } finally {
    isUploading.value = false
    input.value = ''
  }
}

onMounted(() => {
  loadGalleryImages()
})
</script>

<template>
  <div class="pt-16">
    <section class="section-wrapper">
      <WdSectionTitle title="婚宴相簿" subtitle="Wedding Day Gallery" center />

      <div class="mt-8 border border-wood-100 bg-wood-50 p-5 md:p-7">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p class="font-sans text-charcoal text-lg">上傳婚宴當天照片</p>
            <p class="mt-1 font-swei text-sm text-wood-500 tracking-wide">
              可一次選多張，單張上限 {{ MAX_FILE_SIZE }}MB。
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center border border-wood-300 px-4 py-2 text-sm font-sans text-wood-600 hover:bg-wood-100 transition-colors"
            :disabled="isLoading"
            @click="loadGalleryImages"
          >
            {{ isLoading ? '讀取中...' : '重新整理相簿' }}
          </button>
        </div>

        <label
          class="mt-5 inline-flex items-center justify-center px-5 py-3 bg-gold text-cream font-sans text-sm tracking-widest cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
          :class="isUploading || !canUpload ? 'pointer-events-none opacity-50' : ''"
        >
          {{ isUploading ? '上傳中...' : '選擇照片並上傳' }}
          <input
            class="hidden"
            type="file"
            accept="image/*"
            multiple
            :disabled="isUploading || !canUpload"
            @change="handleFileChange"
          />
        </label>

        <p v-if="!canUpload" class="mt-3 text-sm text-red-600">
          尚未設定 Supabase 環境變數，請先設定後再上傳。
        </p>
        <p v-if="uploadError" class="mt-3 text-sm text-red-600">{{ uploadError }}</p>
        <p v-if="uploadSuccess" class="mt-3 text-sm text-emerald-700">{{ uploadSuccess }}</p>
      </div>

      <div class="mt-10">
        <WdGalleryGrid :images="images" />
      </div>
    </section>
  </div>
</template>
