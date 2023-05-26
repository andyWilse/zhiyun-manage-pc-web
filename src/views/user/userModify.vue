<template>
  <div>
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
                    <el-form-item label="电话号码:" prop="userMobile">
                      <el-input v-model="form.userMobile" clearable></el-input>
                    </el-form-item>
               </el-col>
               <el-col :span="12">
                  <el-form-item label="邮箱:" prop="userEmail">
                    <el-input v-model="form.userEmail" clearable></el-input>
                  </el-form-item>
               </el-col>
              </el-row>

              <el-row>
                  <el-col :span="12">
                      <el-form-item label="角色:" prop="identity">
                        <el-select v-model="form.identity" clearable @change="getList($event)">
                          <el-option
                              v-for="item in rolesList"
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

          <venues-select :dialog-visible-venues-select="isActive_modify" @cActive_modify="changeActive_modify" @cmodify="handleRewrite" ref="mymodifychild"></venues-select>
</div>
</template>

<script>

import { RegionSelects } from 'v-region';
import VenuesSelect from './VenuesSelect';

export default {
  components: {
      RegionSelects,
      'venues-select': VenuesSelect
  },
  data () {
    return {
        message: '来自子组件的消息',
        isActive_modify:false,
        fileRemove:'',
        fileUpload:'',
        fileList:[],
        //区域
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
        //区域展示
        isShow:false,
        isShowBut:false,
        isShowOne:false,
        isShowTwo:false,
        rolesList:[],
        userMobileOrigin: '',
        passwordOrigin: '',
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
        //角色下拉
        this.getRolesList();
        //获取修改信息
        let userId=this.$route.query.userId;
        this.getModifyUser(userId);
    },
    //方法
    methods: {
        //获取用户信息
        getModifyUser(userId){
            this.$axios.get('/user/getMoUser', {
                params: {
                    userId: userId,
                }
            }).then(successResponse => {
                if (successResponse.data.code === 200) {
                    this.form.userNm = successResponse.data.result[0].userNm ;
                    this.form.loginNm = successResponse.data.result[0].loginNm ;
                    this.form.userEmail = successResponse.data.result[0].userEmail;
                    //原号码
                    this.userMobileOrigin=successResponse.data.result[0].userMobile;
                    this.form.userMobile = successResponse.data.result[0].userMobile;
                    let ide=successResponse.data.result[0].identityInt;
                    this.form.identity = ide;
                    this.form.venuesName = successResponse.data.result[0].venuesNm;
                    this.regions.province = successResponse.data.result[0].province;
                    this.regions.city = successResponse.data.result[0].city;
                    this.regions.area = successResponse.data.result[0].area;
                    this.regions.town = successResponse.data.result[0].town;
                    //隐藏处理
                    this.getList (ide);
                    //图片处理
                    this.form.userPhotoUrl = successResponse.data.result[0].userPhotoUrl;
                    this.fileList=successResponse.data.result[0].fileList;

                    this.passwordOrigin=successResponse.data.result[0].weakPwInd;

                }else{
                    let message=successResponse.data.message;
                    this.$message({message: message,type: 'warning'});
                }
            })
        },
        //提交数据校验
        handleSubmit () {
          this.$refs.form.validate(valid => {
            if (valid) {
                  //图片校验
                  var pictures=this.form.userPhotoUrl;
                  if(''===pictures || typeof(pictures) == "undefined"){
                      this.$message.error('图片信息为空，请上传图片！');
                  }else{
                      this.handleSubmitPost();
                  }
            }else{
              this.$alert('填写信息有误，请重新填写后提交！');
            }
          });
        },
        //提交数据
        handleSubmitPost(){
          this.$axios.post('/user/update', {
            userNm: this.form.userNm,
            loginNm: this.form.loginNm,
            userMobile: this.form.userMobile,
            userMobileOrigin: this.userMobileOrigin,
            userEmail: this.form.userEmail,
            identity:this.form.identity,
            userPhotoUrl: this.form.userPhotoUrl,
            picturesPathRemove: this.fileRemove,
            province: this.province,
            city: this.city,
            area: this.area,
            town: this.town,
            relVenuesId:this.venuesIds,
            userId: this.$route.query.userId,
            weakPwInd:this.passwordOrigin,

          }).then(successResponse => {
            if (successResponse.data.code === 200) {
              this.$message({message: '修改用户信息成功！', type: 'success'});
              this.$router.replace({path: '/userIndex'});
            }else{
              let message=successResponse.data.message;
              if(''!=message && null!=message){
                this.$message({message: message, type: 'error'});
              }else{
                this.$message({message: message, type: 'error'});
              }
            }
          })
        },
        //场所多选弹出框
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

        //区域
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
        //角色
        getRolesList(){
            this.venuesIds = '';
            this.form.venuesName= '';
            this.$axios.get('/role/getRoles').then(successResponse => {
                if (successResponse.status === 200) {
                    this.rolesList=successResponse.data;
                }else{
                    this.$router.replace({path: '/error'})
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
            }else{
                this.isShow =false;
                this.isShowBut =false;
                this.isShowOne =false;
                this.isShowTwo =false;

            }
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
            this.fileList=fileList;
        },
        //取消
        handleCancel () {
            this.$router.replace({path: '/userIndex'});
        },

    },

}
</script>

<style scoped>

</style>
