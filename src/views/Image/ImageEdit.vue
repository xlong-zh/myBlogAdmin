<template>
  <div>
    <h1>{{ id ? '编辑' : '增加' }}图片</h1>
    <!-- <el-form label-width="120px" @submit.native.prevent="save"> -->
    <el-form :model="model" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="名称" prop="name">
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
      <el-form-item label="备注" prop="remark">
        <el-input v-model="model.remark"></el-input>
      </el-form-item>
      <el-form-item v-has>
        <!-- <el-button type="primary" native-type="submit">保存</el-button> -->
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { async } from 'q';
export default {
  props: {
    id: {}
  },
  data() {
    return {
      model: {},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    };
  },
  methods: {
    afterUpload(res) {
      console.log(res);
      this.$set(this.model, 'img', res.url);
    },
    async submitForm(formName) {
      const that = this;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (that.id) {
            const res = await that.$http.putAction(`/rest/image/${that.id}`, that.model);
          } else {
            const res = await that.$http.postAction(`/rest/image`, that.model);
          }
          that.$router.push(`/image/list`);
          that.$message({
            message: '保存成功',
            type: 'success'
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async resetForm(formName) {
      this.$refs[formName].resetFields();
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
<style lang="scss" scoped></style>
