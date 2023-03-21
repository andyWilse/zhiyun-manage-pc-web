<template>

  <div>
    <el-dialog title="职员信息新增" :visible="dialogVisibleStaffAdd" :before-close="handleClose" width="50%">
      <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
      <el-form-item label="religious" prop="religious" v-show="false">
        <el-input v-model="form.religious" class="religiousclass"></el-input>j
      </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="中文名:" prop="staffName">
              <el-input v-model="form.staffName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教派类别:" prop="religiousSect">
              <el-select v-model="form.religiousSect" @change="selectChanged" clearable >
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
            <el-form-item label="职位:"  prop="staffPost">
              <el-select v-model="form.staffPost"  clearable>
                <el-option
                    v-for="item in staffPostList"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码:" prop="staffTelphone">
              <el-input v-model="form.staffTelphone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
          <el-form-item label="证件类型:" prop="certTypeCd" >
            <el-select v-model="form.certTypeCd"  clearable>
              <el-option
                  v-for="item in certTypeCdArr"
                  :key="item.dictCd"
                  :label="item.dictCnDesc"
                  :value="item.dictCd"
              />
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="证件号码:" prop="certNbr">
            <el-input v-model="form.certNbr"></el-input>
          </el-form-item>
          </el-col>
        </el-row>
<!--        label-width="120px"-->
        <el-row>
          <el-form-item label="宗教场所:" prop="venuesAddres">
            <el-select v-model="form.venuesAddres"  clearable>
              <el-option
                  v-for="item in venueslist"
                  :key="item.venuesId"
                  :label="item.venuesAddres"
                  :value="item.venuesId"
              />
            </el-select>
          </el-form-item>
        </el-row>

        <el-form-item label="照片" v-show="false">
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
              <button @click="uploadelupload" type="primary" style="background-color: #156AA8;color: white">点击提交</button>
            </el-col>
          </el-row>

        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleSubmit('form')">确定</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  props: ['dialogVisibleStaffAdd'],
  data () {

    return {
      message: '来自子组件的消息',
      religiousSects:[],
      certTypeCdArr:[],
      venueslist:[],
      staffPostList:[
        {"name":"普通职员","key":1},
        {"name":"管理","key":2}
      ],
      fileList:[],
      form: {
        staffName: '',
        religiousSect: '',
        staffPost: '',
        staffTelphone: '',
        certTypeCd:'',
        certNbr:'',
        relVenuesId:''
      },
      formRules: {
        staffName:[{required: true, message: '请输入中文名称', trigger: 'blur'}],
        certNbr: [{ required: true, message: '请输入有效证件名称', trigger: 'blur' }],
        religiousSect: [{ required: true, message: '请选择宗教类别', trigger: 'change' }],
      },
    }

  },
  created(){
    //this.getReligiousSect();
    //this.getCertTypeCd();
    //this.getVenueslist();
  },

  methods: {
    getVenueslist(){
      this.$axios.get('/venues/getStaffVenues', {
        params: {
            search:''
        }
      }).then(successResponse => {
        if (successResponse.status === 200) {
          this.venueslist=successResponse.data;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },
   getCertTypeCd(){
      this.$axios.get('/dict/getSysDict', {
        params: {
          dictTypeCd: '3010',
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.certTypeCdArr=successResponse.data.resultArr;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },
    async getReligiousSect(){
      this.$axios.get('/dict/getSysDict', {
        params: {
          dictTypeCd: '1001',
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.religiousSects=successResponse.data.resultArr;
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
      this.$axios.post('/staff/add', {
        staffName: this.form.staffName,
        religiousSect: this.form.religiousSect,
        staffPost: this.form.staffPost,
        staffTelphone: this.form.staffTelphone,
        certTypeCd: this.form.certTypeCd,
        certNbr: this.form.certNbr,
        relVenuesId:this.form.venuesAddres,
        staffPicture: this.form.picturesPath,

      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$message.info({message: '新增职员信息成功！', type: 'success'});
          // 对应事件cAdd
          // &emit向父组件提交form表单
          this.$emit('cAdd', this.form)
          this.$refs.elupload.clearFiles()

        }else{
          this.$alert('新增职员失败,请联系管理员！');
        }
      })
    },


    childaddClick () {
      this.form.staffName = ''
      this.form.religiousSect = ''
      this.form.staffPost = ''
      this.form.staffTelphone = ''
      this.form.certTypeCd = ''
      this.form.certNbr = ''
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('cActive') // 如果确认,就取消弹窗,
            done()
          })
          .catch(_ => {})
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
