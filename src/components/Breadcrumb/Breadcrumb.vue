<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in breadList" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
      <!-- :to="item.meta && !item.meta.breadRow ? { path: item.path } : false" -->
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  data() {
    return {
      breadList: [] // 路由集合
    };
  },
  methods: {
    isHome(route) {
      return route.name === 'home';
    },
    getBreadcrumb() {
      let matched = this.$route.matched;
      console.log(matched, 'matched');
      if (this.isHome(matched[0])) {
        matched[0].path = '/homePage/homePage';
        matched[0].meta.title = '首页';
      } else {
        //如果不是首页
        matched = [{ path: '/', meta: { title: '首页' } }].concat(matched);
      }
      if (matched[0].path === matched[1].path) {
        matched.shift();
      }
      this.breadList = matched;
    }
  }
};
</script>
<style lang="scss" scoped></style>
