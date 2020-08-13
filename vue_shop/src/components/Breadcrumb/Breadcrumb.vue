<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{subTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    title: String,
    subTitle: String
  }
}
</script>

<style lang="less" scoped>
</style>
