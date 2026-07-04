import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './style.css'
import { loadWeddingConfig } from './composables/useWeddingConfig'

loadWeddingConfig().then(() => {
  createApp(App).use(router).mount('#app')
})
