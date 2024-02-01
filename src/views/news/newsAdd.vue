<template>
    <div>
        <div style="position:absolute;right:5%;">
          <el-button @click="handleSubmit()" type="primary">保存</el-button>
          <el-button @click="handleCancel" type="warning">取消</el-button>
        </div>

     <div style="position:absolute;top:80px;">
      <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-row>
            <el-col :span="6">
                 <el-form-item label="操作:" prop="newsOpera">
                   <el-select v-model="form.newsOpera"  placeholder="请选择"  @change="operaSelect($event)">
                     <el-option
                         v-for="item in newsOperaArr"
                         :key="item.cd"
                         :label="item.desc"
                         :value="item.cd"/>
                   </el-select>
                 </el-form-item>
             </el-col>
             <el-col :span="6">
                 <el-form-item label="链接类型:" prop="newsRefType">
                   <el-select v-model="form.newsRefType"  placeholder="请选择" @change="handleSelect($event)">
                     <el-option
                         v-for="item in newsRefTypeArr"
                         :key="item.cd"
                         :label="item.desc"
                         :value="item.cd"/>
                   </el-select>
                 </el-form-item>
             </el-col>
             <el-col :span="6">
                 <el-form-item label="发布平台:" prop="newsFor">
                   <el-select v-model="form.newsFor"  placeholder="请选择">
                     <el-option
                         v-for="item in newsForArr"
                         :key="item.cd"
                         :label="item.desc"
                         :value="item.cd"/>
                   </el-select>
                 </el-form-item>
             </el-col>
             <el-col :span="6">
                  <el-form-item label="新闻类别:" prop="newsType">
                    <el-select v-model="form.newsType"  placeholder="请选择">
                      <el-option
                          v-for="item in newsTypeArr"
                          :key="item.dictCd"
                          :label="item.dictCnDesc"
                          :value="item.dictCd"/>
                    </el-select>
                  </el-form-item>
             </el-col>
        </el-row>

        <el-row>
          <el-form-item label="新闻来源:" prop="newsFrom">
            <el-input v-model="form.newsFrom"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="新闻关键字:" prop="newsKeyword">
            <el-input v-model="form.newsKeyword" placeholder="多个关键字请用逗号（ ，）隔开"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
            <el-form-item label="新闻标题:" prop="newsTitle">
              <el-input v-model="form.newsTitle"></el-input>
            </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="新闻链接:" prop="newsRef" v-show="refShow">
            <el-input v-model="form.newsRef"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
            <el-button class="aclass" icon="el-icon-edit" type="primary" @click="addClick"
            v-show="newsContentShow">新闻内容编辑</el-button>
        </el-row>

        <!--<el-row>
          <el-form-item label="新闻内容:" prop="newsContent" v-show="newsContentShow">
            <el-input v-model="form.newsContent"
              placeholder="请填写"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10}">
            </el-input>
          </el-form-item>
        </el-row>-->

         <el-form-item label="照片1" v-show="false">
                <el-input v-model="form.newsPicturesPath"></el-input>
          </el-form-item>

          <el-form-item  prop="fileList" v-show="picturesPathShow">
            <el-row>
              <el-col>
                <el-upload
                   action="http://183.246.59.33:8081/api/file/images/upload"
                   list-type="picture-card"
                   :on-exceed="handleExceed"
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
  </div>
    <add-item :dialog-visible-news-auto-add="isActive" @cActive="changeActive" @cAdd="handleAdd" ref="myaddchild"></add-item>
 </div>
</template>

<script>
import newsAutoAdd from './newsAutoAdd';
import global from '../global.vue';

export default {
  name: "newsAdd",
  props: ['dialogVisibleNewsAdd'],
  components: {
    'add-item': newsAutoAdd
  },
  data () {
    return {
      message: '来自子组件的消息',
      imageUrl: global.httpUrl,
      isActive: false,
      picturesPathShow:false,
      newsContentShow:false,
      refShow:false,
      form: {
        newsTitle: '',
        newsType: '',
        newsKeyword: '',
        newsContent: '',
        newsFrom:'',
        newsRef:'',
        newsFor:'',
        newsRefType:'',
        newsPicturesPath:'',
        videoPath:'',
        contents:''
      },
      fileRemove:'',
      fileList:[],
      newsTypeArr:[],
      newsOperaArr:[{cd:'01',desc:'手动编辑新闻'},{cd:'02',desc:'添加新闻链接地址'}],
      newsForArr:[{cd:'01',desc:'监管端'},{cd:'02',desc:'服务端'},{cd:'03',desc:'监管+服务'}],
      newsRefTypeArr:[{cd:'01',desc:'一般新闻'},{cd:'02',desc:'图片新闻'}],
      formRules: {
        newsOpera:[{required: true, message: '请选择操作', trigger: 'blur'}],
        newsRefType:[{required: true, message: '请选择链接类型', trigger: 'blur'}],
        newsType:[{required: true, message: '请输入新闻类别', trigger: 'blur'}],
        newsFor:[{required: true, message: '请选择发布平台', trigger: 'blur'}],
        newsTitle:[{required: true, message: '请选择发布平台', trigger: 'blur'}],
      },
    }

  },
  created(){
    this.getNewsTypeArr();
  },
  methods: {
    //获取新闻类别
    async getNewsTypeArr(){
      this.$axios.get('/dict/getSysDict', {
        params: {
          dictTypeCd: '1002',
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.newsTypeArr=successResponse.data.resultArr;
        }else{
          this.$alert('数据获取失败,请联系管理员！');
        }
      })
    },
    // 取消
    handleCancel () {
      this.$router.replace({path: '/newsIndex'});
    },
    //保存新增
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
      this.$axios.post('/news/add', {
        newsTitle: this.form.newsTitle,
        newsType: this.form.newsType,
        newsKeyword: this.form.newsKeyword,
        newsContent: this.form.contents,
        newsFrom:this.form.newsFrom,
        newsRef:this.form.newsRef,
        newsFor:this.form.newsFor,
        newsPicturesPath:this.form.newsPicturesPath,
        newsRefType:this.form.newsRefType,
        picturesPathRemove:this.fileRemove,
        newsVideosPath:this.form.videoPath,
        newsOpera:this.form.newsOpera,
      }).then(successResponse => {
        let message=successResponse.data.message;
        if (successResponse.data.code === 200) {
          this.$message({message: message, type: 'success'});
          this.$router.replace({path: '/newsIndex'});
        }else{
          this.$message({message: message, type: 'error'});
          //this.$alert('新增新闻信息失败,请联系管理员！');
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
        //this.ruleForm.userHeaderPicture = res.result;
        this.form.newsPicturesPath=this.form.newsPicturesPath+res.result+',';
    },
    handleExceed(){
        //提示最多只能上传20个
        this.$message({message: '上传一张图片即可！', type: 'warning'});
    },

    //根据选择显示
    handleSelect(opt){
        if("01"===opt){
            this.picturesPathShow=false;
            //this.newsContentShow=true;
        }else if("02"===opt){
            this.picturesPathShow=true;
            //this.newsContentShow=false;
            this.form.newsContent='';
        }
    },
    //根据操作选择显示
    operaSelect(opt){
        if("01"===opt){
            this.newsContentShow=true;
            this.picturesPathShow=false;
            this.refShow=false;
            this.form.newsRefType='01';
        }else if("02"===opt){
            this.newsContentShow=false;
            this.picturesPathShow=false;
            this.form.newsRefType='';
            this.refShow=true;
            this.form.newsContent='';
            this.form.videoPath='';
            this.form.contents='';
        }
    },
    addClick () { // 每次点击“添加”按钮时,首先将isActive激活,显示表单;再调用子组件的childaddClicj方法,清空之前子组件中的form表单
      this.isActive = true // 显示弹窗
      this.$refs.myaddchild.childaddClick() // 调用子组件中的childaddClick方法,清空表单
    },
    changeActive () { // 用于只改变isActive的值来取消显示弹窗
      this.isActive = false
    },
    handleAdd (data) {
      //视频
      var videosArr=data.videoPath;
      if(videosArr.length>0){
        for (let i = 0; i < videosArr.length; i++) {
          const item = videosArr[i];
          var videoId=item.fileId;
          this.form.videoPath=this.form.videoPath+','+videoId;
        }
      }
      //内容
      var videos=data.contents;
      this.form.contents=videos;
      this.isActive = false; // 关闭显示弹窗
    },

  },

}
</script>

<style scoped>
.dialogClass{
  margin-left: 200px;
  margin-top: 0px;
}
</style>
