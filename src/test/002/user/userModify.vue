<template>
  <div>
    <el-dialog title="修改职员信息" :visible="dialogVisibleUserModify" :before-close="handleClose" width="60%">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">

        <el-form-item label="id" prop="userId" v-show="false">
          <el-input v-model="form.userId" class="userIdClass"></el-input>j
        </el-form-item>

        <el-form-item label="照片:" prop="userPhotoUrl" v-show="false">
        </el-form-item>

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
            <el-form-item label="电话号码:" prop="userMobile">
              <el-input v-model="form.userMobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱:" prop="userEmail">
              <el-input v-model="form.userEmail"></el-input>
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

        <el-form-item  prop="fileList">
          <el-row>
            <el-col>
             <el-upload
                :action="imageUrl"
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
        <el-button @click="handleSubmit">确定</el-button>
      </span>

      <venues-select :dialog-visible-venues-select="isActive_modify" @cActive_modify="changeActive_modify" @cmodify="handleRewrite" ref="mymodifychild"></venues-select>

    </el-dialog>

  </div>
</template>

<script>
    import { RegionSelects } from 'v-region';
    import VenuesSelect from './VenuesSelect';
    import global from '../global.vue';

export default {
  props: ['isactive', 'dialogVisibleUserModify', 'index_from_parent'],
  components: {
      RegionSelects,
      'venues-select': VenuesSelect
  },
  data () {
    return {
      message: '来自子组件的消息',
      imageUrl: global.httpUrl,
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
      venuesIds:'',
      relVenuesId:0,
      isActive_modify: false,
      roleslist:[],
      imagesrcList:[],
      fileList:[],
      fileRemove:'',
      fileUpload:'',
      isShow:false,
      isShowBut:false,
      isShowOne:false,
      isShowTwo:false,
      form: {
        userNm: '',
        loginNm: '',
        weakPwInd: '',
        userMobile: '',
        userEmail:'',
        userNbr:'',
        identity:'',
        userPhotoUrl:'',
      },
      rules: {
        userNm:[{required: true, message: '请输入中文名称', trigger: 'blur'}],
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
      this.$emit('cActive_modify')
    },
    handleSubmit () {
      this.$emit('cmodify', this.form)
      // 对应事件cAdd
      // &emit向父组件提交form表单
      this.$axios.post('/user/update', {
        userNm: this.form.userNm,
        loginNm: this.form.loginNm,
        weakPwInd: this.form.weakPwInd,
        userMobile: this.form.userMobile,
        userEmail: this.form.userEmail,
        userNbr: this.form.userNbr,
        identity:this.form.identity,
        staffPicture: this.form.picturesPath,
        userId: this.form.userId,
      }).then(successResponse => {
            if (successResponse.status=== 200) {
              this.$message.info('修改用户信息成功！');
              // 对应事件cAdd
              // &emit向父组件提交form表单
              this.$emit('cmodify', this.form)
            }else{
              this.$router.replace({path: '/error'})
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
    // 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
    handleupload(param) {
      this.fileList.push(param);
    },
    // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
    uploadelupload() {
      this.$refs.elupload.submit()
      let fd = new FormData()
      this.$refs.elupload.submit();
      //将每一个文件图片都加进formdata
      this.fileList.forEach(item => {
        fd.append(item.file.name, item.file,item.file.name)
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
        if (successResponse.status === 200) {
          this.form.picturesPath=successResponse.data
          alert("图片上传成功！")
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },
    //循环展示图片
    getImgList(srcLis) {
      let arr = []
      let i = 0
      for (i; i < srcLis.length; i++) {
        arr.push(srcLis[i].filePath)
      }
      return arr
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
  }
}
</script>

<style scoped>

</style>
