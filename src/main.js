import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Tailwind CSS
import './assets/styles/main.css'

// Modules
import KpiModule from './modules/kpi'

KpiModule.init()

const vuetify = createVuetify({
  components,
  directives,
  rtl: true,
  locale: {
    rtl: {
      ar: true
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#4A6FA5',
          secondary: '#3B5998',
          accent: '#2E4A7C',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
          success: '#10B981',
          background: '#F9FAFB',
          surface: '#FFFFFF',
        },
      },
      dark: {
        colors: {
          primary: '#4A6FA5',
          secondary: '#3B5998',
          accent: '#2E4A7C',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
          success: '#10B981',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none; font-family: Cairo;',
    },
    VTextField: {
      variant: 'outlined',
    },
    VSelect: {
      variant: 'outlined',
    },
    VTextarea: {
      variant: 'outlined',
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(vuetify)

app.mount('#app')
