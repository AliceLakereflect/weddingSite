export const features = {
  ourStory: false,   // 我們的故事
  gallery: true,    // 婚紗照
  weddingDayGallery: true, // 婚宴相簿
  rsvp: true,       // RSVP 表單
} as const

export type FeatureKey = keyof typeof features
