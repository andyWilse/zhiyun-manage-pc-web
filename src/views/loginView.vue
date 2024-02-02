<template>
  <div>
    <el-card class="login-form-layout">
      <el-form
        autocomplete="on"
        :model="loginForm"
        ref="loginForm"
        label-position="left">
    <!--
        <div style="text-align: center">
          <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
        </div>
    -->
        <h2 class="login-title color-main:" style="color: #2d3a6b;">瓯海宗教智治管理端</h2>
        <el-row>
            <el-form-item prop="username">
              <el-input
                name="username"
                type="text"
                v-model="loginForm.username"
                autocomplete="on"
                placeholder="请输入用户名"
                prefix-icon="el-icon-s-custom">
    <!--        <span slot="prefix">
                  <svg-icon icon-class="user" class="color-main"></svg-icon>
                </span>
    -->
              </el-input>
            </el-form-item>
        </el-row>
        <el-row>
            <el-form-item prop="password">
              <el-input
                name="password"
                :type="pwdType"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.password"
                autocomplete="on"
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
              >
    <!--
            <span slot="prefix">
                  <svg-icon icon-class="password" class="color-main"></svg-icon>
            </span>
            <span slot="suffix" @click="showPwd">
                  <svg-icon icon-class="eye" class="color-main"></svg-icon>
            </span>
    -->
              </el-input>
            </el-form-item>
        </el-row>
       <!-- <el-row>
            <el-form-item style="margin-bottom: 20px">
                <el-col :span="15">
                    <el-input
                        name="code"
                        type="text"
                        v-model="loginForm.code"
                        autocomplete="on"
                        placeholder="请输入验证码"
                        prefix-icon="el-icon-s-custom">
                    </el-input>
                </el-col>
                <el-col :span="9">
                     <el-button
                         style="width: 100%;background-color: #C1CDC1;color: black;"
                         type="primary"
                         :disabled="isSend"
                         @click.native.prevent="getCode">
                         {{send}}
                      </el-button>
                </el-col>
            </el-form-item>
        </el-row>  -->
        <el-row>
            <el-form-item style="margin-bottom: 30px">
              <el-button
                style="width: 100%"
                type="primary"
                :loading="loading"
                @click.native.prevent="handleLogin">
                登录
              </el-button>
            </el-form-item>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "loginView",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        code: ""
      },
      loading: false,
      pwdType: "password",
      send: "获取验证码",
      isSend: false,
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin () {
      this.$axios.post('/app/loginPc', {
            username: this.loginForm.username,
            password: this.loginForm.password,
            verifyCode: this.loginForm.code,
      }).then(successResponse => {
            if (successResponse.data.code === 200) {
              var token = successResponse.data.direct;
              this.$router.replace({path: '/layOut'})
              console.log("登录成功！");
              this.$store.commit('$_setToken', token);
              // localStorage.setItem("token",successResponse.data.token)
              //sessionStorage.setItem('$_setToken', token);
              //localStorage.setItem(token+'-pass', currentTime);
              //sessionStorage.clear();
            }else{
              this.$fire({
                //title: "Title",
                //type: "success",
                //text: "用户名或密码错误，请重新输入！",
                text:successResponse.data.message,
                timer: 3000
              })
            }
      }).catch(failResponse => {
            failResponse.toString()
            this.$fire({
              text: "登录失败，请重新登录！",
              timer: 3000
            })
      })
    },
    //发送验证码
    getCode() {
        this.$axios.post('/app/sendCode', {
             username: this.loginForm.username,
        }).then(successResponse => {
            if (successResponse.data.code === 200) {
                this.$message({message: '验证码发送成功！', type: 'success'});
                let self = this;
                self.isSend = true;
                var time = 300;
                var timer = setInterval(fun, 1000);
                function fun() {
                    time--;
                    if (time >= 0) {
                        self.send = time + "s后刷新";
                    } else if (time < 0) {
                        self.send = "获取验证码";
                        self.isSend = false;
                        clearInterval(timer);
                        time = 300;
                    }
                }
            }else{
              this.$fire({
                text:successResponse.data.message,
                timer: 3000
              })
            }
        }).catch(failResponse => {
                failResponse.toString()
                this.$fire({
                  text: "验证码发送失败！",
                  timer: 3000
                })
        });
    }
   /* handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(response => {
              this.loading = false;
              let code = response.data.code;
              if (code == 200) {
                this.$router.push({
                  path: "/success",
                  query: { data: response.data.data }
                });
              } else {
                this.$router.push({
                  path: "/error",
                  query: { message: response.data.message }
                });
              }
            }).catch(() => {
              this.loading = false;
            });
        } else {
          // eslint-disable-next-line no-console
          console.log("参数验证不合法！");
          return false;
        }
      });
    }*/

  }
};
</script>

<style scoped>
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-top: 40px solid steelblue;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409eff;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>
