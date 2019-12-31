<template>
  <div>
    <h1>类别列表</h1>
    <el-table v-if="items" :data="items">
      <el-table-column prop="_id" label="ID" width="240"></el-table-column>
      <el-table-column
        prop="name"
        label="类别名称"
        width="150"
      ></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
          v-has
            @click="$router.push(`/category/edit/${scope.row._id}`)"
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
    created() {
    this.fetch();
    console.log(this.$route.matched,'this.$route.matched')
  },
  data() {
    return {
      items: []
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.getAction(`/rest/category`);
      this.items = res.data;
    },
    async remove(row) {
      this.$confirm(`是否确认删除${row.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.deleteAction(
            `/rest/category/${row._id}`
          );
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
  },

};
</script>
<style lang="scss" scoped></style>
