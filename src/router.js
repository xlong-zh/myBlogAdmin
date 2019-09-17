import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import CategoryEdit from './views/CategoryEdit.vue'
import CategoryList from './views/CategoryList.vue'
import ArticleEdit from './views/ArticleEdit.vue'
import ArticleList from './views/ArticleList.vue'
import UserEdit from './views/UserEdit.vue'
import UserList from './views/UserList.vue'
import ImageEdit from './views/ImageEdit.vue'
import ImageList from './views/ImageList.vue'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        isPublic: true
      }
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/category/create',
          name: 'category-c',
          component: CategoryEdit,
        },
        {
          path: '/category/edit/:id',
          name: 'category-e',
          component: CategoryEdit,
          props: true
        },
        {
          path: '/category/list',
          name: 'category-l',
          component: CategoryList,
        },

        {
          path: '/article/create',
          name: 'article-c',
          component: ArticleEdit,
        },
        {
          path: '/article/edit/:id',
          name: 'article-e',
          component: ArticleEdit,
          props: true
        },
        {
          path: '/article/list',
          name: 'article-l',
          component: ArticleList,
        },
        {
          path: '/user/create',
          name: 'user-c',
          component: UserEdit,
        },
        {
          path: '/user/edit/:id',
          name: 'user-e',
          component: UserEdit,
          props: true
        },
        {
          path: '/user/list',
          name: 'user-d',
          component: UserList,
        },

        {
          path: '/image/create',
          name: 'image-c',
          component: ImageEdit,
        },
        {
          path: '/image/edit/:id',
          name: 'image-e',
          component: ImageEdit,
          props: true
        },
        {
          path: '/image/list',
          name: 'image-d',
          component: ImageList,
        },
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
router.beforeEach((to, from, next) => {
  if (!to.meta.isPublic && !localStorage.token) {
    console.log('123')
    return next('/login')
  }
  next()
})

export default router