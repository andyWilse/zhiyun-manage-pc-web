<template>
  <div>
      <el-dialog title="用户新增" :visible="dialogVisibleManagerAdd" :before-close="handleClose" width="50%">

      <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-row>
            <el-col :span="12">
                <el-form-item label="身份类型:" prop="managerTypeCd">
                    <el-select v-model="form.managerTypeCd"  clearable >
                        <el-option
                            v-for="item in managerTypeCdList"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="电话号码:" prop="managerMobile">
                    <el-input v-model="form.managerMobile"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="中文名:" prop="managerCnNm">
              <el-input v-model="form.managerCnNm"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名:" prop="managerEnNm">
              <el-input v-model="form.managerEnNm"></el-input>
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
                <el-form-item label="邮箱:" prop="managerEmail">
                    <el-input v-model="form.managerEmail"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="照片" v-show="false">
          <el-input v-model="form.managerPhotoPath"></el-input>
        </el-form-item>

        <el-form-item  prop="fileList">
          <el-row>
            <el-col>
              <el-upload ref="elupload"
                         action="#"
                         multiple
                         :auto-upload="false"
                         :http-request="handleupload"
                         list-type="picture-card">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

        <div style="padding: 0 80px;">
             <button @click="picUpload" type="primary" style="padding:5px;background-color: #156AA8;color: white">图片上传</button>
        </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleSubmit()">确定</el-button>
        </span>

      </el-dialog>
  </div>
</template>

<script>

export default {
  props: ['dialogVisibleManagerAdd'],
  data () {
    return {
      message: '来自子组件的消息',
      fileList:[],
      managerTypeCdList:[{key:'01',value:'负责人'},{key:'02',value:'管理组成员'},{key:'03',value:'工作联络员'}],
      form: {
        managerCnNm: '',
        managerEnNm: '',
        passwords: '',
        managerMobile: '',
        managerEmail:'',
        managerPhotoPath:'',
        managerTypeCd:''
      },
      formRules: {
        managerCnNm:[{required: true, message: '请输入中文名称', trigger: 'blur'}],
        passwords:[{required: true, message: '请输入密码', trigger: 'blur'}],
        managerTypeCd:[{required: true, message: '请选择身份类型', trigger: 'blur'}],
        managerMobile: [{
          required: true,
          pattern:/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
          message: "请输入正确的手机号码",
          trigger: "blur"
        }],
      },
    }

  },

  created(){
  },

  methods: {

    // $emit应是用来子组件向父组件传参的,但是,这里我只是想改变父组件中isActive为false,
    handleCancel () {
      // 对应事件cActive
      this.$emit('cActive')
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
            //图片校验
            var pictures=this.form.managerPhotoPath;
            var managerTypeCd=this.form.managerTypeCd;
            if(''===pictures ||  typeof(pictures) == "undefined"){
                this.$message.error('图片信息为空，请上传图片！');
            }else if(''===managerTypeCd ||  typeof(managerTypeCd) == "undefined"){
                this.$message.error('身份类型不能为空，请选择身份类型！');
            }else{
                this.handleSubmitPost();
            }
        }else{
          this.$alert('填写信息有误，请重新填写后提交！');
        }
      });
    },
    handleSubmitPost(){
      this.$axios.post('/manager/add', {
        managerCnNm: this.form.managerCnNm,
        managerEnNm: this.form.managerEnNm,
        passwords: this.form.passwords,
        managerMobile: this.form.managerMobile,
        managerEmail: this.form.managerEmail,
        managerPhotoPath: this.form.managerPhotoPath,
        managerTypeCd:this.form.managerTypeCd
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$message.info({message: '新增信息成功！', type: 'success'});
          this.$emit('cAdd', this.form);
          this.$refs.elupload.clearFiles()
        }else{
          let message=successResponse.data.result;
          if(''!=message && null!=message){
            this.$alert(message);
          }else{
            this.$alert('新增失败,请联系管理员！');
          }
        }
      })
    },

    childaddClick () {
      this.form.managerCnNm = ''
      this.form.managerEnNm = ''
      this.form.passwords = ''
      this.form.managerMobile = ''
      this.form.managerEmail = ''
      this.form.managerPhotoPath = ''
      this.form.managerTypeCd = ''
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
    picUpload() {
      this.$refs.elupload.submit();
      let fd = new FormData();
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
          this.form.managerPhotoPath=successResponse.data.result
          this.$message({
            message: '图片上传成功，请继续操作！',
            type: 'success'
          });
        }else{
          this.$message.error('图片保存失败，请重新选择！');
        }
      })
    },
}
}
</script>

<style scoped>

</style>
