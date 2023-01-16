<template>
  <div class="header">
    <a href>
      <img class="logo" src="@/assets/logo.png" alt width="30px" />
      <span class="company">后台管理系统</span>
    </a>

    <a href="http://localhost:8080/#/sus">
      <span class="firstClass" type="primary" icon="el-icon-s-home" >首页</span>
    </a>

<!--    <el-link type="primary" icon="el-icon-s-home" style="padding-left: 200px;color: #cccccc"
             target='_blank'
            href="http://localhost:8080/#/sus"
    >首页</el-link>-->


    <!-- 出发时间   -->
    <el-dropdown  @command="handleCommand">
      <span class="el-dropdown-link">
        系统设置
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit"  command="modiPass">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-circle-check" command="logOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <modify-item :dialog-pass-modify="isActive_modify" :index_from_parent="index_modify"
                 @cActive_modify="changeActive_modify"  ref="mymodifychild"></modify-item>
  </div>
</template>

<script>
import passwordModify from './dialog/passwordModify'

export default {
  components: {'modify-item': passwordModify},
  data() {
    return {
      isActive_modify: false,
      index_modify: 0,
    };
  },


  methods: {
    handleCommand(command){
      if("logOut"===command){
        this.$router.replace({path: '/'})
      }else if("modiPass"===command){
        this.isActive_modify = true
      }
    },
    changeActive_modify () {
      this.isActive_modify = false
    },
    handle(){

    }
  }
};
</script>


<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0 40px;
}
.company {
  position: absolute;
  color: aliceblue;
}
/* 下拉菜单展示效果 */
.el-dropdown {
  float: right;
  /* color: aliceblue; */
  margin-right: 20px;
}
.el-dropdown-link {
  color: white;
  /* 定义放上去手的形状 */
  cursor: pointer;
}

.firstClass{
  padding-left: 200px;
  color: #cccccc;
  background-color:transparent;
  border-style:none;
}
</style>
