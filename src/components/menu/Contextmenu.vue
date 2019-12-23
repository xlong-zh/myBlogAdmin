<template>
  <el-menu :style="style" class="contextmenu" v-show="visible">
    <el-menu-item
      @click.native="handleClick(item.key, $event)"
      :index="item.key"
      :key="item.key"
      v-for="item in itemList"
    >
      <i v-if="item.icon" :class="item.icon"></i>
      <span data-role="menuitemicon" slot="title"> {{ item.text }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "Contextmenu",
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    },
    itemList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      left: 0,
      top: 0,
      target: null
    };
  },
  computed: {
    style() {
      return {
        left: this.left + "px",
        top: this.top + "px"
      };
    }
  },
  created() {
    window.addEventListener("mousedown", e => this.closeMenu(e));
    window.addEventListener("contextmenu", e => this.setPosition(e));
  },
  methods: {
    closeMenu(e) {
      if (["menuitem", "menuitemicon"].indexOf(e.target.dataset.role) < 0) {
        this.$emit("update:visible", false);
      }
    },
    setPosition(e) {
      this.left = e.clientX;
      this.top = e.clientY;
      this.target = e.target;
    },
    handleClick(key, e) {
      console.log("子组件触发了");
      console.log(e);
      this.$emit("select", key, this.target);
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.contextmenu {
  position: fixed;
  z-index: 999;
  border: 1px solid #9e9e9e;
  border-radius: 4px;
  box-shadow: 2px 2px 10px #aaaaaa !important;
  width: auto !important;
  background: #ffffff;
}
</style>
