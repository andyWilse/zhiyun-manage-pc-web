<template>

    <div>
      <el-dialog title="场所基本信息新增" :visible="dialogVisibleVenuesAdd" :before-close="handleClose" width="50%">
        <el-form ref="form" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="religious" prop="religious" v-show="false">
          <el-input v-model="form.religious" class="religiousclass"></el-input>j
        </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="场所名称" prop="venuesName">
                <el-input v-model="form.venuesName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教派类别" prop="religiousSect">
                <el-select v-model="form.religiousSect" @change="selectChanged" placeholder="----------- 请选择 -----------">
                  <el-option
                      v-for="item in religiousSects"
                      :key="item.dictCd"
                      :label="item.dictCnDesc"
                      :value="item.dictCd"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
              <el-col :span="12">
                <el-form-item label="登记证号"  prop="registerNbr">
                  <el-input v-model="form.registerNbr"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="场所电话" prop="venuesPhone">
                  <el-input v-model="form.venuesPhone"></el-input>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="负责人" prop="responsiblePerson">
                <el-input v-model="form.responsiblePerson"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联络员" prop="liaisonMan">
                <el-input v-model="form.liaisonMan"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="所属机构" prop="organization">
                <el-input v-model="form.organization"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="场所地址" prop="venuesAddres">
                <el-input v-model="form.venuesAddres"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="简介:" prop="briefIntroduction">
                <el-input v-model="form.briefIntroduction"
                          placeholder="请填写"
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="照片1" v-show="false">
                <el-input v-model="form.picturesPath"></el-input>
          </el-form-item>

          <el-form-item  prop="fileList">
            <el-row>
              <el-col>
                <h1>上传图片：</h1>
                <el-upload ref="elupload"
                           action=""
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
  props: ['dialogVisibleVenuesAdd'],
  data () {
    return {
      message: '来自子组件的消息',
      religiousSects:[],
      fileList:[],
      form: {
        venuesName: '',
        religiousSect: '',
        registerNbr: '',
        venuesPhone : '',
        organization: '',
        venuesAddres: '',
        responsiblePerson:'',
        liaisonMan : '',
        briefIntroduction :'',
        picturesPath:'',
      },
      formRules: {
        venuesName:[{required: true, message: '请输入场所名称', trigger: 'blur'}],
        organization: [{ required: true, message: '请输入所属机构', trigger: 'blur' }],
        religiousSect: [{ required: true, message: '请选择宗教类别', trigger: 'change' }],
        // 验证手机号
        venuesPhone: [{
          required: true,
          pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
          message: "请输入正确的手机号码",
          trigger: "blur"

        }],

    },
    }

  },
  created(){
    this.getReligiousSect();
  },

methods: {
  async getReligiousSect(){
    this.$axios.get('/dict/getSysDicts', {
      params: {
        dictTypeCd: '1001',
      }
    }).then(successResponse => {
      if (successResponse.status === 200) {
        this.religiousSects=successResponse.data;
      }else{
        this.$router.replace({path: '/error'})
      }
    })
  },
    handleCancel () {
      this.$emit('cActive') // $emit应是用来子组件向父组件传参的,但是,这里我只是想改变父组件中isActive为false,
      // 对应事件cActive
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
    this.$axios.post('/venues/add', {
      venuesName: this.form.venuesName,
      religiousSect: this.form.religiousSect,
      registerNbr: this.form.registerNbr,
      venuesPhone: this.form.venuesPhone,
      organization: this.form.organization,
      venuesAddres: this.form.venuesAddres,
      picturesPath: this.form.picturesPath,
      responsiblePerson: this.form.responsiblePerson,
      liaisonMan: this.form.liaisonMan,
      briefIntroduction: this.form.briefIntroduction
    }).then(successResponse => {
          if (successResponse.data.code === 200) {
            this.$message.info({message: '新增场所成功！', type: 'success'});
            // 对应事件cAdd
            // &emit向父组件提交form表单
            this.$emit('cAdd', this.form)
            this.$refs.elupload.clearFiles()
          }else{
            this.$alert('新增场所失败,请联系管理员！');
            /*this.messageWarn("新增场所失败,请联系管理员！","");*/
          }
        })
  },

    childaddClick () {
      this.form.venuesName = '';
      this.form.religiousSect = '';
      this.form.registerNbr = '';
      this.form.venuesPhone = '';
      this.form.organization = '';
      this.form.venuesAddres = '';
      this.form.responsiblePerson = '';
      this.form.liaisonMan = '';
      this.form.briefIntroduction = '';
      this.form.picturesPath = '';
    },
    handleClose (done) {
      this.messageWarn('确认关闭？',done);
    },
    handleupload(param) {
      this.fileList.push(param);// 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
    },
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
    // 如果确认,就取消弹窗
    messageWarn(message,done){
      this.$confirm(message).then(_ => {this.$emit('cActive') ,done()}).catch(_ => {});
    },
    selectChanged(params) {
        this.religiousSects.map(item => {
            if(item.dictCd == params){
                this.form.religious = item.dictCnDesc
            }
        })
     },
  },

}
</script>

<style scoped>

</style>
