<template>
  <div>
    <Breadcrumb title="商品管理" subTitle="参数列表" />
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader v-model="selectedCateKeys" :options="catelist" :props="cateProps" @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click='addDialogVisible=true'>添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope='scope'>
                <el-tag v-for='(item, i) in scope.row.attr_vals' :key='i' closable @close='handleClose(i,scope.row)'>
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click='showEditDialog(scope.row.attr_id)'>编辑
                </el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click='removeParams(scope.row.attr_id)'>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click='addDialogVisible=true'>添加属性
          </el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" style="width: 100%" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope='scope'>
                <el-tag v-for='(item, i) in scope.row.attr_vals' :key='i' closable @close='handleClose(i,scope.row)'>
                  {{item}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click='showEditDialog(scope.row.attr_id)'>编辑
                </el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click='removeParams(scope.row.attr_id)'>删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close='addDialogClose'>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close='editDialogClose'>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
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
        // 商品分类数据
        catelist: [],
        // 级联选择框选中的数据
        selectedCateKeys: [],
        // 级联选择框 props 数据
        cateProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 选中的 tab 页签名称
        activeName: 'many',
        // 动态参数表格数据
        manyTableData: [],
        // 静态属性表格数据
        onlyTableData: [],
        // 控制显示与隐藏添加参数对话框
        addDialogVisible: false,
        // 添加参数对话框表单数据
        addForm: {
          attr_name: ""
        },
        // 添加参数对话框表单校验规则
        addFormRules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称！',
            trigger: 'blur'
          }, ]
        },
        // 修改参数对话框的显示与隐藏
        editDialogVisible: false,
        // 修改参数表单
        editForm: {
          attr_name: ''
        },
        // 修改参数表单校验
        editFormRules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称！',
            trigger: 'blur'
          }, ]
        },
        // 切换按钮与输入框的显示
        inputVisible: false,
        // 输入框的值
        inputValue: ''
      }
    },
    computed: {
      // 动态绑定添加参数按钮是否禁用
      isBtnDisabled() {
        if (this.selectedCateKeys.length !== 3) {
          return true
        }
        return false
      },

      // 当前选中的三级分类的id
      cateId() {
        if (this.selectedCateKeys.length === 3) {
          return this.selectedCateKeys[2]
        }
        return null
      },

      // 添加参数对话框的标题
      titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }
        return '静态属性'
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 获取所有商品分类数据
      async getCateList() {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          this.$message.error('获取分类数据失败')
        }
        this.catelist = res.data
      },

      //  级联选择框发生变化，会调用这个函数
      handleChange() {
        this.getParamsData()
      },

      // tabs 页签点击的处理函数
      handleTabClick() {
        console.log(this.activeName)
        this.getParamsData()
      },

      // 获取参数列表数据
      async getParamsData() {
        if (this.selectedCateKeys.length !== 3) { // 证明显示的不是三级分类
          this.selectedCateKeys = []
          this.manyTableData = []
          this.onlyTableData = []
          return
        }
        // 显示的是三级分类，获取参数列表
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName
          }
        })

        if (res.meta.status !== 200) {
          this.$message.error('获取参数列表失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        console.log(res.data)

        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      },

      //  监听添加属性对话框的关闭事件函数
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
      },

      // 点击按钮 添加参数
      addParams() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return

          const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
            "attr_name": this.addForm.attr_name,
            "attr_sel": this.activeName
          })
          if (res.meta.status !== 201) {
            this.$message.error("添加属性失败！")
          }
          this.$message.success('添加属性成功')
          this.getParamsData()
          this.addDialogVisible = false
        })
      },

      // 显示修改参数对话框
      async showEditDialog(attr_id) {
        // 获取对应的参数信息
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: {
            attr_sel: this.activeName
          }
        })
        if (res.meta.status !== 200) {
          this.$message.error('获取参数信息失败')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },

      // 重置修改参数对话框数据
      editDialogClose() {
        this.$refs.editFormRef.resetFields()
      },

      // 点击确定，修改参数
      editParams() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })

          if (res.meta.status !== 200) {
            return this.$message.error('修改参数失败')
          }
          this.$message.success('修改参数成功')
          this.getParamsData()
          this.editDialogVisible = false
        })
      },

      // 删除参数
      async removeParams(attr_id) {
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('取消了删除')
        }

        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)

        if (res.meta.status !== 200) {
          this.$message.error('删除参数失败！')
        }

        this.$message.success('删除成功')
        this.getParamsData()
      },

      // 输入框失去焦点或点击键盘 enter 键触发
      async handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputVisible = false
          row.inputValue = ''
          return
        }
        // 如果没有 return 说名用户输入了真实的内容，需要做下一步处理
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveAttrVals(row)
      },
      // 显示输入框
      showInput(row) {
        row.inputVisible = true
        // 让文本框自动获得焦点
        // this.$nextTick() 方法的作用，当页面的元素被重新渲染后，才会调用回调函数中的代码。
        // 在这里，inputVisible 虽然改成了true ，但是页面并没有立即渲染出 input 框，所有需要等待一会
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      // 将添加或删除的参数保存到数据库
      async saveAttrVals(row) {
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })

        if (res.meta.status !== 200) {
          this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
      },
      // 删除参数
      handleClose(i, row) {
        row.attr_vals.splice(i, 1)
        this.saveAttrVals(row)
      }
    }
  }
</script>

<style lang="less" scope>
  .cat_opt {
    margin: 15px 0;
  }

  .el-tag {
    margin: 10px;
  }

  .input-new-tag {
    width: 120px !important;
  }
</style>