import axios from 'axios';
import Vue from 'vue';
import router from './index.js';
const http = axios.create({
  // baseURL: "http://localhost:4000/admin/api"
  baseURL: process.env.VUE_APP_LOGOUT_URL,
  timeout: 30000 // 请求超时时间
});
//请求拦截
http.interceptors.request.use(
  config => {
    if (localStorage.getItem('ACCESS_TOKEN')) {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem('ACCESS_TOKEN');
    }
    if (config.method === 'get') {
      config.params = {
        _t: new Date().getTime(),
        ...config.params
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
//响应拦截
http.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    if (err.response.data.message) {
      Vue.prototype.$message({
        type: 'error',
        message: err.response.data.message
      });
      if (err.response.status === 401) {
        router.push('/login');
      }
    }
    return Promise.reject(err);
  }
);

export { http };
