<template>
  <div class="fixContent" @click="close" v-if="visible">
    <div class="imgBox">
      <div v-drag class="position" @click.stop>
        <div class="picture" v-if="rotateId == 90" :style="{ transform: rotateId == 90 ? 'rotate(90deg)' : '' }">
          <img @click.stop class="thisPic my_dialog_title" :style="{ height: pxChange + 'px' }" :src="srcString" alt />
        </div>
      </div>
      <div v-drag class="position" @click.stop>
        <div class="picture" v-if="rotateId == 180" :style="{ transform: rotateId == 180 ? 'rotate(180deg)' : '' }">
          <img @click.stop class="thisPic my_dialog_title" :style="{ height: pxChange + 'px' }" :src="srcString" alt />
        </div>
      </div>
      <div v-drag class="position" @click.stop>
        <div class="picture" v-if="rotateId == 270" :style="{ transform: rotateId == 270 ? 'rotate(270deg)' : '' }">
          <img @click.stop class="thisPic my_dialog_title" :style="{ height: pxChange + 'px' }" :src="srcString" alt />
        </div>
      </div>
      <div v-drag class="position">
        <div class="picture" v-if="rotateId == 360 || rotateId == 0" :style="{ transform: rotateId == 360 ? 'rotate(360deg)' : '' }">
          <img @click.stop class="thisPic my_dialog_title" :style="{ height: pxChange + 'px' }" :src="srcString" alt />
        </div>
      </div>
    </div>
    <div class="icon">
      <div class="icon-box" @click.stop>
        <i @click="rotate" class="el-icon-refresh-right icon-item"></i>
        <i @click="enlarge" class="el-icon-circle-plus-outline icon-item"></i>
        <i @click="reduce" class="el-icon-remove-outline icon-item"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    srcString: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rotateId: 0,
      pxChange: 350,
      visible: false
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.rotateId = 0;
      this.pxChange = 350;
    },
    rotate() {
      this.rotateId = this.rotateId + 90;
      if (this.rotateId > 360) {
        this.rotateId = 90;
      }
    },
    enlarge() {
      this.pxChange = this.pxChange + 120;
    },
    reduce() {
      this.pxChange = this.pxChange - 40;
      if (this.pxChange <= 160) {
        this.pxChange = 160;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import './index.scss';
.my_dialog_title {
  cursor: all-scroll;
}
</style>
