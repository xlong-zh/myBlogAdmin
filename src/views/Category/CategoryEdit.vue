<template>
  <div>
    <h1>{{id?'编辑':'新建'}}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="类别名称">
        <el-input v-model="model.name"></el-input>
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
  created() {
    this.id && this.fetch();
  },
  methods: {
    async save() {
      if (this.id) {
        const res = await this.$http.putAction(
          `/rest/category/${this.id}`,
          this.model
        );
      } else {
        const res = await this.$http.postAction(`/rest/category`, this.model);
      }
      this.$router.push("/category/list");
      this.$message({
        message: "保存成功",
        type: "success"
      });
    },

    async fetch() {
      const res = await this.$http.getAction(`/rest/category/${this.id}`);
      this.model = res.data;
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
