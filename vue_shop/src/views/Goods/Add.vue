<template>
  <div>
    <Breadcrumb title="商品管理" subTitle="添加商品" />

    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs 标签区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps" @change="handleChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item :label='item.attr_name' v-for='(item ,i) in manyTabData' :key='item.attr_id'>
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for='(cb,i) in item.attr_vals' :key='i'></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item :label='item.attr_name' v-for='(item, i) in onlyTabData' :key='i'>
              <el-input v-model='item.attr_vals'></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers='headersObj' :on-success='handleSuccess'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 dialog -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src='previewURL' class="previewimg" />
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
        activeIndex: '0',
        // 添加商品表单数据对象
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_cat: [],
          pics: []
        },
        // 添加商品表单验证
        addFormRules: {
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' }
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
          goods_cat: [
            { required: true, message: '请选择商品分类', trigger: 'blur' }
          ]
        },
        // 商品分类数据
        catelist: [],
        cateProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 动态参数列表数据
        manyTabData: [],
        // 静态属性数据
        onlyTabData: [],
        // 上传图片的地址
        uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
        // 上传图片请求头
        headersObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        // 预览图片的地址
        previewURL: '',
        // 控制显示图片预览 dialog 的显示与隐藏
        previewVisible: false
      }
    },
    computed: {
      cateId() {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        }
        return null
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 获取商品分类数据
      async getCateList() {
        const { data: res } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类列表数据失败')
        }

        this.catelist = res.data
      },

      // 商品分类级联选择器触发事件
      handleChange() {
        if (this.addForm.goods_cat.length !== 3) { // 证明显示的不是三级分类
          this.addForm.goods_cat = []
          return
        }
      },

      // tab 标签点击 离开之前触发事件
      beforeTabLeave(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类！')
          return false
        }
      },

      // tab 标签点击事件
      async tabClicked() {
        console.log(this.activeIndex)
        if (this.activeIndex === '1') {
          // 获取动态参数列表
          const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: { sel: 'many' }
          })

          if (res.meta.status !== 200) {
            this.$message.error('获取动态参数失败')
          }
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTabData = res.data
        } else if (this.activeIndex === '2') {
          // 获取静态属性数据
          const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: { sel: 'only' }
          })

          if (res.meta.status !== 200) {
            return this.$message.error('获取静态属性失败!')
          }

          this.onlyTabData = res.data
          console.log(this.onlyTabData)
        }
      },

      // 上传图片预览事件
      handlePreview(file) {
        this.previewURL = file.response.data.url
        this.previewVisible = true
      },

      // 图片移除事件
      handleRemove(file) {
        // 1. 获取去将要删除的图片的临时路径
        const filePath = file.response.data.tmp_path
        // 2. 根据路径，从 pics 中找到这个图片对应的索引值
        const i = this.addForm.pics.findIndex(x => x.pic === filePath)
        // 3. 调用数组的 splice 的方法，把图片信息对象从 pics 数组中删除
        this.addForm.pics.splice(i, 1)
      },

      // 图片上传成功事件
      handleSuccess(response) {
        // 1. 将上传成功的图片路径拼接成一个需要添加的图片对象
        const picInfo = {
          pic: response.data.tmp_path
        }
        // 2. 将对象添加到 pics 数组中
        this.addForm.pics.push(picInfo)
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  .previewimg {
    width: 100%;
  }
</style>