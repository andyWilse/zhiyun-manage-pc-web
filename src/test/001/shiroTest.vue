<template slot-scope="scope">
<div>
    <el-form :model="loginForm">
<el-button  @click="login" :disabled="isClick">登录</el-button>
<el-button  @click="hello" :disabled="isClick">你好</el-button>
</el-form>
  </div>
</template>


<script>

  export default {
    data() {
      return {
        dataForm: {
          id: 0,
          noticeId: '',
          attachName: '',
          attachUrl: '',
        },

      }
    },
    methods:{
          login () {
          this.$axios.get('/index').then(successResponse => {
                  if (successResponse.status === 200) {
                    this.venueslist=successResponse.data;
                  }else{
                    this.$router.replace({path: '/'});
                  }
                })
          },
          hello () {
          this.$axios.get('/hello').then(successResponse => {
                  if (successResponse.status === 200) {
                    this.venueslist=successResponse.data;
                  }else{
                    this.$router.replace({path: '/error'})
                  }
                })
                    },
      }
  }
</script>

