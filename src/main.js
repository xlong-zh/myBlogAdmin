import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
import './assets/common.scss';

Vue.config.productionTip = false;

import { http } from './router/request.js';
import { ToolFunMixin } from '@/mixins/ToolFunMixin.js';
import { postAction, putAction, getAction, deleteAction, httpAction } from '@/api/manage.js';
Vue.prototype.$http = http;

// Vue.mixin({
//   computed: {
//     uploadUrl() {
//       return this.$http.defaults.baseURL + '/upload';
//     }
//   },
//   methods: {
//     getAuthHeaders() {
//       return {
//         Authorization: `Bearer ${localStorage.token || ''}`
//       };
//     }
//   }
// });

new Vue({
  router,
  store,
  mixins: [ToolFunMixin],
  render: h => h(App)
}).$mount('#app');
