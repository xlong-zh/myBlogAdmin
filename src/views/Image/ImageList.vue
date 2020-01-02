<template>
  <div>
    <h1>图片列表</h1>
    <el-table :data="model" v-if="model">
      <el-table-column prop="name" label="名称" width="150"></el-table-column>
      <el-table-column prop="img" label="图标" width="100">
        <template slot-scope="scope">
          <img @click="bigPicture(scope.row.img)" :src="scope.row.img" style="height:50px;cursor: pointer;" alt />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="180"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-has @click="$router.push(`/image/edit/${scope.row._id}`)" type="text" size="small">编辑</el-button>
          <el-button v-has @click="remove(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--图片预览-->
    <pictureOperate ref="pictrue" :srcString="srcString"></pictureOperate>
  </div>
</template>

<script>
import pictureOperate from '@comp/pictureOperate/pictureOperate';
export default {
  components: {
    pictureOperate
  },
  created() {
    this.fetch();
    // console.log(this.model);
  },
  data() {
    return {
      // 图片预览
      srcString: null,
      model: []
      // new Array(5).fill(1).map(v => ({
      //   name: "aaa",
      //   title: "123",
      //   category: "BBB",
      //   content: "CCC"
      // }))
    };
  },
  computed: {},
  methods: {
    //  图片预览
    bigPicture(data) {
      this.srcString = data;
      this.$refs.pictrue.show();
    },
    async fetch() {
      const res = await this.$http.getAction(`/rest/image`);
      this.model = res.data;
      // console.log(this.model);
    },
    async remove(row) {
      this.$confirm(`是否确认删除${row.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.deleteAction(`/rest/image/${row._id}`);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.fetch();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped></style>
