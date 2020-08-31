<template>
  <div>
    <el-button type="info" @click="logout()">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      // 清除token
      window.sessionStorage.clear()
      // 重定向到login
      this.$router.push('/login')
      // 弹出消息
      this.$message('退出成功')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
