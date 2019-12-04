<template>
  <div>
    <h1>{{ id ? "编辑" : "新建" }}文章</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="类别">
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
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea" v-model="model.content"></el-input>
        <div>
          {{msg}}
          <tinymce-editor
            ref="editor"
            v-model="msg"
            :disabled="disabled"
            @onClick="onClick"
          >
          </tinymce-editor>
          <button @click="clear">清空内容</button>
          <button @click="disabled = true">禁用</button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
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
      disabled: false
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
    async save() {
      if (this.id) {
        const res = await this.$http.putAction(
          `/rest/article/${this.id}`,
          this.model
        );
      } else {
        const res = await this.$http.postAction(`/rest/article`, this.model);
      }
      this.$router.push(`/article/list`);
      this.$message({
        message: "保存成功",
        type: "success"
      });
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
