export const ToolFunMixin = {
  data() {
    return {};
  },
  created() {},
  computed: {
    uploadUrl() {
      return this.$http.defaults.baseURL + '/upload';
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
