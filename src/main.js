import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';
import './assets/common.scss';

import '@src/router/permission.js';

Vue.config.productionTip = false;

import { ToolFunMixin } from '@/mixins/ToolFunMixin.js';
import { hasPermission, dragPermission, focusPermission } from '@/utils/hasPermission';
import { postAction, putAction, getAction, deleteAction, httpAction } from '@/api/manage.js';
Vue.prototype.$http = { postAction, putAction, getAction, deleteAction, httpAction };

Vue.use(hasPermission);
Vue.use(dragPermission);
Vue.use(focusPermission);

Vue.mixin(ToolFunMixin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
