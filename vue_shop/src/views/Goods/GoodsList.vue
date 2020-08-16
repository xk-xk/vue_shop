<template>
  <div>
    <Breadcrumb title='商品管理' subTitle='商品列表' />

    <el-card>
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary'>添加商品</el-button>
        </el-col>

      </el-row>
      <!-- table 表格区域 -->
      <el-table :data='goodsList' border stripe>
        <el-table-column type='index'></el-table-column>
        <el-table-column label='商品名称' prop='goods_name'></el-table-column>
        <el-table-column label='商品价格（元）' prop='goods_price' width='130px'>
        </el-table-column>
        <el-table-column label='商品重量' prop='goods_weight' width='70px'></el-table-column>
        <el-table-column label='创建时间' prop='add_time' width='140px'>
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label='操作' width='130px'>
          <template slot-scope='scope'>
            <el-button size='mini' type='primary' icon='el-icon-edit'></el-button>
            <el-button size='mini' type='danger' icon='el-icon-delete'></el-button>
          </template>
        </el-table-column>
      </el-table>
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
      }
    }
  }
</script>

<style lang='less' scoped>
</style>