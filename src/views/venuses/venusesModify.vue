<template>
    <div>
        <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-form-item label="religious" prop="religious" v-show="false">
          <el-input v-model="form.religious" class="religiousclass"></el-input>
        </el-form-item>

        <el-form-item label="venuesId" prop="venuesId" v-show="false">
          <el-input v-model="form.venuesId" class="venuesClass"></el-input>
        </el-form-item>

        <el-form-item label="venuesStaffId" prop="venuesStaffId" v-show="false">
          <el-input v-model="form.venuesStaffId" class="venuesClass"></el-input>
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
                <el-form-item label="经度"  prop="longitude">
                  <el-input v-model="form.longitude" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="维度" prop="latitudes">
                  <el-input v-model="form.latitudes" clearable></el-input>
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
              <el-col :span="17">
                <el-form-item label="教职人员:" prop="venuesStaff">
                  <el-input v-model="form.venuesStaff"
                          readonly
                          placeholder=""
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                  <el-button class="staffClass" icon="el-icon-circle-plus-outline" type="primary" @click="staffClick">新增教职人员</el-button>
              </el-col>
              <el-col :span="3">
                  <el-button class="staffClass" icon="el-icon-remove-outline" type="warning" @click="staffDelete">删除教职人员</el-button>
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
               <el-upload
                  action="http://zszjadmin.860577.net:8808/api/file/images/upload"
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
      veId:'',
      isActive_staff: false,
      isActive: false,
      fzShow : false,
      liaShow : false,
      groShow : false,
      selectedOptions: [],
      religiousSects:[],
      fileList:[],
      fileRemove:'',
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
        groupMembers:'',
        liaisonMan : '',
        briefIntroduction :'',
        picturesPath:'',
        longitude:'',
        latitudes:''
      },
      formRules: {
        venuesName:[{required: true, message: '请输入场所名称', trigger: 'blur'}],
        longitude:[{required: true, message: '请输入经度', trigger: 'blur'}],
        latitudes:[{required: true, message: '请输入维度', trigger: 'blur'}],
        //organization: [{ required: true, message: '请输入所属机构', trigger: 'blur' }],
        religiousSect: [{ required: true, message: '请选择宗教类别', trigger: 'change' }],
        registerNbr: [{ required: true, message: '请输入等级证号', trigger: 'change' }],
        responsiblePerson: [{ required: true, message: '请输入负责人', trigger: 'change' }],
        venuesAddres: [{ required: true, message: '请输入详细地址', trigger: 'change' }],
        //venuesStaff: [{ required: true, message: '请选择教职人员', trigger: 'change' }],
        // 验证手机号 pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,

    },
    }
  },
  created(){
    this.getReligiousSect();
    this.getVenue();
  },

methods: {
//获取场所信息
    async getVenue(){

        //let veId=this.$route.params.venuesId;
        this.veId=this.$route.query.venuesId;
        this.$axios.get('/venues/getVenueByID', {
          params: {
            venuesId: this.veId,
          }
        }).then(successResponse => {
          if (successResponse.data.code === 200) {
                this.form.venuesName = successResponse.data.result[0].venuesName ;
                this.form.religiousSect= successResponse.data.result[0].religiousSect ;
                this.form.registerNbr= successResponse.data.result[0].registerNbr ;
                this.form.venuesPhone= successResponse.data.result[0].venuesPhone ;
                this.region= successResponse.data.result[0].organization ;
                this.regions.province= successResponse.data.result[0]. province;
                this.regions.city= successResponse.data.result[0].city;
                this.regions.area= successResponse.data.result[0].area;
                this.regions.town= successResponse.data.result[0].town;
                this.form.venuesAddres= successResponse.data.result[0].venuesAddres ;
                this.form.picturesPath= successResponse.data.result[0].picturesPath ;
                this.form.responsiblePerson= successResponse.data.result[0].responsiblePerson ;
                this.form.groupMembers= successResponse.data.result[0].groupMembers ;
                this.form.liaisonMan= successResponse.data.result[0].liaisonMan ;
                this.form.briefIntroduction= successResponse.data.result[0].briefIntroduction ;
                this.form.venuesStaff = successResponse.data.result[0].venuesStaff ;
                this.form.venuesId = successResponse.data.result[0].venuesId ;
                this.form.venuesStaffId = successResponse.data.result[0].venuesStaffId ;
                this.form.latitudes = successResponse.data.result[0].latitudes ;
                this.form.longitude = successResponse.data.result[0].longitude ;
                this.fileList=successResponse.data.result[0].fileList
          }else{
            let message=successResponse.data.message;
            this.$message({message: message, type: 'warning'});
          }
        })
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
            let message=successResponse.data.message;
            this.$message({message: message, type: 'warning'});
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
     //数据处理
     //数据保存
     this.$axios.post('/venues/updateVenues', {
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
          liaisonMan: this.form.liaisonMan,
          groupMembers: this.form.groupMembers,
          briefIntroduction: this.form.briefIntroduction,
          venuesStaff:this.staffIds,
          venuesId:this.form.venuesId,
          picturesPath: this.form.picturesPath,
          picturesPathRemove: this.fileRemove,
          latitudes:this.form.latitudes,
          longitude:this.form.longitude
        }).then(successResponse => {
           let message=successResponse.data.result;
          if (successResponse.data.code === 200) {
            this.$message({message: '修改场所成功！', type: 'success'});
            this.fzShow=false;
            this.liaShow=false;
            this.groShow=false;
            this.$router.replace({path: '/venuesIndex'});
            this.$refs.elUpload.clearFiles()
          }else if(successResponse.data.code === 404){
            this.$alert(message);
            this.fzShow=true;
          }else{
            this.$message({message: message, type: 'warning'});
            /*this.messageWarn("修改场所失败,请联系管理员！","");*/
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
      this.form.groupMembers= '';
      this.form.liaisonMan = '';
      this.form.briefIntroduction = '';
      this.form.picturesPath = '';
      this.regions.town='';
      this.regions.area='';
    },
    handleClose (done) {
      this.messageWarn('确认关闭？',done);
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
         this.form.venuesStaff= this.$refs.myStaffChild.searchForm.staff;
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
    //新增教职人员弹窗
    staffClick () {
       this.isActive_staff = true; // 显示弹窗
       this.$refs.myStaffChild.staffNms = this.form.venuesStaff;
       this.$refs.myStaffChild.staffIds = this.form.venuesStaffId;
       //this.$refs.myStaffChild.searchForm.staff = this.form.venuesStaff;
       //this.$refs.myStaffChild.searchForm.ids = this.form.venuesStaffId;
       this.$refs.myStaffChild.clearSelect();
    },
    staffDelete () {
        this.$router.push({path: '/staffIndex',query:{ venuesId:this.veId,venuesNm:this.form.venuesName}});
    },
    // 删除图片
    imgRemove(file, fileList) {
            let url=file.url;
            let remove='';
            if(url.includes('blob:http:')){
                remove=file.response.result;
            }else{
                remove=file.fileId;
            }
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
