<template>
  <div class="navBer">
    <!--  default-active="2"默认选中2-->
    <!--
      :router="true"表示开启路由，当开启路由后 index指向路由地址
    -->
    <el-menu
        :default-active="$route.path"
        :default-openeds="openedArr"
        class="el-menu-vertical-demo"
        :router="true"
        @open="handleOpen"
        @close="handleClose"
        background-color="#156AA8"
        text-color="#fff"
        active-text-color="#ffd04b"

    >
      <!-- 一级菜单 -->
      <el-submenu
          v-for="item in menuListChild"
          :key="item.menuId"
          :index="item.menuId + ''">

        <!-- key是给每一个vnode的唯一id-->
        <template slot="title">
          <img :src="require('@/assets/'+item.iconNm)">
          <span>{{ item.menuNm }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
            v-for="subItem in item.childs"
            :key="subItem.menuId"
            :index="subItem.href + ''">

          <template slot="title">
<!--            <i class="el-icon-menu"></i>-->
            <span>{{ subItem.menuNm }}</span>
          </template>
        </el-menu-item>
      </el-submenu>

        <el-menu-item   v-for="subItem in menuList"
                        :key="subItem.menuId"
                        :index="subItem.href">
            <img :src="require('@/assets/'+subItem.iconNm)">
            <span>{{ subItem.menuNm }}</span>
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
      menuListChild: [],
      openedArr: ['1001'],
    };
  },
  // 在模板渲染成html前调用方法获取左侧菜单栏数据
  created() {
    this.getMenuList()
  },
  components: {},
  methods: {
    handleOpen(key, keyPath) {
      this.activeDefault = keyPath;
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 访问api获取左侧菜单栏数据，把数据添加到menuList中
    async getMenuList() {
      this.$axios.get('/menu/find', {
          }).then(successResponse => {
            if (successResponse.data.code === 200) {
              console.log(successResponse.data.data)
              this.menuList=successResponse.data.data.parent;
              this.menuListChild=successResponse.data.data.children;
              //按钮权限
              let buttonArr=successResponse.data.data.button;
              this.buttonGrand(buttonArr);
            }else{
              this.$fire({
                text: successResponse.data.Message,
                timer: 3000
              });
              this.$router.replace({path: '/'});
            }
          })
    },
    
    buttonGrand(buttonArr){
              this.$gloMsg.veAdd= "none";
              this.$gloMsg.veMod= "none";
              this.$gloMsg.veDel= "none";

              this.$gloMsg.staffQue= "none";
              this.$gloMsg.staffDel= "none";

              this.$gloMsg.manaAdd="none";
              this.$gloMsg.manaMod= "none";
              this.$gloMsg.manaDel= "none";
              //this.$gloMsg.manaQue= "none";

              this.$gloMsg.newsAdd= "none";
              this.$gloMsg.newsDel= "none";
              this.$gloMsg.newsMod= "none";

              this.$gloMsg.userAdd= "none";
              this.$gloMsg.userMod= "none";
              this.$gloMsg.userDel= "none";
              this.$gloMsg.userGra= "none";
              this.$gloMsg.userPass= "none";

              for(var i=0;i<buttonArr.length;i++){
                let but=buttonArr[i].menuId;
                if(1001000101===but){
                    this.$gloMsg.veAdd='';
                }else if(1001000102===but){
                    this.$gloMsg.veMod='';
                }else if(1001000103===but){
                    this.$gloMsg.veDel='';
                }else if(1001000202===but){
                    this.$gloMsg.staffQue='';
                }else if(1001000201===but){
                    this.$gloMsg.staffDel='';
                }else if(1001000301===but){
                    this.$gloMsg.manaAdd='';
                }else if(1001000302===but){
                    this.$gloMsg.manaMod='';
                }else if(1001000303===but){
                    this.$gloMsg.manaDel='';
                }else if(1007000101===but){
                    this.$gloMsg.newsAdd='';
                }else if(1007000102===but){
                    this.$gloMsg.newsMod='';
                }else if(1007000103===but){
                    this.$gloMsg.newsDel='';
                }else if(1002000101===but){
                    this.$gloMsg.userAdd='';
                }else if(1002000102===but){
                    this.$gloMsg.userMod='';
                }else if(1002000103===but){
                    this.$gloMsg.userDel='';
                }else if(1002000104===but){
                    this.$gloMsg.userPass='';
                }else if(1002000105===but){
                    this.$gloMsg.userGra='';
                }
              }
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
