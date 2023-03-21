<template>
    <div>
        <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-form-item label="religious" prop="religious" v-show="false">
          <el-input v-model="form.religious" class="religiousclass"></el-input>
        </el-form-item>

        <el-row :gutter="24">
            <el-col :span="7">
              <el-form-item label="场所名称" prop="venuesName">
                <el-input v-model="form.venuesName" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="教派类别" prop="religiousSect">
                <el-select v-model="form.religiousSect" @change="selectChanged" clearable>
                  <el-option
                      v-for="item in religiousSects"
                      :key="item.dictCd"
                      :label="item.dictCnDesc"
                      :value="item.dictCd"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="所属机构" prop="organization" >
                   <region-selects
                      :town="true"
                      v-model="regions"
                      @change="regionChange"
                      clearable/>
               </el-form-item>
            </el-col>

        </el-row>

        <el-row :gutter="24">
            <el-col :span="7">
              <el-form-item label="场所电话" prop="venuesPhone">
                <el-input v-model="form.venuesPhone" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="17">
               <el-form-item label="场所地址" prop="venuesAddres">
                 <el-input v-model="form.venuesAddres" clearable></el-input>
               </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter="24">
            <el-col :span="7">
                <el-form-item label="登记证号"  prop="registerNbr">
                  <el-input v-model="form.registerNbr" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="管理组成员" prop="groupMembers">
                  <el-input v-model="form.groupMembers" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="3">
                <el-button class="groClass" icon="el-icon-circle-plus-outline" type="primary" @click="addGroClick" v-show="groShow">添加管理组成员</el-button>
            </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="7">
            <el-form-item label="负责人" prop="responsiblePerson">
              <el-input v-model="form.responsiblePerson" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
              <el-button class="fzClass" icon="el-icon-circle-plus-outline" type="primary" @click="addClick" v-show="fzShow">添加负责人</el-button>
          </el-col>
           <el-col :span="7">
              <el-form-item label="工作联络员" prop="liaisonMan">
                  <el-input v-model="form.liaisonMan" clearable></el-input>
                </el-form-item>
          </el-col>
           <el-col :span="3">
              <el-button class="liaClass" icon="el-icon-circle-plus-outline" type="primary" @click="addLiaClick" v-show="liaShow">添加工作联络员</el-button>
           </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-button class="staffClass" icon="el-icon-circle-plus-outline" type="primary" @click="staffClick">选择教职人员</el-button>
              <el-col :span="20">
                <el-form-item label="教职人员:" prop="venusesStaff">
                  <el-input readonly v-model="form.venusesStaff" clearable ></el-input>
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
                        >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="照片1" v-show="false">
                <el-input v-model="form.picturesPath"></el-input>
          </el-form-item>

          <el-form-item  prop="fileList">
            <el-row>
              <el-col>
              <!-- <el-upload ref="elUpload"
                                          action=""
                                          multiple
                                          :auto-upload="false"
                                          :http-request="handleUpload"
                                          :on-success="imgSuccess"
                                          list-type="picture-card">
                                 <i class="el-icon-plus"></i>
                               </el-upload>  -->
                <el-upload
                   action="http://localhost:8081/api/file/images/upload"
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

        <add-item :dialog-visible-manager-add="isActive" @cActive="changeActive" @cAdd="handleAdd" ref="myaddchild"></add-item>
        <staff-item :dialog-visible-staff="isActive_staff" @cActive_staff="changeActive_staff" @cStaff="handleStaff" ref="myStaffChild">
        </staff-item>
    </div>
</template>

<script>
import { RegionSelects } from 'v-region';
import managerAdd from './managerAdd'
import staffSelect from './StaffSelect'

export default {
  components: {
      RegionSelects,
      'add-item': managerAdd,
      'staff-item': staffSelect,
  },
  data () {
    return {
      message: '来自子组件的消息',
      isActive_staff: false,
      isActive: false,
      fzShow : false,
      liaShow : false,
      groShow : false,
      selectedOptions: [],
      religiousSects:[],
      fileRemove:'',
      fileUpload:'',
      fileList:[],
      staffIds:'',
      region:'',
      regions: {
          province: '330000',
          city: '330300',
          area: '330304',
          town: ''
      },
      form: {
        venuesName: '',
        religiousSect: '',
        registerNbr: '',
        venuesPhone : '',
        organization: '',
        venuesAddres: '',
        responsiblePerson:'',
        liaisonMan : '',
        groupMembers:'',
        briefIntroduction :'',
        picturesPath:'',
      },
      formRules: {
        venuesName:[{required: true, message: '请输入场所名称', trigger: 'blur'}],
        //organization: [{ required: true, message: '请输入所属机构', trigger: 'blur' }],
        religiousSect: [{ required: true, message: '请选择宗教类别', trigger: 'change' }],
        registerNbr: [{ required: true, message: '请输入等级证号', trigger: 'change' }],
        responsiblePerson: [{ required: true, message: '请输入负责人', trigger: 'change' }],
        venuesAddres: [{ required: true, message: '请输入详细地址', trigger: 'change' }],
        // 验证手机号 pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        venuesPhone: [{
          required: true,
          pattern:/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
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
    // 上传成功
    imgSuccess(res, file, fileList) {
      this.fileList = fileList;
    },
    //获取宗教
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
       this.$router.replace({path: '/venuesIndex'});
    },

    //省市区县
    regionChange (data) {
       var province='';
       var city='';
       var area='';
       var town='';
       if(''!==data.province && typeof(data.province) != "undefined"){
            province=data.province.value;
       }
       if(''!==data.city && typeof(data.city) != "undefined"){
            city=data.city.value;
       }
       if(''!==data.area && typeof(data.area) != "undefined"){
           area=data.area.value;
       }
       if(''!==data.town && typeof(data.town) != "undefined"){
           town=data.town.value;
       }

      this.region=province + city + area + town;
    },

    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          //图片校验
          var pictures=this.form.picturesPath;
          if(''===pictures || typeof(pictures) == "undefined"){
              this.$message.error('图片信息为空，请选择图片！如已选择，请点击图片上传！');
          }else{
              this.handleSubmitPost();
          }
        }else{
          this.$alert('填写信息有误，请重新填写后提交！');
        }
      });
    },
    //保存
   handleSubmitPost(){

     //数据保存
     this.$axios.post('/venues/add', {
          venuesName: this.form.venuesName,
          religiousSect: this.form.religiousSect,
          registerNbr: this.form.registerNbr,
          venuesPhone: this.form.venuesPhone,
          organization: this.region,
          province:this.regions.province,
          city:this.regions.city,
          area:this.regions.area,
          town:this.regions.town,
          venuesAddres: this.form.venuesAddres,
          responsiblePerson: this.form.responsiblePerson,
          groupMembers: this.form.groupMembers,
          liaisonMan: this.form.liaisonMan,
          briefIntroduction: this.form.briefIntroduction,
          venuesStaff:this.staffIds,
          picturesPath: this.form.picturesPath,
          picturesPathRemove: this.fileRemove

        }).then(successResponse => {
           let message=successResponse.data.result;
          if (successResponse.data.code === 200) {
            this.$message({message: '新增场所成功！', type: 'success'});
            this.fzShow=false;
            this.liaShow=false;
            this.groShow=false;
            this.$router.replace({path: '/venuesIndex'});
            this.$refs.elUpload.clearFiles()
          }else if(successResponse.data.code === 101){
                this.fzShow=true;
                this.$alert(message);
          }else if(successResponse.data.code === 102){
               this.$alert(message);
               this.liaShow=true;
          }else if(successResponse.data.code === 103){
              this.$alert(message);
              this.groShow=true;
          }else{
            this.$alert(message);
            /*this.messageWarn("新增场所失败,请联系管理员！","");*/
          }
        })
    },

    childaddClick () {
      this.form.venuesName = '';
      this.form.religiousSect = '';
      this.form.registerNbr = '';
      this.form.venuesPhone = '';
      this.form.organization = null;
      this.form.venuesAddres = '';
      this.form.responsiblePerson = '';
      this.form.liaisonMan = '';
      this.form.groupMembers = '';
      this.form.briefIntroduction = '';
      this.form.picturesPath = '';
      this.regions.town='';
      this.regions.area='';
    },
    handleClose (done) {
      this.messageWarn('确认关闭？',done);
    },

    //图片上传
    handleUpload(param) {
      this.fileList.push(param);// 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
    },
    picUpload() {
        this.$refs.elUpload.submit()
        let fd = new FormData()
        this.$refs.elUpload.submit(); // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件

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

     //负责人/联络员弹出框
     handleAdd (form) {
        this.isActive = false // 关闭显示弹窗
     },

     handleStaff (form) {
         this.staffIds = this.$refs.myStaffChild.searchForm.ids;
         this.form.venusesStaff= this.$refs.myStaffChild.searchForm.staff;
         this.isActive_staff = false;
     },
     addClick () {
         this.isActive = true;
         this.$refs.myaddchild.childaddClick();
     },
     addLiaClick () {
          this.isActive = true;
          this.$refs.myaddchild.childaddClick();
     },
     addGroClick () {
           this.isActive = true;
           this.$refs.myaddchild.childaddClick();
     },
     changeActive () {
         this.isActive = false
     },
    changeActive_staff () {
         this.isActive_staff = false
    },
    staffClick () {
       this.isActive_staff = true; // 显示弹窗
       this.$refs.myStaffChild.clearSelect();
       //this.$refs.myStaffChild.getSelect(); // 调用子组件中的getSelect获取
    },
    // 删除图片
    imgRemove(file, fileList) {
        let remove=file.response.result;
        this.fileRemove=this.fileRemove+remove+',';
        this.fileList1 = fileList;
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
        //this.ruleForm.userHeaderPicture = res.result;
        this.form.picturesPath=this.form.picturesPath+res.result+',';
        this.fileList1 = fileList;
    },
  },
}
</script>

<style scoped>
.fzClass{
  //background-color:#156AA8;


}
</style>
