import Vue from 'vue';
import Router from 'vue-router';
import Home from '@views/Home.vue';
import Layout from '@views/Layout.vue';
import Login from '@views/Login.vue';

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
    path: '/login',
    name: 'login',
    component: Login
  }
];

export const asyncRouterMap = [
  {
    path: '/',
    name: 'home',
    component: Home,
    // redirect: "/homePage/homePage",
    children: [
      {
        path: '/homePage/homePage',
        name: 'homePage-homePage',
        component: () => import('@views/HomePage/HomePage.vue'),
        meta: {
          icon: 'el-icon-s-home',
          title: '首页'
        }
      },
      {
        path: '/article/create',
        name: 'article-create',
        component: () => import('@views/Article/ArticleEdit.vue'),
        meta: {
          icon: 'el-icon-edit',
          title: '新建文章',
          role: ['admin', 'super_admin']
        }
      },
      {
        path: '/article/edit/:id',
        name: 'article-edit',
        component: () => import('@views/Article/ArticleEdit.vue'),
        props: true,
        meta: {
          menuHide: true,
          title: '编辑文章',
          role: ['admin', 'super_admin', 'visitor']
        }
      },
      {
        path: '/article/list',
        name: 'article-list',
        component: () => import('@views/Article/ArticleList.vue'),
        meta: {
          icon: 'el-icon-document',
          title: '文章列表',
          role: ['admin', 'super_admin', 'visitor']
        }
      },
      {
        path: '/category',
        name: 'category',
        component: Layout,
        meta: {
          icon: 'el-icon-document-copy',
          title: '类别管理',
          breadRow: true
        },
        children: [
          {
            path: '/category/create',
            name: 'category-create',
            component: () => import('@views/Category/CategoryEdit.vue'),
            meta: {
              title: '新建分类',
              role: ['admin', 'super_admin']
            }
          },
          {
            path: '/category/edit/:id',
            name: 'category-edit',
            component: () => import('@views/Category/CategoryEdit.vue'),
            props: true,
            meta: {
              menuHide: true,
              title: '编辑分类',
              role: ['admin', 'super_admin', 'visitor']
            }
          },
          {
            path: '/category/list',
            name: 'category-list',
            component: () => import('@views/Category/CategoryList.vue'),
            meta: {
              title: '分类列表',
              role: ['admin', 'super_admin', 'visitor']
            }
          }
        ]
      },

      {
        path: '/image',
        name: 'image',
        component: Layout,
        meta: {
          icon: 'el-icon-folder-opened',
          title: '图片管理',
          breadRow: true
        },
        children: [
          {
            path: '/image/create',
            name: 'image-create',
            component: () => import('@views/Image/ImageEdit.vue'),
            meta: {
              title: '新建图片',
              role: ['admin', 'super_admin']
            }
          },
          {
            path: '/image/edit/:id',
            name: 'image-edit',
            component: () => import('@views/Image/ImageEdit.vue'),
            props: true,
            meta: {
              menuHide: true,
              title: '编辑图片',
              role: ['admin', 'super_admin', 'visitor']
            }
          },
          {
            path: '/image/list',
            name: 'image-list',
            component: () => import('@views/Image/ImageList.vue'),
            meta: {
              title: '图片列表',
              role: ['admin', 'super_admin', 'visitor']
            }
          }
        ]
      },
      {
        path: '/user',
        name: 'user',
        component: Layout,
        meta: {
          icon: 'el-icon-setting',
          title: '用户管理',
          role: ['admin', 'super_admin'],
          breadRow: true
        },
        children: [
          {
            path: '/user/create',
            name: 'user-create',
            component: () => import('@views/User/UserEdit.vue'),
            meta: {
              title: '新建用户',
              role: ['admin', 'super_admin']
            }
          },
          {
            path: '/user/edit/:id',
            name: 'user-edit',
            component: () => import('@views/User/UserEdit.vue'),
            props: true,
            meta: {
              menuHide: true,
              title: '编辑用户',
              role: ['admin', 'super_admin']
            }
          },
          {
            path: '/user/list',
            name: 'user-list',
            component: () => import('@views/User/UserList.vue'),
            meta: {
              title: '用户列表',
              role: ['admin', 'super_admin']
            }
          }
        ]
      },
      { path: '*', redirect: '/404', hidden: true }
    ]
  }
];
export default new Router({
  routes: constantRouterMap
});
