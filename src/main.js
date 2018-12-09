// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import '@/styles/reset.scss'
import '@/styles/icon.css'
import App from './App'
import router from './router'
import store from './store'
import './permission'
/* import { filters } from './filters/filters' */

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

/* for (let f of filters) {
  if (filters.hasOwnProperty(f)) {
    Vue.filter(f, filters[f])
  }
} */

// 是否有权限全局指令
Vue.directive('permission', {
  inserted: function (el, binding) {
    let { myPermissions = [] } = store.getters
    if (myPermissions.indexOf(binding.value) === -1) {
      el.parentNode.removeChild(el)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
