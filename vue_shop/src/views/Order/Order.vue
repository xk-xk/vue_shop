<template>
  <div>
    <Breadcrumb title="订单管理" subTitle="订单列表" />

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table 表格区域 -->
      <el-table :data="orderlist" border stripe style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="130px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="130px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="130px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="150px">
          <template slot-scope="scope">{{scope.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="showEditAdressDialog"></el-button>
            <el-button
              size="mini"
              icon="el-icon-location-outline"
              type="success"
              @click="showProgressDialog"
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

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAdressDialogVisible"
      width="50%"
      @close="editAdressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAdressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAdressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <!-- 修改地址对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.vue'
import cityData from '../../assets/js/citydata.js'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      // 查询订单列表条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 订单数据列表
      orderlist: [],
      // 控制显示与隐藏修改地址对话框
      editAdressDialogVisible: false,
      // 修改地址表单数据
      addressForm: {
        address1: [],
        address2: ''
      },
      // 修改地址表单校验
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      // 省市区县数据
      cityData,
      // 控制显示与隐藏物流信息对话框
      progressDialogVisible: false,
      // 物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },

  methods: {
    // 获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        this.$message.error('获取订单列表失败！')
      }

      console.log(res)
      this.total = res.data.total
      this.orderlist = res.data.goods
    },

    // 每页显示条数变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    // 页码发生变化
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },

    // 显示修改地址对话框
    showEditAdressDialog() {
      this.editAdressDialogVisible = true
    },

    // 监听修改地址对话框关闭事件
    editAdressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },

    // 显示物流信息对话框
    async showProgressDialog() {
      // 获取物流信息
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      this.progressInfo = res.data
      console.log(this.progressInfo)
      this.progressDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
