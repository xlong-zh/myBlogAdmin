import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
import './assets/common.scss';

Vue.config.productionTip = false;

import { ToolFunMixin } from '@/mixins/ToolFunMixin.js';
import { postAction, putAction, getAction, deleteAction, httpAction } from '@/api/manage.js';
Vue.prototype.$http = { postAction, putAction, getAction, deleteAction, httpAction };

Vue.mixin(ToolFunMixin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
