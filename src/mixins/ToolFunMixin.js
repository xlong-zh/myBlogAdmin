import { http } from '@/router/request';
export const ToolFunMixin = {
  data() {
    return {};
  },
  created() {},
  computed: {
    uploadUrl() {
      return http.defaults.baseURL + '/upload';
    }
  },
  methods: {
    getAuthHeaders() {
      return {
        Authorization: `Bearer ${localStorage.token || ''}`
      };
    }
  }
};
