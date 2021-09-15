import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'virtual:windi.css'
import './styles/main.css'
import { VueDapp, Config } from 'vue-dapp'

const app = createApp(App)

const dappConfig: Partial<Config> = {
  infuraId: 'ff6a249a74e048f1b413cba715f98d07',
}

// @ts-ignore for yarn link vue-dapp
app.use(VueDapp, dappConfig)

app.use(router)
app.mount('#app')
