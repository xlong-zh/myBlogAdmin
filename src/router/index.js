import Vue from "vue";
import Router from "vue-router";
import Home from "@views/Home.vue";
import Login from "@views/Login.vue";
import HomePage from "@views/HomePage/HomePage.vue";
import CategoryEdit from "@views/Category/CategoryEdit.vue";
import CategoryList from "@views/Category/CategoryList.vue";
import ArticleEdit from "@views/Article/ArticleEdit.vue";
import ArticleList from "@views/Article/ArticleList.vue";
import UserEdit from "@views/User/UserEdit.vue";
import UserList from "@views/User/UserList.vue";
import ImageEdit from "@views/Image/ImageEdit.vue";
import ImageList from "@views/Image/ImageList.vue";

Vue.use(Router);
//解决重复跳转报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
// const router = new Router({
// mode: 'history',
// base: process.env.BASE_URL,
export const constantRouterMap = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    name: "home",
    component: Home,
    children: [
      {
        path: "/homePage/homePage",
        name: "homePage-homePage",
        component: HomePage,
        meta: {
          icon: "dashboard",
          title: "首页"
        }
      }
    ]
  }
];
export const asyncRouterMap = [
  {
    path: "/category/create",
    name: "category-create",
    component: CategoryEdit,
    meta: {
      icon: "dashboard",
      title: "新建分类",
      role: ["admin", "super_admin"]
    }
  },
  {
    path: "/category/edit/:id",
    name: "category-edit",
    component: CategoryEdit,
    props: true,
    meta: {
      icon: "dashboard",
      title: "编辑分类",
      role: ["admin", "super_admin"]
    }
  },
  {
    path: "/category/list",
    name: "category-list",
    component: CategoryList,
    meta: {
      icon: "dashboard",
      title: "分类列表",
      role: ["admin", "super_admin", "visitor"]
    }
  },

  {
    path: "/article/create",
    name: "article-create",
    component: ArticleEdit,
    meta: {
      icon: "dashboard",
      title: "新建文章",
      role: ["admin", "super_admin"]
    }
  },
  {
    path: "/article/edit/:id",
    name: "article-edit",
    component: ArticleEdit,
    props: true,
    meta: {
      icon: "dashboard",
      title: "编辑文章",
      role: ["admin", "super_admin"]
    }
  },
  {
    path: "/article/list",
    name: "article-list",
    component: ArticleList,
    meta: {
      icon: "dashboard",
      title: "文章列表",
      role: ["admin", "super_admin", "visitor"]
    }
  },
  {
    path: "/user/create",
    name: "user-create",
    component: UserEdit,
    meta: {
      icon: "dashboard",
      title: "新建用户",
      role: ["admin", "super_admin"]
    }
  },
  {
    path: "/user/edit/:id",
    name: "user-edit",
    component: UserEdit,
    props: true,
    meta: {
      icon: "dashboard",
      title: "编辑用户",
      role: ["admin", "super_admin"]
    }
  },
  {
    path: "/user/list",
    name: "user-list",
    component: UserList,
    meta: {
      icon: "dashboard",
      title: "用户列表",
      role: ["admin", "super_admin"]
    }
  },

  {
    path: "/image/create",
    name: "image-create",
    component: ImageEdit,
    meta: {
      icon: "dashboard",
      title: "新建图片",
      role: ["admin", "super_admin"]
    }
  },
  {
    path: "/image/edit/:id",
    name: "image-edit",
    component: ImageEdit,
    props: true,
    meta: {
      icon: "dashboard",
      title: "编辑图片",
      role: ["admin", "super_admin"]
    }
  },
  {
    path: "/image/list",
    name: "image-list",
    component: ImageList,
    meta: {
      icon: "dashboard",
      title: "图片列表",
      role: ["admin", "super_admin", "visitor"]
    }
  },
  { path: "*", redirect: "/404", hidden: true }
];
export default new Router({
  routes: constantRouterMap
});
// {
//   path: '/about',
//   name: 'about',
//   // route level code-splitting
//   // this generates a separate chunk (about.[hash].js) for this route
//   // which is lazy-loaded when the route is visited.
//   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
// }
