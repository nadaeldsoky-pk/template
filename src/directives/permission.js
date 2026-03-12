// v-permission directive - allows all actions in dev/fake mode
const permissionDirective = {
  mounted(el, binding) {
    // In fake/dev mode, all permissions are granted - do nothing (show element)
  },
  updated(el, binding) {
    // Same - allow everything
  },
}

export default {
  install(app) {
    app.directive('permission', permissionDirective)
  },
}
