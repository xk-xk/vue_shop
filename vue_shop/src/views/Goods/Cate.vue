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
          <el-button type="primary" icon="el-icon-edit" @click="showUpdateCateDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteCate(scope.row)">删除</el-button>
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
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
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
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->

    <el-dialog
      title="修改分类"
      :visible.sync="updateCateDialogVisible"
      width="50%"
      @close="updateCateDialogClose"
    >
      <el-form
        :model="updateCateForm"
        :rules="updateCateFormRules"
        ref="updateCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="updateCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCate">确 定</el-button>
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
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: "children",
        checkStrictly: true
      },
      // 选中的父级分类 id 的数组
      selectedKeys: [],
      // 控制修改分类对话框的显示与隐藏
      updateCateDialogVisible: false,
      // 修改对话框 form 表单信息
      updateCateForm: {
        cat_id: '',
        cat_name: ''
      },
      // 修改对话框 表单验证规则
      updateCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
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

      // console.log(res.data)
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
      this.parentCateList = res.data
    },

    // 级联选择发生变化
    parentCateChange() {
      // 如果 selectedKeys 的 length 大于 0 说明选中了父级分两类
      if (this.selectedKeys.length > 0) {
        // 父级分类 id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 分类等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 没有选中父级分类
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    // 点击确定 添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        // 校验不通过， 直接 return
        if (!valid) return
        // 校验通过，发送添加请求
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        // 添加失败，提示
        if (res.meta.status !== 200) {
          this.$message.error('添加分类失败')
        }
        // 添加成功，提示
        this.$message.success('添加分类成功')
        // 重新获取分类列表刷新
        this.getCateList()
        // 关闭对话框
        this.addCateDialogVisible = false
      })
    },

    // 监听添加分类对话框关闭事件
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },

    // 点击按钮，显示修改对话框
    showUpdateCateDialog(cateInfo) {
      // 显示对话框
      this.updateCateDialogVisible = true
      // 获取对应的分类信息,显示在输入框中
      this.updateCateForm.cat_id = cateInfo.cat_id
      this.updateCateForm.cat_name = cateInfo.cat_name
    },

    // 点击确定，修改分类
    updateCate() {
      this.$refs.updateCateFormRef.validate(async valid => {
        // 如果校验不通过， return
        if (!valid) return
        // 校验通过，发送修改分类请求
        const { data: res } = await this.$http.put(`categories/${this.updateCateForm.cat_id}`, { cat_name: this.updateCateForm.cat_name })
        // 修改失败，提示
        if (res.meta.status !== 200) {
          this.$message.error('修改分类失败')
        }
        // 修改成功，提示
        this.$message.success('修改分类成功')
        // 重新获取分类数据
        this.getCateList()
        // 关闭修改分类对话框
        this.updateCateDialogVisible = false
      })
    },

    // 监听修改分类对话框的关闭事件
    updateCateDialogClose() {
      // 清除校验
      this.$refs.updateCateFormRef.resetFields()
    },

    // 删除分类
    async deleteCate(cateInfo) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      console.log(cateInfo, confirmResult)
      // 取消删除
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除分类')
      }

      // 确认删除，提交请求
      const { data: res } = await this.$http.delete(`categories/${cateInfo.cat_id}`)

      // 删除失败提示
      if (res.meta.status !== 200) {
        this.$message.error('删除分类失败')
      }
      // 删除成功提示
      this.$message.success('删除分类成功')
      // 重新获取分类列表数据
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
