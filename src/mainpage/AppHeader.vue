<template>
  <div class="header">
    <a href>
      <img class="logo" src="@/assets/manage.png" alt width="30px" />
      <span class="company">后台管理系统</span>
    </a>

    <router-link to="/firstPage">
      <img class="firstLogo" src="@/assets/first.png" alt width="80px" />
    </router-link>
    <a class="userClass">
         <span class="conClass" style="display:inline-block;width:220px;font-weight:bold;">{{userName}}</span>
    </a>
    <!-- 出发时间   -->
    <el-dropdown  @command="handleCommand">
      <span class="el-dropdown-link">
        系统设置
       <!-- <i class="el-icon-arrow-down el-icon--right"></i>-->
           <img class="initLogo" src="@/assets/init.png" alt width="15px" />
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
      userName:'',
    };
  },
    created() {
        this.getUser();
    },
  methods: {
    handleCommand(command){
      if("logOut"===command){
            this.$axios.post('/logout')
            .then(successResponse => {
                    if (successResponse.data.code === 200) {
                      this.$store.commit('$_removeStorage');    // 清除登录信息
                      this.$router.replace({path: '/'});
                    }else{
                      this.$router.replace({path: '/'})
                    }
                  })
      }else if("modiPass"===command){
        this.isActive_modify = true
      }
    },

    getUser(){
          this.$axios.get('/user/getUser')
          .then(successResponse => {
              if (successResponse.data.code === 200) {
                let userNm= successResponse.data.result[0].userNm;
                let identityCn= successResponse.data.result[0].identityCn;
                this.userName=userNm+'('+identityCn+')';
              }else{

              }
          })
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
.firstLogo {
  vertical-align: middle;
  padding: 0px 10px 0 150px;
}
.initLogo{
  vertical-align: middle;
  padding: 0px 10px 0 10px;
}
/* aliceblue */
.company {
  position: absolute;
  color: #156AA8;
}
/* 下拉菜单展示效果 */
.el-dropdown {
  float: right;
  /* color: aliceblue; */
  margin-right: 20px;
}
.el-dropdown-link {
  color: #grey;
  /* 定义放上去手的形状pointer */
  cursor: pointer;
}
/* transparent
.firstClass{
  padding-left: 0px;
  color: #156AA8;
  background-color:transparent;
  border-style:none;

}
*/


.userClass{
    padding: 0px 10px 0 860px;

}
</style>
