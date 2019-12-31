<template>
  <div>
    <h1>文章列表</h1>
    <el-table :data="model" v-if="model">
      <el-table-column label="类别" width="150">
        <template slot-scope="scope">{{
          scope.row.category.map(v => v.name).join("/")
        }}</template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="150"></el-table-column>
      <el-table-column prop="icon" label="图标" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="height:50px" alt />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column
        prop="content"
        label="内容"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            v-has
            @click="$router.push(`/article/edit/${scope.row._id}`)"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button v-has @click="remove(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      model: []
    };
  },
  created() {
    this.fetch();
  },
  computed: {},
  methods: {
    async fetch() {
      const res = await this.$http.getAction(`/rest/article`);
      this.model = res.data;
    },
    async remove(row) {
      this.$confirm(`是否确认删除${row.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.deleteAction(`/rest/article/${row._id}`);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.fetch();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped></style>
