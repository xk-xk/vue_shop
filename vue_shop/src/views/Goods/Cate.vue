<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb title="商品管理" subTitle="商品分类" />

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary">添加分类</el-button>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
      </tree-table>
      <!-- 分页区域 -->
    </el-card>
    <!-- 测试分支 -->
  </div>
</template>

<script type="text/javascript">
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.vue'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 分列表数据
      cateList: [],
      // 总的数据条数
      total: 0,
      // 定义表格列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'isok'
        }
      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        this.$message.error('获取分类列表数据失败')
      }

      console.log(res.data)
      this.cateList = res.data.result

      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
</style>
