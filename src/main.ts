import {createApp} from 'vue'
import '@/assets/styles/style.css'
import App from './App.vue'
import router from "@/router";
import definePlugins from "@/plugins";
const app = createApp(App)

app.use(router)
definePlugins(app)
app.mount('#app')
