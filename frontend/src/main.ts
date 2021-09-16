import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'virtual:windi.css'
import './styles/main.css'
import { VueDapp } from 'vue-dapp'
import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)

app.use(VueDapp, {
  infuraId: import.meta.env.VITE_INFURA_API_KEY,
})

app.use(Notifications)
app.use(router)
app.mount('#app')
