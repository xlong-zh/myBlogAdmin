import Vue from "vue";
import { login, logout, getInfo } from "@/api/login";

const user = {
  state: {
    token: "",
    username: "",
    permissionList: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERNAME: (state, username) => {
      state.username = username;
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    }
  },

  actions: {
    //修改用户信息
    changeUserInfo({ commit }, userInfo) {
      commit("SET_INFO", userInfo);
    },
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            if (res.status === 200) {
              const result = res.data.result;
              // const userInfo = result.userInfo;
              localStorage.setItem("ACCESS_TOKEN", result.token);
              localStorage.setItem("SET_USERNAME", result.username);
              commit("SET_TOKEN", result.token);
              commit("SET_USERNAME", result.username);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 登出
    Logout({ commit, state }) {
      return new Promise(resolve => {
        let logoutToken = state.token;
        commit("SET_TOKEN", "");
        commit("SET_PERMISSIONLIST", []);
        localStorage.removeItem("ACCESS_TOKEN");
        logout(logoutToken)
          .then(() => {
            resolve();
          })
          .catch(() => {
            resolve();
          });
      });
    },
    // 获取用户信息路由和权限列表
    GetPermissionList({ commit },params) {
      return new Promise((resolve, reject) => {
        getInfo(params)
          .then(res => {
            if (res.status === 200) {
              const result = res.data.result;
              const permissionList = result.permissionList;
              sessionStorage.setItem(
                "USER_AUTH",
                JSON.stringify(permissionList)
              );
              if (permissionList && permissionList.length > 0) {
                commit("SET_PERMISSIONLIST", permissionList);
              } else {
                reject("权限数组类型错误");
              }
              resolve(res);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};

export default user;
