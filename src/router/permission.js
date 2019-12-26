import Vue from "vue";
import router from "./index.js";
import store from "./store";

const whiteList = ["/user/login", "/user/register", "/user/register-result"]; // no redirect whitelist
router.beforeEach((to, from, next) => {
  if (localStorage.getItem("ACCESS_TOKEN")) {
    if (to.path === "/login") {
      next({ path: "/homePage/homePage" });
    } else {
      console.log(store.getters.permissionList, "store.getters.permissionList");
      if (store.getters.permissionList.length === 0) {
        store
          .dispatch("GetPermissionList", localStorage.getItem("SET_USERNAME"))
          .then(res => {
            const permissionList = res.data.result.permissionList;
            store.dispatch("GenerateRoutes", { permissionList }).then(res => {
              router.addRoutes(store.getters.addRoutes);
              console.log(store.getters.addRoutes, "store.getters.addRoutes");
              const redirect = decodeURIComponent(
                from.query.redirect || to.path
              );
              if (to.path === redirect) {
                next({ ...to, replace: true });
              } else {
                // 跳转到目的路由
                next({ path: redirect });
              }
            });
          })
          .catch(e => {
            // store.dispatch("Logout").then(() => {
            //   next({ path: "/login", query: { redirect: to.fullPath } });
            // });
            console.log("登录失败");
            next({ path: "/login", query: { redirect: to.fullPath } });
          });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单路由，直接进入
      next();
    } else {
      next({ path: "/login", query: { redirect: to.fullPath } });
    }
  }
});
router.afterEach(() => {
  console.log("路由跳转后+++++++++++++++++++++++++");
  // router.app.$store.commit('SET_RELOAD', false);
});
