<template>
  <div>
    <h1>{{id?'编辑':'新建'}}管理员</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="用户名">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="model.password"></el-input>
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
    async save() {
      if (this.id) {
        const res = await putAction(`/rest/user/${this.id}`, this.model);
      } else {
        const res = await postAction(`/rest/user`, this.model);
      }
      this.$router.push("/user/list");
      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      // const res = await this.$http.get(`/rest/user/${this.id}`);
      const res = await getAction(`/rest/user`, this.id);
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
