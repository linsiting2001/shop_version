<template>
  <div>
      <el-button type='info' @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        // 实现退出的功能
        logout() {
            //清空sessionStorage中的token值
            window.sessionStorage.clear();
            //重定向到登录页
            this.$router.push('/login');
        }
    }

}
</script>

<style lang="less" scoped>

</style>