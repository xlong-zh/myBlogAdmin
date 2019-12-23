<template>
  <div class="home">
    <el-container>
      <el-aside style="width:auto;margin-right:10px;">
        <el-menu
          router
          style="border:none;"
          unique-opened
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
        >
          <div class="navlogo">
            <img src="../assets/logo.jpg" alt />
          </div>
          <el-menu-item index="/homePage/homePage">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/article/create">
            <i class="el-icon-edit"></i>
            <span slot="title">创建文章</span>
          </el-menu-item>
          <el-menu-item index="/article/list">
            <i class="el-icon-document"></i>
            <span slot="title">文章列表</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-folder-opened"></i>
              <span>图片管理</span>
            </template>
            <el-menu-item index="/image/create">增加图片</el-menu-item>
            <el-menu-item index="/image/list">图片列表</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-document-copy"></i>
              <span>类别管理</span>
            </template>
            <el-menu-item index="/category/create">新建类别</el-menu-item>
            <el-menu-item index="/category/list">类别列表</el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>admin</span>
            </template>
            <el-menu-item index="/user/create">新建管理员</el-menu-item>
            <el-menu-item index="/user/list">管理员列表</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="display:flex;align-items: center;margin-top:30px;">
          <div
            style="font-size:30px;margin-right:15px;padding-right:15px;border-right:1px solid #999"
            @click="isCollapse = !isCollapse"
          >
            <i v-show="!isCollapse" class="el-icon-s-fold"></i>
            <i v-show="isCollapse" class="el-icon-s-unfold"></i>
          </div>
          <Breadcrumb></Breadcrumb>
        </el-header>
        <el-main>
          <TopTags-nav></TopTags-nav>
          <div style="background:#ffffff;margin:12px;">
            <router-view :key="$route.path"></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TopTagsNav from "@comp/menu/TopTagsNav";
import Breadcrumb from "@comp/Breadcrumb/Breadcrumb";
export default {
  components: {
    TopTagsNav,
    Breadcrumb
  },
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
};
</script>
<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.home {
  .navlogo {
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  ::v-deep .el-main {
    padding: 0 !important;
    background: #f0f2f5;
  }
}
</style>
