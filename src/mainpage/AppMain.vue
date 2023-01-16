<template>
  <div class="main">
    <el-main>
      <router-view></router-view>
    </el-main>

  </div>

</template>

<script>
export default {
  name: "AppMain"
}
</script>

<style scoped>
.main {
  position: absolute;
  left: 200px;
  /* 内部框框距离 */
  top: 50px;
  padding: 10px;
  right: 0px;
  overflow-y: auto;
  bottom: 0px;
  /* background-color: rebeccapurple; */
}
</style>