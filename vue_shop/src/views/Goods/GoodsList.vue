<template>
  <div>
    <Breadcrumb title="商品管理" subTitle="商品列表" />

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="130px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="remiveById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script type="text/javascript">
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.vue'
export default {
  components: {
    Breadcrumb
  },
  props: {},
  data() {
    return {
      // 获取商品列表的查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品数据列表
      goodsList: [],
      // 总商品数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败')
      }

      console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },

    // 监听分页器 pageSize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听分页器 pagenum 改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 根据 id 删除商品
    async remiveById(id) {
      const conifrmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (conifrmResult !== 'confirm') {
        return this.$message.info('取消了删除商品！')
      }

      const { data: res } = await this.$http.delete(`goods/${id}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },

    // 跳转到添加商品页
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang='less' scoped>
</style>