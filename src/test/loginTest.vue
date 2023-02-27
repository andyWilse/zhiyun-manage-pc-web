<template>
  <div>
    <el-form :model="loginForm">
      <el-form-item label="手机号">
        <el-input type="text" v-model="loginForm.username" style="width: 200px"></el-input>
      </el-form-item>
      <div class="login_box">
        <el-input type="text" v-model="loginForm.code" aria-placeholder="请输入验证码" style="width: 200px"></el-input>
        <el-button  @click="postCode" :disabled="isClick">{{content}}</el-button>
      </div>

              <el-button  @click="login" :disabled="isClick">登录</el-button>

    </el-form>
  </div>
</template>
<script>
//这是我封装的axios的方法，各位自己写即可

export default {
  name: "Login",
  data(){
    return{
      loginForm: {
        code:'',
        username:''
      },
      content: '发送验证码',  // 按钮里显示的内容
      totalTime: 60,      //记录具体倒计时时间
      isClick:false		//是否可以点击
    }
  },
  methods:{
  //发送验证码
    postCode(){
        this.$axios.get('/app/sendVerifyCode', {
        params: {
            telPhone:this.loginForm.username
        }
      }).then(successResponse => {
        if (successResponse.status === 200) {
          this.venueslist=successResponse.data;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
      //这是60秒倒计时
      //this.countDown()
    },

    login(){
            this.$axios.post('/app/loginIn',
                   { username:'176',
                    password:'1'}
            ).then(successResponse => {
            if (successResponse.status === 200) {
              this.venueslist=successResponse.data;
            }else{
              this.$router.replace({path: '/error'})
            }
          })
        },
    //这是60秒倒计时
    countDown () {
      this.content = this.totalTime + 's后重新发送' //这里解决60秒不见了的问题
      let clock = window.setInterval(() => {
        this.totalTime--
        this.content = this.totalTime + 's后重新发送'
        this.isClick=true
        if (this.totalTime < 0) {     //当倒计时小于0时清除定时器
          window.clearInterval(clock)
          this.content = '重新发送验证码'
          this.totalTime = 60
          this.isClick=false
        }
      },1000)
      console.log(111)
    }
  },
  computed:{
  }
}
</script>
