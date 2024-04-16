import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'virtual:windi.css'
import './styles/main.css'
import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)

import { createPinia } from 'pinia'
app.use(createPinia())

app.use(Notifications)
app.use(router)
app.mount('#app')
