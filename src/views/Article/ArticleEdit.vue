<template>
  <div>
    <!-- <el-form label-width="120px" @submit.native.prevent="save"> -->
    <h1>{{ id ? "编辑" : "新建" }}文章</h1>
    <el-form
      :model="model"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="类别" prop="category">
        <el-select v-model="model.category" multiple>
          <el-option
            v-for="item in category"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="model.category"></el-input> -->
      </el-form-item>
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
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <!-- <el-input type="textarea" v-model="model.content"></el-input> -->
        <div>
          <!-- {{ msg }} -->
          <tinymce-editor
            ref="editor"
            v-model="model.content"
            :disabled="disabled"
            @onClick="onClick"
          >
          </tinymce-editor>
          <el-button size="small" type="warning" @click="clear"
            >清空内容</el-button
          >
          <el-button
            v-if="!disabled"
            size="small"
            type="info"
            @click="disabled = true"
            >禁用</el-button
          >
          <el-button
            v-if="disabled"
            size="small"
            type="primary"
            @click="disabled = false"
            >启用</el-button
          >
        </div>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" native-type="submit"></el-button> -->
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import TinymceEditor from "@comp/editor/editor.vue";
export default {
  components: {
    TinymceEditor
  },
  props: {
    id: {}
  },
  data() {
    return {
      model: {},
      category: [],
      msg: "Welcome to Use Tinymce Editor",
      disabled: false,
      rules: {
        category: [
          { required: true, message: "请选择分类", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      }
    };
  },
  created() {
    this.id && this.fetch();
    this.fetchCategory();
  },
  methods: {
    afterUpload(res) {
      console.log(res);
      this.$set(this.model, "icon", res.url);
    },
    async submitForm(formName) {
      const that = this;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (that.id) {
            const res = await that.$http.putAction(
              `/rest/article/${that.id}`,
              that.model
            );
          } else {
            const res = await that.$http.postAction(
              `/rest/article`,
              that.model
            );
          }
          that.$router.push(`/article/list`);
          that.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async fetch() {
      const res = await this.$http.getAction(`/rest/article/${this.id}`);
      this.model = res.data;
    },
    async fetchCategory() {
      const res = await this.$http.getAction(`/rest/category`);
      this.category = res.data;
    },
    // 鼠标单击的事件
    onClick(e, editor) {
      console.log("Element clicked");
      console.log(e);
      console.log(editor);
    },
    // 清空内容
    clear() {
      this.$refs.editor.clear();
    }
  }
};
</script>
<style lang="scss" scoped></style>
