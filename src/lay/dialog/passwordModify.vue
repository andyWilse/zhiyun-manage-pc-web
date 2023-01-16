<template>
  <div>
    <el-dialog title="密码修改" :visible="dialogPassModify" :before-close="handleClose" width="50%">

      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="原密码:" prop="oldPass">
          <el-input v-model="form.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPass">
          <el-input v-model="form.newPass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="surePass">
          <el-input v-model="form.surePass"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSubmit">确定</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
export default {
  props: ['isactive', 'dialogPassModify', 'index_from_parent'],
  data () {
    return {
      message: '来自子组件的消息',
      oldPass:'',
      newPass:'',
      surePass:'',
      form: {
        oldPass:'',
        newPass:'',
        surePass:'',
      },
      rules: {
        newPass: [
          { required: true, message: '请输入密码', transform: value => value, trigger: 'blur' },
          {
            type: 'string',
            message: '请输入不包含空格的字符',
            trigger: 'blur',
            transform(value) {
              if (value && value.indexOf(' ') === -1) {
                return value
              } else {
                return false
              }
            }
          },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
              if (!passwordreg.test(value)) {
                callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
              }else{
                callback()
              }
            } }
        ],
        surePass: [
          { required: true, message: '请输入密码', transform: value => value, trigger: 'blur' },
          {
            type: 'string',
            message: '请输入不包含空格的字符',
            trigger: 'blur',
            transform(value) {
              if (value && value.indexOf(' ') === -1) {
                return value
              } else {
                return false
              }
            }
          },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
              if (!passwordreg.test(value)) {
                callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
              }else{
                callback()
              }
            } }
        ],

      },
    }
  },

  methods: {
    handleCancel () {
      // 对应事件cActive
      this.$emit('cActive_modify')
    },
    handleSubmit () {
     /* this.$refs[form].validate((valid) => {
             if (!valid) {
               console.log(this.form)
             }
           });*/

      this.$axios.post('/user/update/password', {
        oldPass: this.form.oldPass,
        newPass: this.form.newPass,
        surePass: this.form.surePass,

      }).then(successResponse => {
            if (successResponse.data.code=== 200) {
              this.$message.info('密码修改成功！');
              this.$router.replace({path: '/'});
            }else{
              alert(successResponse.data.result);
            }
          })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('cActive_modify') // 如果确认,就取消弹窗,
            done()
          })
          .catch(_ => {})
    },

  }
}
</script>

<style scoped>

</style>
