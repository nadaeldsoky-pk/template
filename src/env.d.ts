/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Extend RouteMeta for vue-router
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    layout?: string
    breadcrumbs?: Array<{ text: string; path: string }>
  }
}

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
