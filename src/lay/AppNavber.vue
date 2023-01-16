<template>
  <div class="navber">
    <!--  default-active="2"默认选中2-->
    <!--
      :router="true"表示开启路由，当开启路由后 index指向路由地址
    -->
    <el-menu
        default-active="/"
        class="el-menu-vertical-demo"

        :router="true"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
      <!-- 一级菜单 -->
      <el-submenu
          v-for="item in menuListc"
          :key="item.menuId"
          :index="item.menuId + ''"
      >
        <!-- key是给每一个vnode的唯一id-->
        <template slot="title">
          <i :class="iconsObj[item.menuId]"></i>
          <span>{{ item.menuNm }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
            v-for="subItem in item.childs"
            :key="subItem.menuId"
            :index="subItem.href + ''"
        >
          <template slot="title">
<!--            <i class="el-icon-menu"></i>-->
            <span>{{ subItem.menuNm }}</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <el-menu-item
          v-for="subItem in menuList"
          :key="subItem.menuId"
          :index="subItem.href"
      >
        <template slot="title">
<!--          <i class="el-icon-menu"></i>-->
          <span>{{ subItem.menuNm }}</span>
        </template>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      menuListc: [],
      // 左侧菜单图标数组
      iconsObj: {
        125: 'iconfont icon-iconfontuser',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
    };
  },
  // 在模板渲染成html前调用方法获取左侧菜单栏数据
  created() {
    this.getMenuList()
  },
  components: {},
  methods: {

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 访问api获取左侧菜单栏数据，把数据添加到menuList中
    async getMenuList() {
      /*const { data: res } = await this.$http.get('/menu/find')
      if (res.meta.status !== 200) {
        return this.$message.console.error(res.meta.msg)
      }
      this.menuList = res.data
      console.log(res)*/
      this.$axios.get('/menu/find', {
          }).then(successResponse => {
            if (successResponse.status === 200) {
              this.menuList=successResponse.data;//这里resp里面返回的数据是个对象，真正的数据在resp的data里；
              console.log(successResponse.data)

              this.menuList=successResponse.data.parent;
              this.menuListc=successResponse.data.children;

            }else{
              this.$fire({
                text: "后台错误，请联系管理员！",
                timer: 3000
              })
            }
          })
    },

  }
};
</script>

<style scoped>
/* border:none表示边框没有 */
.el-menu{
  border: none;
}
</style>
