<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click.prevent="showAddOrEditDialog(undefined)">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bd-bottom', i1===0?'bd-top':'','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2===0?'':'bd-top','vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 展开列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showAddOrEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色区域 -->
    <el-dialog
      :title="title"
      :visible.sync="addOrEditDialogVisible"
      width="50%"
      @close="addOrEditDialogClose"
    >
      <el-form :model="roleForm" :rules="roleRules" ref="addOrEditRolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialog"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 控制显示添加/修改角色对话框
      addOrEditDialogVisible: false,
      // 添加/修改角色表单数据
      roleForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 添加/修改角色表单验证规则
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名！', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false }
        ]
      },
      // 添加或修改对话框标题
      title: '',
      // 控制显示分配权限对话框
      setRightDialogVisible: false,
      // 所有权限列表
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的权限
      defKeys: [],
      // 需要分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },

    // 显示添加/修改角色对话框
    showAddOrEditDialog(id) {
      if (id) {
        this.title = '修改角色'
        // 根据id获取角色信息
        this.getRoleById(id)
      } else {
        this.title = '添加角色'
      }
      this.addOrEditDialogVisible = true
    },

    // 添加/修改角色对话框关闭
    addOrEditDialogClose() {
      this.$refs.addOrEditRolesFormRef.resetFields()
    },

    // 根据 id 获取角色信息
    async getRoleById(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.roleForm = res.data
    },

    // 点击确定，添加/修改角色
    addOrEditRole() {
      this.$refs.addOrEditRolesFormRef.validate(async vaild => {
        // 准备数据
        if (!vaild) return false
        const { roleId, roleName, roleDesc } = this.roleForm
        // 添加角色
        if (this.title === '添加角色') {
          const { data: res } = await this.$http.post('roles', { roleName, roleDesc })
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          }
        } else { // 修改角色
          const { data: res } = await this.$http.put(`roles/${roleId}`, {
            roleName, roleDesc
          })
          if (res.meta.status !== 200) {
            return this.$message.error('修改角色失败')
          }
        }

        this.$message.success(`${this.title}成功`)
        this.addOrEditDialogVisible = false
        this.getRolesList()
      })
    },

    // 根据id删除角色
    async deleteRole(id) {
      const confirmResult = await this.$confirm('此操作将永久删除角色，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除角色')
      }

      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },

    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除权限，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除权限')
      }

      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

      if (res.meta.status !== 200) {
        this.$message.error('删除角色权限失败')
      }

      role.children = res.data
    },

    // 显示分配权限对话框
    async showSetRightDialog(role) {
      // 获取权限列表数据
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)

      // 递归获取三级节点的 id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },

    // 根据递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },

    // 监听分配权限对话框关闭
    setRightDialog() {
      this.defKeys = []
    },

    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })

      if (res.meta.status !== 200) {
        this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
.el-tag {
  margin: 7px;
}

.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
