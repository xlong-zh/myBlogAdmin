<template>
  <div>
    <h1>{{id?'编辑':'增加'}}图片</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="getAuthHeaders()"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.img" :src="model.img" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="model.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data() {
    return {
      model: {}
    };
  },
  methods: {
    afterUpload(res) {
      console.log(res);
      this.$set(this.model, "img", res.url);
    },
    async save() {
      if (this.id) {
        const res = await this.$http.putAction(
          `/rest/image/${this.id}`,
          this.model
        );
      } else {
        const res = await this.$http.postAction(`/rest/image`, this.model);
      }
      this.$router.push(`/image/list`);
      this.$message({
        message: "保存成功",
        type: "success"
      });
    },
    async fetch() {
      const res = await this.$http.getAction(`/rest/image/${this.id}`);
      this.model = res.data;
    }
  },
  created() {
    this.id && this.fetch();
  }
};
</script>
<style lang='scss' scoped>
</style>