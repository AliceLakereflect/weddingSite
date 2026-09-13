export const features = {
  ourStory: true,    // 我們的故事
  gallery: true,     // 婚紗照
  weddingDayGallery: true, // 婚宴花絮
  rsvp: true,        // RSVP 表單
} as const

export type FeatureKey = keyof typeof features
