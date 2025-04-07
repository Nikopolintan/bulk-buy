// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {},
        variables: {},
      },
    },
  },
  defaults: {
    global: {
      style: {
        fontFamily: 'Poppins, sans-serif',
      },
    },
  },
})



app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
