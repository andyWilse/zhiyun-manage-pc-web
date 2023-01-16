<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单 -->
        <el-menu
            background-color="#042a3d"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
        >

          <el-submeu index="1" >
            <template slot="title"><i class="el-icon-message"></i>导航一</template>
            <el-menu-item-group>
              <!--<template slot="title">分组一</template>-->
              <!--设置index-->
              <el-menu-item index="/userIndex">测试1</el-menu-item>
<!--              <el-menu-item index="/userIndex">测试2</el-menu-item>
              &lt;!&ndash;<el-menu-item-group title="分组2">&ndash;&gt;
              <el-menu-item index="/userIndex">测试3</el-menu-item>
              <el-menu-item index="/userIndex">测试4</el-menu-item>-->
              <!--
              <el-submenu index="1-4">
                <template slot="title">测试5</template>
                <el-menu-item index="1-4-1">选项4-1</el-menu-item>
              </el-submenu>
              -->
            </el-menu-item-group>
          </el-submeu>
          <!-- 一级菜单 -->
<!--          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            &lt;!&ndash; 二级菜单 &ndash;&gt;
            <el-menu-item index="/userIndex">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一的二级菜单</span>
              </template>
            </el-menu-item>
          </el-submenu>-->
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    // 退出登陆，清除Token，返回login
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
/* 头部区域 */
.el-header {
  background-color: #363d41;
  display: flex;
  justify-content: space-between; /* 均匀排列每个元素,首个元素放置于起点,末尾元素放置于终点 */
  padding-left: 0;
  align-items: center; /* 上下居中 */
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #042a3d;
}
.el-main {
  background-color: #e8ebec;
}
</style>

