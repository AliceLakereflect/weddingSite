<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import WdSectionTitle from '@/components/WdSectionTitle.vue'
import WdGalleryGrid from '@/components/WdGalleryGrid.vue'
import { features } from '@/config/features'
import { hasSupabaseConfig, supabase } from '@/lib/supabase'

const MANUAL_CATEGORIES = ['文定儀式', '迎娶儀式', '牛耳宴客', '合照', '路德威場', '其他'] as const

type PhotoCategory = (typeof MANUAL_CATEGORIES)[number]
type CategoryFilter = PhotoCategory | '全部'

interface GalleryImage {
  id: string
  storagePath: string
  src: string
  alt: string
  uploadedAt: number
  category: PhotoCategory
}

const MAX_FILE_SIZE = 25
const BUCKET_NAME = 'wedding-day-gallery'
const PAGE_SIZE = 20

const uploadedImages = ref<GalleryImage[]>([])
const uploadError = ref('')
const uploadSuccess = ref('')
const isUploading = ref(false)
const isLoading = ref(false)
const currentPage = ref(1)
const selectedCategory = ref<CategoryFilter>('全部')
const categoryUpdatingPaths = ref<Set<string>>(new Set())

const canUpload = computed(() => hasSupabaseConfig)
const canEditPhotoCategory = computed(() => features.weddingDayGalleryCategoryEdit)
const categoryUpdatingPathList = computed(() => Array.from(categoryUpdatingPaths.value))
const photoCategoryOptions = [...MANUAL_CATEGORIES]

function setCategoryUpdatingState(storagePath: string, isUpdating: boolean) {
  const next = new Set(categoryUpdatingPaths.value)

  if (isUpdating) {
    next.add(storagePath)
  } else {
    next.delete(storagePath)
  }

  categoryUpdatingPaths.value = next
}

function normalizePhotoCategory(value: string | null | undefined): PhotoCategory {
  return MANUAL_CATEGORIES.includes(value as PhotoCategory) ? (value as PhotoCategory) : '其他'
}

const images = computed(() =>
  uploadedImages.value
    .slice()
    .sort((a, b) => b.uploadedAt - a.uploadedAt)
    .map(({ id, storagePath, src, alt, category }) => ({ id, storagePath, src, alt, category })),
)

const filteredImages = computed(() => {
  if (selectedCategory.value === '全部') {
    return images.value
  }

  return images.value.filter((image) => image.category === selectedCategory.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredImages.value.length / PAGE_SIZE)))

const visibleImages = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredImages.value.slice(start, start + PAGE_SIZE).map(({ id, storagePath, src, alt, category }) => ({
    id,
    storagePath,
    src,
    alt,
    category,
  }))
})

function parseCreatedAt(value: string | null) {
  if (!value) {
    return 0
  }

  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

function isDisplayableImageObject(name: string) {
  if (!name || name.endsWith('/')) {
    return false
  }

  if (name.startsWith('.')) {
    return false
  }

  return /\.(avif|bmp|gif|heic|heif|jpe?g|png|svg|webp)$/i.test(name)
}

function fileNameToAlt(name: string) {
  return name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')
}

function sortByUploadTimeDesc(a: number, b: number) {
  return b - a
}

function goToPage(page: number) {
  if (page < 1) {
    currentPage.value = 1
    return
  }

  if (page > totalPages.value) {
    currentPage.value = totalPages.value
    return
  }

  currentPage.value = page
}

function selectCategory(category: CategoryFilter) {
  selectedCategory.value = category
  currentPage.value = 1
}

async function refreshSinglePhotoCategory(storagePath: string) {
  if (!supabase) {
    return
  }

  const { data, error } = await supabase
    .from('gallery_photos')
    .select('storage_path, category')
    .eq('storage_path', storagePath)
    .maybeSingle()

  if (error || !data) {
    return
  }

  const nextCategory = normalizePhotoCategory(data.category)
  uploadedImages.value = uploadedImages.value.map((item) =>
    item.storagePath === storagePath
      ? { ...item, category: nextCategory }
      : item,
  )
}

async function savePhotoCategory(storagePath: string, category: PhotoCategory) {
  if (!supabase || !canEditPhotoCategory.value) {
    return
  }

  setCategoryUpdatingState(storagePath, true)

  try {
    const image = uploadedImages.value.find((item) => item.storagePath === storagePath)
    const uploadedAt = image ? new Date(image.uploadedAt).toISOString() : new Date().toISOString()

    const { data: existingPhoto, error: lookupError } = await supabase
      .from('gallery_photos')
      .select('id, storage_path')
      .eq('storage_path', storagePath)
      .maybeSingle()

    if (lookupError) {
      uploadError.value = '照片分類更新失敗，請確認資料庫表格與權限設定。'
      return
    }

    const payload = {
      storage_path: storagePath,
      public_url: image?.src ?? '',
      uploaded_at: uploadedAt,
      category,
    }

    const { error } = existingPhoto
      ? await supabase
          .from('gallery_photos')
          .update(payload)
          .eq('storage_path', storagePath)
      : await supabase.from('gallery_photos').insert({
          id: storagePath,
          ...payload,
        })

    if (error) {
      uploadError.value = '照片分類更新失敗，請確認資料庫欄位已建立。'
      return
    }

    await refreshSinglePhotoCategory(storagePath)
  } finally {
    setCategoryUpdatingState(storagePath, false)
  }
}

async function syncPhotoCategories() {
  if (!supabase || uploadedImages.value.length === 0) {
    return
  }

  const { data, error } = await supabase
    .from('gallery_photos')
    .select('storage_path, category')
    .order('uploaded_at', { ascending: false })

  if (error || !data) {
    return
  }

  const categoryMap = new Map<string, PhotoCategory>()
  for (const row of data as Array<{ storage_path: string; category: string | null }>) {
    if (!row.storage_path) {
      continue
    }

    categoryMap.set(row.storage_path, normalizePhotoCategory(row.category))
  }

  uploadedImages.value = uploadedImages.value.map((image) => {
    const persistedCategory = categoryMap.get(image.storagePath)
    return persistedCategory ? { ...image, category: persistedCategory } : image
  })
}

async function loadGalleryImages() {
  uploadError.value = ''

  if (!supabase) {
    uploadedImages.value = []
    currentPage.value = 1
    return
  }

  const client = supabase
  isLoading.value = true

  try {
    const accumulated: Array<{ name: string; created_at: string | null }> = []
    let offset = 0

    while (true) {
      const { data, error } = await client.storage.from(BUCKET_NAME).list('', {
        limit: PAGE_SIZE,
        offset,
        sortBy: { column: 'created_at', order: 'desc' },
      })

      if (error) {
        throw error
      }

      if (!data || data.length === 0) {
        break
      }

      accumulated.push(...data)

      if (data.length < PAGE_SIZE) {
        break
      }

      offset += PAGE_SIZE
    }

    uploadedImages.value = accumulated
      .filter((item) => isDisplayableImageObject(item.name))
      .map((item) => {
        const { data: publicUrlData } = client.storage.from(BUCKET_NAME).getPublicUrl(item.name)

        return {
          id: item.name,
          storagePath: item.name,
          src: publicUrlData.publicUrl,
          alt: fileNameToAlt(item.name),
          uploadedAt: parseCreatedAt(item.created_at),
          category: '其他',
        }
      })
      .sort((a, b) => sortByUploadTimeDesc(a.uploadedAt, b.uploadedAt))

    await syncPhotoCategories()

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  } catch (error) {
    uploadError.value = '讀取相簿失敗，請確認 Supabase bucket 與權限設定。'
    uploadedImages.value = []
    currentPage.value = 1
  } finally {
    isLoading.value = false
  }
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

  const { data: existingUploadedPhoto, error: existingLookupError } = await supabase
    .from('gallery_photos')
    .select('id')
    .eq('storage_path', filePath)
    .maybeSingle()

  if (existingLookupError) {
    throw new Error('上傳後寫入資料庫時發生查詢錯誤，請稍後再試。')
  }

  const uploadPayload = {
    storage_path: filePath,
    public_url: publicUrlData.publicUrl,
    uploaded_at: new Date().toISOString(),
    category: '其他',
  }

  if (existingUploadedPhoto) {
    const { error } = await supabase
      .from('gallery_photos')
      .update(uploadPayload)
      .eq('storage_path', filePath)

    if (error) {
      throw new Error('上傳後更新資料庫紀錄失敗，請稍後再試。')
    }
  } else {
    const { error } = await supabase.from('gallery_photos').insert({
      id: filePath,
      ...uploadPayload,
    })

    if (error) {
      throw new Error('上傳後新增資料庫紀錄失敗，請稍後再試。')
    }
  }

  uploadedImages.value.unshift({
    id: filePath,
    storagePath: filePath,
    src: publicUrlData.publicUrl,
    alt: fileNameToAlt(file.name),
    uploadedAt: Date.now(),
    category: '其他',
  })
}

function handleCategoryChange(payload: { id?: string; storagePath?: string; category: string }) {
  if (!canEditPhotoCategory.value) {
    return
  }

  const storagePath = payload.storagePath || payload.id
  if (!storagePath) {
    return
  }

  const safeCategory = normalizePhotoCategory(payload.category)
  void savePhotoCategory(storagePath, safeCategory)
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
      <WdSectionTitle title="婚宴花絮" subtitle="Wedding Day Gallery" center />

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

      <div class="mt-8">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-full border px-4 py-2 text-xs font-swei tracking-[0.18em] transition-colors"
            :class="selectedCategory === '全部' ? 'border-gold bg-gold/10 text-charcoal' : 'border-wood-300 bg-white text-wood-600 hover:border-gold/70'"
            @click="selectCategory('全部')"
          >
            全部
          </button>

          <button
            v-for="category in photoCategoryOptions"
            :key="category"
            type="button"
            class="rounded-full border px-4 py-2 text-xs font-swei tracking-[0.18em] transition-colors"
            :class="selectedCategory === category ? 'border-gold bg-gold/10 text-charcoal' : 'border-wood-300 bg-white text-wood-600 hover:border-gold/70'"
            @click="selectCategory(category)"
          >
            {{ category }}
          </button>
        </div>

        <p class="mt-3 text-xs tracking-[0.18em] text-wood-500">
          {{ filteredImages.length }} 張照片
        </p>
      </div>

      <div class="mt-10">
        <div v-if="filteredImages.length > PAGE_SIZE" class="mb-6 flex items-center justify-center gap-2 text-sm text-wood-600">
          <button
            type="button"
            class="min-w-9 border border-wood-300 px-2 py-1 disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            上一頁
          </button>

          <span class="px-2 font-swei tracking-wide">
            {{ currentPage }} / {{ totalPages }}
          </span>

          <button
            type="button"
            class="min-w-9 border border-wood-300 px-2 py-1 disabled:opacity-40"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            下一頁
          </button>
        </div>

        <WdGalleryGrid
          :images="visibleImages"
          :category-options="photoCategoryOptions"
          :allow-category-edit="canEditPhotoCategory"
          :category-updating-paths="categoryUpdatingPathList"
          @set-category="handleCategoryChange"
        />

        <div v-if="filteredImages.length > PAGE_SIZE" class="mt-6 flex items-center justify-center gap-2 text-sm text-wood-600">
          <button
            type="button"
            class="min-w-9 border border-wood-300 px-2 py-1 disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            上一頁
          </button>

          <span class="px-2 font-swei tracking-wide">
            {{ currentPage }} / {{ totalPages }}
          </span>

          <button
            type="button"
            class="min-w-9 border border-wood-300 px-2 py-1 disabled:opacity-40"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            下一頁
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
