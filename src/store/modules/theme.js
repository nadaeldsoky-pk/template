import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const DEFAULT_THEME = 'purple'

export const THEMES = ['blue', 'dark', 'purple', 'green']

export const useThemeStore = defineStore('theme', () => {
  // Priority: Use the DEFAULT_THEME constant for code control.
  // We can still use localStorage if we want persistence, 
  // but for "code control", the constant should win during dev.
  const activeTheme = ref(DEFAULT_THEME)

  function applyTheme(theme) {
    const html = document.documentElement
    // Remove all theme classes
    THEMES.forEach(t => html.classList.remove(`theme-${t}`))
    // Apply the chosen theme
    html.classList.add(`theme-${theme}`)
    // Persist selection
    localStorage.setItem('app-theme', theme)
  }

  function setTheme(theme) {
    if (!THEMES.includes(theme)) {
      console.warn(`[ThemeStore] Unknown theme: "${theme}". Valid options: ${THEMES.join(', ')}`)
      return
    }
    activeTheme.value = theme
  }

  // Auto-apply whenever activeTheme changes
  watch(activeTheme, (theme) => applyTheme(theme), { immediate: true })

  return { activeTheme, setTheme, THEMES }
})
