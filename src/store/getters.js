import Vue from 'vue';
const getters = {
  token: state => state.user.token,
  username: state => state.user.username,
  permissionList: state => state.user.permissionList,
  addRouters: state => state.permission.addRouters
};

export default getters;
