<template>
  <div>
    <!-- 面包屑导航区域 -->

    <Breadcrumb title="权限管理" subTitle="权限列表" />
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.vue'

export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      rightList: []
    }
  },

  created() {
    this.getRightList()
  },

  methods: {
    // 获取权限列表
    async getRightList() {
      const { data: res } = await this.$http.get('/rights/list')
      if (res.meta.status !== 200) {
        this.$messga.error('获取权限列表失败')
      }
      this.rightList = res.data
      console.log(this.rightList)
    }
  }
}
</script>

<style lang='less' scoped>
</style>
