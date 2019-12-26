import { http } from "@/router/request";

export function login(parameter) {
  return http({
    url: "/login",
    method: "post",
    data: parameter
  });
}

export function getInfo(parameter) {
  return http({
    url: "/permissionList",
    method: "post",
    data: parameter,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
}

export function logout(logoutToken) {
  return http({
    url: "/logout",
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-Access-Token": logoutToken
    }
  });
}
