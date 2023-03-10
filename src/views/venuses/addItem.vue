<template>
    <div>
      <el-dialog title="场所基本信息新增" :visible="dialogVisibleVenuesAdd" :before-close="handleClose" width="50%">
        <el-form ref="form" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="religious" prop="religious" v-show="false">
          <el-input v-model="form.religious" class="religiousclass"></el-input>
        </el-form-item>

          <el-row>
            <el-col :span="12">
              <el-form-item label="场所名称" prop="venuesName">
                <el-input v-model="form.venuesName" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教派类别" prop="religiousSect">
                <el-select v-model="form.religiousSect" @change="selectChanged" clearable>
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
                  <el-input v-model="form.registerNbr" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="场所电话" prop="venuesPhone">
                  <el-input v-model="form.venuesPhone" clearable></el-input>
                </el-form-item>
              </el-col>
          </el-row>

          <el-row>
              <el-form-item label="场所地址" prop="organization" >
                   <region-selects
                      :town="true"
                      v-model="regions"
                      @change="regionChange"
                      clearable
                    />
               </el-form-item>
          </el-row>

          <el-row>
            <el-form-item label="详细地址" prop="venuesAddres">
              <el-input v-model="form.venuesAddres" clearable></el-input>
            </el-form-item>
          </el-row>

        <el-row :gutter="48">
          <el-col :span="13">
            <el-form-item label="负责人" prop="responsiblePerson">
              <el-input v-model="form.responsiblePerson" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" >
              <el-button class="fzClass" icon="el-icon-circle-plus-outline" type="primary" @click="addClick" v-show="fzShow">添加负责人</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="48">
              <el-col :span="13">
                <el-form-item label="联络员" prop="liaisonMan">
                    <el-input v-model="form.liaisonMan" clearable></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="8" >
                   <el-button class="llClass" icon="el-icon-circle-plus-outline" type="primary" @click="addClick" v-show="llShow">添加联络员</el-button>
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
                <el-upload ref="elUpload"
                           action=""
                           multiple
                           :auto-upload="false"
                           :http-request="handleUpload"
                           :on-success="imgSuccess"
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

            <add-item :dialog-visible-manager-add="isActive" @cActive="changeActive" @cAdd="handleAdd" ref="myaddchild"></add-item>

      </el-dialog>
    </div>
</template>

<script>
import { RegionSelects } from 'v-region';
import managerAdd from './managerAdd'

export default {
  props: ['dialogVisibleVenuesAdd'],
  components: {
      RegionSelects,
      'add-item': managerAdd,
  },
  data () {
    return {
      message: '来自子组件的消息',
      isActive: false,
      fzShow : false,
      llShow : false,
      selectedOptions: [],
      religiousSects:[],
      fileList:[],
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
      this.$emit('cActive') // $emit应是用来子组件向父组件传参的,但是,这里我只是想改变父组件中isActive为false,
      // 对应事件cActive
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
              this.$message.error('图片信息为空，请上传图片！');
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
          picturesPath: this.form.picturesPath,
          responsiblePerson: this.form.responsiblePerson,
          liaisonMan: this.form.liaisonMan,
          briefIntroduction: this.form.briefIntroduction
        }).then(successResponse => {
           let message=successResponse.data.result;
          if (successResponse.data.code === 200) {
            this.$message.info({message: '新增场所成功！', type: 'success'});
            this.fzShow=false;
            // 对应事件cAdd
            // &emit向父组件提交form表单
            this.$emit('cAdd', this.form)
            this.$refs.elUpload.clearFiles()
          }else if(successResponse.data.code === 404){
            this.$alert(message);
            this.fzShow=true;
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
     addClick () { // 每次点击“添加”按钮时,首先将isActive激活,显示表单;再调用子组件的childaddClicj方法,清空之前子组件中的form表单
         this.isActive = true // 显示弹窗
         this.$refs.myaddchild.childaddClick() // 调用子组件中的childaddClick方法,清空表单
     },
     changeActive () { // 用于只改变isActive的值来取消显示弹窗
         this.isActive = false
     },
  },

}
</script>

<style scoped>
.fzClass{
  //background-color:#156AA8;


}
</style>
