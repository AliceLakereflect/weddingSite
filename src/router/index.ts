import { createRouter, createWebHashHistory } from 'vue-router'
import { features } from '@/config/features'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: HomeView },
    ...(features.ourStory
      ? [{ path: '/story', component: () => import('@/views/OurStoryView.vue') }]
      : []),
    ...(features.gallery
      ? [{ path: '/gallery', component: () => import('@/views/GalleryView.vue') }]
      : []),
    ...(features.rsvp
      ? [{ path: '/rsvp', component: () => import('@/views/RsvpView.vue') }]
      : []),
    { path: '/thankyou', component: () => import('@/views/ThankYouView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
