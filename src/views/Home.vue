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
            <i class="el-icon-edit"></i>
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
              <i class="el-icon-folder-opened"></i>
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
        <el-header style="margin-top:30px;">
          <div
            style="display:inline-block;font-size:30px;margin-right:15px;padding-right:15px;border-right:1px solid #999"
            @click="isCollapse = !isCollapse"
          >
            <i v-show="!isCollapse" class="el-icon-s-fold"></i>
            <i v-show="isCollapse" class="el-icon-s-unfold"></i>
          </div>
          <div style="display:inline-block;">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/homePage/homePage' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>
                <a href="/">活动管理</a>
              </el-breadcrumb-item>
              <el-breadcrumb-item>活动列表</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-header>
        <el-main>
          <div class="mynav-el-tabs-wrap">
            <el-tabs
              v-model="activePage"
              closable
              @edit="editPage"
              @tab-click="changePage"
            >
              <el-tab-pane
                :key="page.name"
                v-for="page in pageList"
                :label="page.title"
                :name="page.name"
              ></el-tab-pane>
            </el-tabs>
          </div>
          <div style="background:#ffffff;margin:12px;">
            <router-view :key="$route.path"></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  watch:{
    //    $route(newRoute) {
    //   this.activePage = newRoute.fullPath;
    //   if (!this.multipage) {
    //     this.linkList = [newRoute.fullPath];
    //     this.pageList = [Object.assign({}, newRoute)];
    //   } else if (this.linkList.indexOf(newRoute.fullPath) < 0) {
    //     this.linkList.push(newRoute.fullPath);
    //     this.pageList.push(Object.assign({}, newRoute));
    //   } else if (this.linkList.indexOf(newRoute.fullPath) >= 0) {
    //     let oldIndex = this.linkList.indexOf(newRoute.fullPath);
    //     let oldPositionRoute = this.pageList[oldIndex];
    //     this.pageList.splice(oldIndex, 1, Object.assign({}, newRoute, { meta: oldPositionRoute.meta }));
    //   }
    // },
  },
  data() {
    return {
      isCollapse: false,
      activePage: "2",
      pageList: [
        {
          title: "Tab 1",
          name: "1"
        },
        {
          title: "Tab 2",
          name: "2"
        }
      ],
      tabIndex: 2
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    changePage(key) {
      this.activePage = key;
      console.log("标签切换了+++++++++++++++++++++++++");
      //路由是否缓存
      // this.$store.commit('SET_RELOAD', true);
    },
    editPage(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: "New Tab",
          name: newTabName,
          content: "New Tab content"
        });
        this.activePage = newTabName;
      }
      if (action === "remove") {
        let tabs = this.editableTabs;
        let activeName = this.activePage;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.activePage = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
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

/*美化弹出Tab样式*/
.mynav-el-tabs-wrap {
  background: #ffffff;
  ::v-deep .el-tabs__header {
    margin-bottom: 5px !important;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: transparent !important;
  }
  ::v-deep .el-tabs__item {
    padding: 0 20px !important;
    // text-align: center !important;
  }
  ::v-deep .el-tabs__active-bar {
    left: -8px !important;
    height: 1px !important;
  }
  ::v-deep .el-tabs {
    margin-top: 2px;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    .el-tabs__item {
      .el-icon-close {
        opacity: 0 !important;
      }
      &:hover .el-icon-close {
        opacity: 1 !important;
        &:hover {
          background: transparent !important;
          color: #409eff !important;
        }
      }
    }
  }
}
</style>
