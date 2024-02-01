<template>
  <div>
      <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-row>
            <el-col :span="6">
                <el-form-item label="中文名:" prop="managerCnNm">
                    <el-input v-model="form.managerCnNm"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="6">
                <el-form-item label="登录名:" prop="managerEnNm">
                    <el-input v-model="form.managerEnNm"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="6">
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

            <el-col :span="6">
                <el-form-item label="邮箱:" prop="managerEmail">
                    <el-input v-model="form.managerEmail"></el-input>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="密码:" prop="passwords">
              <el-input v-model="form.passwords" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
              <el-form-item label="证件类型:" prop="certTypeCd" >
                <el-select v-model="form.certTypeCd"  clearable>
                  <el-option
                      v-for="item in certTypeCdArr"
                      :key="item.dictCd"
                      :label="item.dictCnDesc"
                      :value="item.dictCd"/>
                </el-select>
              </el-form-item>
          </el-col>

          <el-col :span="12">
              <el-form-item label="证件号码:" prop="certNbr">
                  <el-input v-model="form.certNbr"></el-input>
              </el-form-item>
          </el-col>
        </el-row>

         <el-row>
             <el-col :span="6">
                 <el-form-item label="电话号码:" prop="managerMobile">
                     <el-input v-model="form.managerMobile"></el-input>
                 </el-form-item>
             </el-col>
         </el-row>

        <el-form-item label="照片" v-show="false">
            <el-input v-model="form.managerPhotoPath"></el-input>
        </el-form-item>

        <el-form-item  prop="fileList">
          <el-row>
            <el-col>
               <el-upload
                 action="http://183.246.59.33:8081/api/file/images/upload"
                 list-type="picture-card"
                 :on-preview="handlePictureCardPreview"
                 :on-success="imgSuccess"
                 :on-error="imgError"
                 :on-remove="imgRemove"
                 :file-list="fileList">
                 <i class="el-icon-plus"></i>
               </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <div style="position:absolute;right:100px;">
        <el-button @click="handleCancel" type="warning">取消</el-button>
        <el-button @click="handleSubmit()" type="primary">确定</el-button>
      </div>
  </div>
</template>

<script>
import global from '../global.vue'

export default {
  components: {
  },
  data () {
    return {
        message: '来自子组件的消息',
        imageUrl: global.httpUrl,
        certTypeCdArr:[],
        fileRemove:'',
        fileUpload:'',
        fileList:[],
        form: {
            managerPhotoPath:'',
        },
        managerTypeCdList:[{key:'01',value:'负责人'},{key:'02',value:'管理组成员'},{key:'03',value:'工作联络员'}],
        formRules: {
            managerCnNm:[{required: true, message: '请输入中文名称', trigger: 'blur'}],
            certNbr: [{ required: true, message: '请输入有效证件号码', trigger: 'blur' }],
            passwords:[{required: true, message: '请输入密码', trigger: 'blur'}],
            //pattern:/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
            managerMobile: [{
              required: true,
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }],
       },
    }
  },
  created(){
        this.getCertTypeCd();
  },
  //方法
  methods: {
        //证件类型
        getCertTypeCd(){
            this.$axios.get('/dict/getSysDict', {
                params: {
                    dictTypeCd: '3010',
                }
            }).then(successResponse => {
                if (successResponse.data.code === 200) {
                    this.certTypeCdArr=successResponse.data.resultArr;
                }else{
                    let message=successResponse.data.message;
                    this.$message({message: message,type: 'warning'});
                }
            })
        },
        // 删除图片
        imgRemove(file, fileList) {
            let remove=file.response.result;
            this.fileRemove=this.fileRemove+remove+',';
        },
        // 上传失败
        imgError(res) {
            this.$message({type: "error", message: "图片上传失败",});
        },
        handlePictureCardPreview(file) {
            console.log(file);
        },
        // 上传成功
        imgSuccess(res, file, fileList) {
            this.imageUrl = URL.createObjectURL(file.raw);
            //重点  得到上传图片的名字
            this.form.managerPhotoPath=this.form.managerPhotoPath+res.result+',';
        },
        //取消
        handleCancel () {
          this.$router.replace({path: '/managerIndex'});
        },
        //新增提交校验
        handleSubmit () {
            var managerTypeCd=this.form.managerTypeCd;
            var certTypeCd=this.form.certTypeCd;
            this.$refs.form.validate(valid => {
                if(''===managerTypeCd ||  typeof(managerTypeCd) == "undefined"){
                    this.$message.error('身份类型不能为空，请选择身份类型！');
                }else if(''===certTypeCd ||  typeof(certTypeCd) == "undefined"){
                    this.$message.error('证件类型不能为空，请选择证件类型！');
                }else if (valid) {
                     this.handleSubmitPost();
                }else{
                    this.$alert('填写信息有误，请重新填写后提交！');
                }
           });
        },
        //新增提交
        handleSubmitPost(){
            this.$axios.post('/manager/add', {
                managerCnNm: this.form.managerCnNm,
                managerEnNm: this.form.managerEnNm,
                managerMobile: this.form.managerMobile,
                managerEmail: this.form.managerEmail,
                certTypeCd: this.form.certTypeCd,
                certNbr: this.form.certNbr,
                managerPhotoPath:this.form.managerPhotoPath,
                picturesPathRemove: this.fileRemove,
                passwords:this.form.passwords,
                managerTypeCd:this.form.managerTypeCd,
            }).then(successResponse => {
                if (successResponse.data.code === 200) {
                    this.$message({message: '新增场所负责人成功！', type: 'success'});
                    this.$router.replace({path: '/managerIndex'});
                }else{
                    let message=successResponse.data.message;
                    this.$message({message: message,type: 'warning'});
                }
            })
        },
  },

}
</script>

<style scoped>

</style>
