import { asyncRouterMap, constantRouterMap } from "@src/router";
// 判断用户权限和路由是否匹配
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(item => route.meta.role.indexOf(item) >= 0);
  } else {
    return true;
  }
}
// 筛选权限路由
function filterAsyncRouter(routerMap, permissionList) {
  const accessedRouters = routerMap.filter(item => {
    if (hasPermission(permissionList, item)) {
      if (item.children && item.children.length) {
        item.children = filterAsyncRouter(item.children, permissionList);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
      // console.log(state.routers, "state.routers");
    }
  },
  actions: {
    GenerateRoutes: ({ commit }, data) => {
      return new Promise(resolve => {
        const { permissionList } = data;
        const accessedRouters = filterAsyncRouter(
          asyncRouterMap,
          permissionList
        );
        // console.log(accessedRouters, "accessedRouters");
        // console.log(asyncRouterMap, "asyncRouterMap");
        // console.log(permissionList, "permissionList");
        commit("SET_ROUTERS", accessedRouters);
        resolve();
      });
    }
  }
};

export default permission;
