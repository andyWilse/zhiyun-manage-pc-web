<template>

  <div>
    <el-dialog title="职员信息新增" :visible="dialogVisibleUserAdd" :before-close="handleClose" width="50%">
      <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="中文名:" prop="userNm">
              <el-input v-model="form.userNm"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录名:" prop="loginNm">
              <el-input v-model="form.loginNm"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="密码:" prop="passwords">
              <el-input v-model="form.passwords"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱:" prop="userEmail">
              <el-input v-model="form.userEmail"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
<!--          <el-col :span="12">
            <el-form-item label="工号:"  prop="userNbr">
              <el-input v-model="form.userNbr"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="电话号码:" prop="userMobile">
              <el-input v-model="form.userMobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色:" prop="identity">
              <el-select v-model="form.identity"  placeholder="----------- 请选择 -----------">
                <el-option
                    v-for="item in roleslist"
                    :key="item.roleId"
                    :label="item.roleNm"
                    :value="item.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="照片" v-show="false">
          <el-input v-model="form.userPhotoUrl"></el-input>
        </el-form-item>

        <el-form-item  prop="fileList">
          <el-row>
            <el-col>
              <h1>上传图片：</h1>
              <el-upload ref="elupload"
                         action="#"
                         multiple
                         :auto-upload="false"
                         :http-request="handleupload"
                         list-type="picture-card">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-col>
            <el-col>
              <button @click="uploadelupload" type="primary" style="padding:5px;background-color: #156AA8;color: white">点击提交</button>
            </el-col>
          </el-row>

        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleSubmit()">确定</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  props: ['dialogVisibleUserAdd'],
  data () {

    return {
      message: '来自子组件的消息',
      roleslist:[],
      fileList:[],
      form: {
        userNm: '',
        loginNm: '',
        passwords: '',
        userMobile: '',
        userEmail:'',
        userNbr:'',
        identity:''
      },
      formRules: {
        userNm:[{required: true, message: '请输入中文名称', trigger: 'blur'}],
      },
    }

  },
  created(){
    this.getRoleslist();
  },

  methods: {
    async getRoleslist(){
      this.$axios.get('/role/getRoles').then(successResponse => {
        if (successResponse.status === 200) {
          this.roleslist=successResponse.data;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },
    // $emit应是用来子组件向父组件传参的,但是,这里我只是想改变父组件中isActive为false,
    handleCancel () {
      // 对应事件cActive
      this.$emit('cActive')
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.handleSubmitPost();
        }else{
          this.$alert('填写信息有误，请重新填写后提交！');
        }
      });
    },
    handleSubmitPost(){
      this.$axios.post('/user/add', {
        userNm: this.form.userNm,
        loginNm: this.form.loginNm,
        passwords: this.form.passwords,
        userMobile: this.form.userMobile,
        userEmail: this.form.userEmail,
        userNbr: this.form.userNbr,
        identity:this.form.identity,
        userPhotoUrl: this.form.userPhotoUrl

      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$message.info({message: '新增用户信息成功！', type: 'success'});
          // 对应事件cAdd
          // &emit向父组件提交form表单
          this.$emit('cAdd', this.form)
          this.$refs.elupload.clearFiles()
        }else{
          this.$alert('新增用户失败,请联系管理员！');
        }
      })
    },


    childaddClick () {
      this.form.userNm = ''
      this.form.loginNm = ''
      this.form.passwords = ''
      this.form.userMobile = ''
      this.form.userEmail = ''
      this.form.userNbr = ''
      this.form.identity = ''
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('cActive') // 如果确认,就取消弹窗,
            done()
          })
          .catch(_ => {})
    },
    // 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
    handleupload(param) {
      this.fileList.push(param);
    },
    // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
    uploadelupload() {
      this.$refs.elupload.submit()
      let fd = new FormData()
      this.$refs.elupload.submit(); // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件

      this.fileList.forEach(item => {
        fd.append(item.file.name, item.file,item.file.name)  //将每一个文件图片都加进formdata
      })
      //formdata.append("score", 4)
      let config={
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.$axios.post(
          '/file/images/upload',
          fd,
          config
      ).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.form.picturesPath=successResponse.data.result
          this.$message({
            message: '图片上传成功，请继续操作！',
            type: 'success'
          });
        }else{
          this.$message.error('图片保存失败，请重新选择！');
        }
      })
    },

  },

}
</script>

<style scoped>

</style>
