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
              <el-breadcrumb-item :to="{ path: '/homePage/homePage' }"
                >首页</el-breadcrumb-item
              >
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
            <contextmenu
              :itemList="menuItemList"
              :visible.sync="menuVisible"
              @select="onMenuSelect"
            />
            <el-tabs
              @contextmenu.native="e => onContextmenu(e)"
              v-model="activePage"
              closable
              @edit="editPage"
              @tab-click="changePage"
            >
              <el-tab-pane
                :key="page.fullPath"
                v-for="page in pageList"
                :name="page.fullPath"
              >
                <span slot="label" :data-pagekey="page.fullPath">{{
                  page.meta.title
                }}</span>
              </el-tab-pane>
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
import Contextmenu from "@comp/menu/Contextmenu";
const indexKey = "/homePage/homePage";
export default {
  components: {
    Contextmenu
  },
  watch: {
    $route(newRoute) {
      this.activePage = newRoute.fullPath;

      if (this.linkList.indexOf(newRoute.fullPath) < 0) {
        this.linkList.push(newRoute.fullPath);
        this.pageList.push(Object.assign({}, newRoute));
      } else if (this.linkList.indexOf(newRoute.fullPath) >= 0) {
        let oldIndex = this.linkList.indexOf(newRoute.fullPath);
        let oldPositionRoute = this.pageList[oldIndex];
        this.pageList.splice(
          oldIndex,
          1,
          Object.assign({}, newRoute, { meta: oldPositionRoute.meta })
        );
      }
    },
    activePage(key) {
      let index = this.linkList.lastIndexOf(key);
      let waitRouter = this.pageList[index];
      this.$router.push(Object.assign({}, waitRouter));
    }
  },
  created() {
    if (this.$route.path != indexKey) {
      this.pageList.push({
        name: "homePage-homePage",
        path: indexKey,
        fullPath: indexKey,
        meta: {
          icon: "dashboard",
          title: "首页"
        }
      });
      this.linkList.push(indexKey);
    }
    console.log(this.$route, "this.$route");
    this.pageList.push(this.$route);
    this.linkList.push(this.$route.fullPath);
    this.activePage = this.$route.fullPath;
  },
  data() {
    return {
      isCollapse: false,
      activePage: "",
      linkList: [],
      pageList: [],
      menuVisible: false,
      menuItemList: [
        { key: "1", icon: "arrow-left", text: "关闭左侧" },
        { key: "2", icon: "arrow-right", text: "关闭右侧" },
        { key: "3", icon: "close", text: "关闭其它" }
      ]
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    onContextmenu(e) {
      const pagekey = this.getPageKey(e.target);
      // console.log(pagekey);
      // console.log(e.target);
      // console.log(e.target.id);
      if (pagekey !== null) {
        e.preventDefault();
        this.menuVisible = true;
      }
    },
    getPageKey(target, depth) {
      depth = depth || 0;
      if (depth > 2) {
        return null;
      }
      let pageKey = target.dataset.pagekey || null;
      // return pageKey;
      pageKey =
        pageKey ||
        (target.previousElementSibling
          ? target.previousElementSibling.dataset.pagekey
          : null);
      return (
        pageKey ||
        (target.firstElementChild
          ? this.getPageKey(target.firstElementChild, ++depth)
          : null)
      );
    },
    //弹窗
    onMenuSelect(key, target) {
      let pageKey = this.getPageKey(target);
      console.log(key, "弹窗key");
      console.log(target, "弹窗target");
      console.log(pageKey, "弹窗");
      switch (key) {
        case "1":
          this.closeLeft(pageKey);
          break;
        case "2":
          this.closeRight(pageKey);
          break;
        case "3":
          this.closeOthers(pageKey);
          break;
        default:
          break;
      }
    },
    closeOthers(pageKey) {
      let index = this.linkList.indexOf(pageKey);
      if (pageKey == indexKey) {
        this.linkList = this.linkList.slice(index, index + 1);
        this.pageList = this.pageList.slice(index, index + 1);
        this.activePage = this.linkList[0];
      } else {
        let indexContent = this.pageList.slice(0, 1)[0];
        this.linkList = this.linkList.slice(index, index + 1);
        this.pageList = this.pageList.slice(index, index + 1);
        this.linkList.unshift(indexKey);
        this.pageList.unshift(indexContent);
        this.activePage = this.linkList[1];
      }
    },
    closeLeft(pageKey) {
      if (pageKey == indexKey) {
        return;
      }
      let tempList = [...this.pageList];
      let indexContent = tempList.slice(0, 1)[0];
      let index = this.linkList.indexOf(pageKey);
      this.linkList = this.linkList.slice(index);
      this.pageList = this.pageList.slice(index);
      this.linkList.unshift(indexKey);
      this.pageList.unshift(indexContent);
      if (this.linkList.indexOf(this.activePage) < 0) {
        this.activePage = this.linkList[0];
      }
    },
    closeRight(pageKey) {
      let index = this.linkList.indexOf(pageKey);
      this.linkList = this.linkList.slice(0, index + 1);
      this.pageList = this.pageList.slice(0, index + 1);
      if (this.linkList.indexOf(this.activePage < 0)) {
        this.activePage = this.linkList[this.linkList.length - 1];
      }
    },
    changePage(key) {
      this.activePage = key.name;
      console.log("标签切换了+++++++++++++++++++++++++");
    },
    editPage(target, action) {
      if (action === "add") {
      }
      if (action === "remove") {
        if (target == indexKey) {
          this.$message.warning("首页不能关闭!");
          return;
        }
        if (this.pageList.length === 1) {
          this.$message.warning("这是最后一页，不能再关闭了啦");
          return;
        }
        let index1 = this.linkList.indexOf(target);
        let index2 = this.linkList.indexOf(this.activePage);
        this.pageList = this.pageList.filter(item => item.fullPath !== target);
        this.linkList = this.linkList.filter(item => item !== target);
        if (index1 === index2) {
          this.activePage = this.linkList[0];
        } else if (index1 < index2) {
          this.activePage = this.linkList[index2 - 1];
        }
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
