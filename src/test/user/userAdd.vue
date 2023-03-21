<template>

  <div>
    <el-dialog title="用户新增" :visible="dialogVisibleUserAdd" :before-close="handleClose" width="60%">
      <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="中文名:" prop="userNm">
              <el-input v-model="form.userNm" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录名:" prop="loginNm">
              <el-input v-model="form.loginNm" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="密码:" prop="passwords">
              <el-input v-model="form.passwords" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱:" prop="userEmail">
              <el-input v-model="form.userEmail" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

        <!--
        <el-col :span="12">
            <el-form-item label="工号:"  prop="userNbr">
              <el-input v-model="form.userNbr" ></el-input>
            </el-form-item>
          </el-col>
          -->

          <el-col :span="12">
            <el-form-item label="电话号码:" prop="userMobile">
              <el-input v-model="form.userMobile" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <el-form-item label="角色:" prop="identity">
                  <el-select v-model="form.identity" clearable @change="getList($event)">
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

        <el-row>
          <el-form-item label="管辖街" prop="organization1" v-show="isShowOne">
               <region-selects
                  :town="true"
                  v-model="regions"
                  @change="regionChangeTown"
                />
           </el-form-item>
      </el-row>

      <el-row>
          <el-button class="llClass" icon="el-icon-circle-plus-outline" type="primary" @click="modifyClick" v-show="isShowBut">选择场所</el-button>
          <el-col :span="20">
            <el-form-item label="场所名称:" prop="venuesName" v-show="isShow">
              <el-input v-model="form.venuesName" clearable></el-input>
            </el-form-item>
          </el-col>
      </el-row>

      <el-row>
            <el-form-item label="管辖区" prop="organization2" v-show="isShowTwo">
                 <region-selects
                    v-model="regions"
                    @change="regionChange"
                  />
             </el-form-item>
        </el-row>

        <el-form-item label="照片" v-show="false">
          <el-input v-model="form.userPhotoUrl"></el-input>
        </el-form-item>

        <el-form-item  prop="fileList">
          <el-row>
            <el-col>
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
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleSubmit()">确定</el-button>
        </span>

        <venues-select :dialog-visible-venues-select="isActive_modify" @cActive_modify="changeActive_modify" @cmodify="handleRewrite" ref="mymodifychild"></venues-select>
    </el-dialog>
  </div>

</template>

<script>
import { RegionSelects } from 'v-region';
import VenuesSelect from './VenuesSelect';

export default {
  props: ['dialogVisibleUserAdd'],
  components: {
        RegionSelects,
        'venues-select': VenuesSelect
    },
  data () {

    return {
    isActive_modify: false,
        regions: {
            province: '330000',
            city: '330300',
            area: '',
            town: ''
          },
      region  :'',
      province:'',
      city:'',
      area:'',
      town:'',
      relVenuesId:0,
      regionArr  :[],
      message: '来自子组件的消息',
      isShow:false,
      isShowBut:false,
      isShowOne:false,
      isShowTwo:false,
      roleslist:[],
      fileList:[],
      fileRemove:'',
      fileUpload:'',
      venuesList:[],
      venuesIds:'',
      repeatList:[],
      searchId: '',
      search: '',
      form: {
        userNm: '',
        loginNm: '',
        passwords: '',
        userMobile: '',
        userEmail:'',
        userNbr:'',
        identity:'',
        userPhotoUrl:'',
      },
      formRules: {
        userNm:[{required: true, message: '请输入中文名称', trigger: 'blur'}],
        passwords:[{required: true, message: '请输入密码', trigger: 'blur'}],
        identity:[{required: true, message: '请选择角色', trigger: 'blur'}],
        // 验证手机号 pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        userMobile: [{
          required: true,
          pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
          message: "请输入正确的手机号码",
          trigger: "blur"
        }],

      },
    }

  },
  created(){
    this.getRoleslist();
  },

  methods: {
   regionChange (data) {
         var provinceKey='';
         var cityKey='';
         var areaKey='';
         if(''!==data.province && typeof(data.province) != "undefined"){
              provinceKey=data.province.key;
         }
         if(''!==data.city && typeof(data.city) != "undefined"){
              cityKey=data.city.key;
         }
         if(''!==data.area && typeof(data.area) != "undefined"){
             areaKey=data.area.key;
         }
          this.province=provinceKey;
          this.city=cityKey;
          this.area=areaKey;
      },
    regionChangeTown (data) {
           this.venuesIds = '';
           this.form.venuesName= '';
           var provinceKey='';
           var cityKey='';
           var areaKey='';
           var townKey='';
           if(''!==data.province && typeof(data.province) != "undefined"){
                provinceKey=data.province.key;
           }
           if(''!==data.city && typeof(data.city) != "undefined"){
                cityKey=data.city.key;
           }
           if(''!==data.area && typeof(data.area) != "undefined"){
               areaKey=data.area.key;
           }
           if(''!==data.town && typeof(data.town) != "undefined"){
               townKey=data.town.key;
               this. getVenuesList('');
           }
            this.province=provinceKey;
            this.city=cityKey;
            this.area=areaKey;
            this.town=townKey;

        },

    // 搜索模糊查询数据下拉框
    getVenuesList(query) {
        //执行查询
        this.$axios.get('/venues/querySelect', {
            params: {
                search: query,
                town:this.regions.town
            }
        }).then(successResponse => {
            if (successResponse.data.code === 200) {
                this.venuesList=successResponse.data.resultArr;
            }else{
                let message=successResponse.data.result;
                if(''!=message && null!=message){
                  this.$alert(message);
                }else{
                  this.$router.replace({path: '/'})
                }
            }
        });
    },

    async getRoleslist(){
        this.venuesIds = '';
        this.form.venuesName= '';
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
      this.$emit('cActive');
      this.fileList = [];
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
              //图片校验
              var pictures=this.form.userPhotoUrl;
              if(''===pictures || typeof(pictures) == "undefined"){
                  this.$message.error('图片信息为空，请上传图片！');
              }else{
                  this.fileList = [];
                  this.handleSubmitPost();
              }

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
        userPhotoUrl: this.form.userPhotoUrl,
        picturesPathRemove: this.fileRemove,
        province: this.province,
        city: this.city,
        area: this.area,
        town: this.town,
        relVenuesId:this.venuesIds

      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$message({message: '新增用户信息成功！', type: 'success'});
          // 对应事件cAdd
          // &emit向父组件提交form表单
          this.$emit('cAdd', this.form)
          this.$refs.elupload.clearFiles()
        }else{
          let message=successResponse.data.result;
          if(''!=message && null!=message){
            this.$message({message: message, type: 'warning'});
          }else{
            this.$message({message: message, type: 'error'});
          }
        }
      })
    },

    //初始化页面
    childaddClick () {
        this.isShow =false;
        this.isShowBut=false;
        this.isShowOne =false;
        this.isShowTwo =false;
        this.regions.town='';
        this.regions.area='';
        this.form.venuesName= '';
        this.form.userPhotoUrl= '';
        this.form.userNm = '';
        this.form.loginNm = '';
        this.form.passwords = '';
        this.form.userMobile = '';
        this.form.userEmail = '';
        this.form.userNbr = '';
        this.form.identity = '';
        this.fileList = [];
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('cActive'); // 如果确认,就取消弹窗,
            this.fileList = [];
            done();
          })
          .catch(_ => {})
    },
    // 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
    handleupload(param) {
      this.fileList.push(param);
    },
    // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
    picUpload() {
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
          this.form.userPhotoUrl=successResponse.data.result
          this.$message({
            message: '图片上传成功，请继续操作！',
            type: 'success'
          });
        }else{
          this.$message.error('图片保存失败，请重新选择！');
        }
      })
    },
    //根据角色显示
    getList (opt) {
        if(10000002==opt || 10000003==opt){
            this.isShow =false;
            this.isShowBut =false;
            this.isShowOne =false;
            this.isShowTwo =true;
        }else if(10000004==opt || 10000005==opt){
            this.isShow =false;
            this.isShowBut =false;
            this.isShowOne =true;
            this.isShowTwo =false;
        }else if(10000006==opt || 10000007==opt){
            this.isShow =true;
            this.isShowBut =true;
            this.isShowOne =true;
            this.isShowTwo =false;
        }

    },
    //地址弹窗
     modifyClick (index, rows) {
          let town=this.regions.town ;
          if(''===town || typeof(town) == "undefined" || null===town){
              this.$alert("请先选择所在街镇");
          }else{
              this.isActive_modify = true;
              this.$refs.mymodifychild.venuesList = this.venuesList;
          }
    },
    handleRewrite () {
        this.venuesIds = this.$refs.mymodifychild.venuesIds;
        this.form.venuesName= this.$refs.mymodifychild.venuesNms;
        this.isActive_modify = false;
    },
    changeActive_modify () {
        this.isActive_modify = false;
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
        this.form.userPhotoUrl=this.form.userPhotoUrl+res.result+',';
    },
}
}
</script>

<style scoped>

</style>
