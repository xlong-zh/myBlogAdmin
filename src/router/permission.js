import Vue from "vue";
import router from "./index.js";
import store from "@src/store";

const whiteList = ["/login"]; // no redirect whitelist
router.beforeEach((to, from, next) => {
  if (localStorage.getItem("ACCESS_TOKEN")) {
    if (to.path === "/login") {
      next({ path: "/homePage/homePage" });
    } else {
      if (store.getters.permissionList.length === 0) {
        store
          .dispatch("GetPermissionList", {
            username: sessionStorage.getItem("SET_USERNAME")
          })
          .then(res => {
            const permissionList = res.data.result.permissionList;
            store.dispatch("GenerateRoutes", { permissionList }).then(res => {
              // console.log(store.getters.addRouters, "store.getters.addRouters");
              router.addRoutes(store.getters.addRouters);
              const redirect = decodeURIComponent(
                from.query.redirect || to.path
              );
              // console.log(from, "from");
              // console.log(redirect, "redirect");
              if (to.path === redirect) {
                next({ ...to, replace: true });
              } else {
                // 跳转到目的路由
                next({ path: redirect });
              }
            });
          })
          .catch(e => {
            store.dispatch("Logout").then(() => {
              next({ path: "/login" });
            });
            // next({ path: "/login", query: { redirect: to.fullPath } });
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
      next({ path: "/login" });
    }
  }
});
router.afterEach(() => {
  console.log("路由跳转后+++++++++++++++++++++++++");
  // router.app.$store.commit('SET_RELOAD', false);
});
