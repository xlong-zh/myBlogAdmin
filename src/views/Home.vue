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
          <div v-for="item in submenuList" :key="item.path">
            <el-menu-item
              v-if="!item.children"
              :key="item.path"
              :index="item.path"
            >
              <i :class="item.meta.icon"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </el-menu-item>
            <el-submenu v-else :key="item.path" :index="item.path">
              <template slot="title">
                <i :class="item.meta.icon"></i>
                <span>{{ item.meta.title }}</span>
              </template>
              <el-menu-item
                v-for="itemcld in item.children"
                :key="itemcld.path"
                :index="itemcld.path"
                >{{ itemcld.meta.title }}</el-menu-item
              >
            </el-submenu>
          </div>
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
          <Breadcrumb style="flex:1;"></Breadcrumb>
          <div>
            <el-button type="info" @click="toLogout">登出</el-button>
          </div>
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
function getSubmenuList(list) {
  const submenuList = list.filter(item => {
    if (item.meta && !item.meta.menuHide) {
      if (item.children && item.children.length) {
        item.children = getSubmenuList(item.children);
      }
      return true;
    }
    return false;
  });
  return submenuList;
}
import TopTagsNav from "@comp/menu/TopTagsNav";
import Breadcrumb from "@comp/Breadcrumb/Breadcrumb";
import { mapActions } from "vuex";
export default {
  components: {
    TopTagsNav,
    Breadcrumb
  },
  created() {
    console.log(this.submenuList, "submenuList");
  },
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    submenuList() {
      return getSubmenuList(this.$store.getters.addRouters[0].children);
    }
  },
  methods: {
    ...mapActions(["Logout"]),
    toLogout() {
      this.Logout().then(() => {
        this.$router.push({ path: "/login" });
      });
    },
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
