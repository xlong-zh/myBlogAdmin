<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input
            placeholder="访客账户：visitor"
            v-model="model.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            placeholder="访客密码：123456"
            type="password"
            v-model="model.password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      model: {}
    };
  },
  methods: {
    ...mapActions(["Login"]),
    async login() {
      this.Login(this.model)
        .then(res => {
          this.$message.success(res.message || "登录成功");
          this.$router.push({ path: "/homePage/homePage" });
        })
        .catch(e => {
          this.$message.success(res.message || "登录失败");
        });
      // const res = await this.$http.postAction("/login", this.model);
      // // sessionStorage.token = res.data.token;
      // console.log(res);
      // localStorage.token = res.data.result.token;
      // // console.log(res.data);
    }
  }
};
</script>
<style lang="scss" scoped>
.login-card {
  width: 25rem;
  margin: 5rem auto;
}
</style>
