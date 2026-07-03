export const features = {
  ourStory: false,   // 我們的故事
  gallery: false,    // 婚紗相簿
  rsvp: false,       // RSVP 表單
} as const

export type FeatureKey = keyof typeof features
