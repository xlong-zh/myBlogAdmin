<template>
  <div>
    <h1>{{ id ? "编辑" : "新建" }}管理员</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="用户名">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="model.password"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="model.permissionList" multiple placeholder="请选择">
          <!-- <el-option label="超级" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option> -->
          <el-option
            v-for="item in permissionList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
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
      model: {},
      permissionList: [
        { name: "超级管理员", value: "super_admin" },
        { name: "管理员", value: "admin" },
        { name: "游客", value: "visitor" }
      ]
    };
  },
  methods: {
    async save() {
      if (this.id) {
        const res = await this.$http.putAction(
          `/rest/user/${this.id}`,
          this.model
        );
      } else {
        const res = await this.$http.postAction(`/rest/user`, this.model);
      }
      this.$router.push("/user/list");
      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      const res = await this.$http.getAction(`/rest/user/${this.id}`);
      this.model = res.data;
      this.model.password = null;
    }
  },
  created() {
    console.log(this.id);
    this.id && this.fetch();
  }
};
</script>
<style lang="scss" scoped></style>
