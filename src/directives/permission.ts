import type { App, DirectiveBinding } from 'vue'

// v-permission directive - allows all actions in dev/fake mode
const permissionDirective = {
  mounted(_el: HTMLElement, _binding: DirectiveBinding): void {
    // In fake/dev mode, all permissions are granted - do nothing (show element)
  },
  updated(_el: HTMLElement, _binding: DirectiveBinding): void {
    // Same - allow everything
  },
}

export default {
  install(app: App): void {
    app.directive('permission', permissionDirective)
  },
}
