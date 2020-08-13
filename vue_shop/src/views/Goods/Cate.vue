<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb title="商品管理" subTitle="商品分类" />

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
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
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
      <!-- 添加分类 form 表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类："></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 需要添加的分类的表单对象
      addCateForm: {
        // 父级分类id
        cat_pid: 0,
        // 需要添加的分类名称
        cat_name: '',
        // 分类层级，默认添加一级分类
        cat_level: 0
      },
      // 添加分类表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: []
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
    },

    // 监听分页器 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },

    //监听分页器 pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },

    // 显示添加分类对话框
    showAddCateDialog() {
      // 获取父级分类列表
      this.getParentCateList()
      // 再显示对话框
      this.addCateDialogVisible = true
    },

    //
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        this.$message.error('获取父级分类失败')
      }

      console.log(res.data)
      this.parentCateList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>
