<template>
  <div>
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">

        <el-form-item label="新闻id:" prop="newsId" v-show="false">
          <el-input v-model="form.newsId"></el-input>
        </el-form-item>

        <el-row>
             <el-col :span="6">
                 <el-form-item label="链接类型:" prop="newsRefType" readonly="true">
                   <el-select v-model="form.newsRefType"  placeholder="请选择" @change="handleSelect($event)" disabled>
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
            <el-form-item label="新闻标题:" prop="newsTitle">
              <el-input v-model="form.newsTitle"></el-input>
            </el-form-item>
        </el-row>
            <el-row>
              <el-form-item label="新闻链接:" prop="newsRef">
                <el-input v-model="form.newsRef"></el-input>
              </el-form-item>
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
          <el-form-item label="新闻内容:" prop="newsContent" v-show="newsContentShow">
            <el-input v-model="form.newsContent"
              placeholder="请填写"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10}">
            </el-input>
          </el-form-item>
        </el-row>

         <el-form-item label="照片1" v-show="false">
                <el-input v-model="form.newsPicturesPath"></el-input>
          </el-form-item>

          <el-form-item  prop="fileList" v-show="picturesPathShow">
            <el-row>
              <el-col>
                <el-upload
                   :action="imageUrl"
                   list-type="picture-card"
                   :limit="1"
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

      <div style="position:absolute;right:100px;">
        <el-button @click="handleCancel" type="warning">取消</el-button>
        <el-button @click="handleSubmit()" type="primary">确定</el-button>
      </div>
  </div>
</template>

<script>
import global from '../global.vue'


export default {
  name: "newsModify",
  props: [],
  data () {
    return {
      message: '来自子组件的消息',
      imageUrl: global.httpUrl,
      picturesPathShow:false,
      newsContentShow:false,
      fileRemove:'',
      fileList:[],
      newsTypeArr:[],
      newsForArr:[{cd:'01',desc:'监管端'},{cd:'02',desc:'服务端'},{cd:'03',desc:'监管+服务'}],
      newsRefTypeArr:[{cd:'01',desc:'一般新闻'},{cd:'02',desc:'图片新闻'}],
      form: {
        newsTitle: '',
        newsType: '',
        newsKeyword: '',
        newsContent: '',
        newsFrom:'',
        newsFor:'',
        newsRef:'',
        newsRefType:'',
        newsPicturesPath:'',
      },
      rules: {
        newsRefType:[{required: true, message: '请选择链接类型', trigger: 'blur'}],
        newsTitle:[{required: true, message: '请输入中文名称', trigger: 'blur'}],
        newsFor:[{required: true, message: '请选择发布平台', trigger: 'blur'}],
      },
    }
  },
  created(){
    this.getNewsTypeArr();
    this.getModifyNews();
  },
  methods: {
    getModifyNews(){
        let newsId=this.$route.query.newsId;
        this.$axios.get('/news/getNewsById/'+newsId)
            .then(successResponse => {
                let message=successResponse.data.message;
                if (successResponse.data.code === 200) {
                    this.form.newsTitle =successResponse.data.result[0].newsTitle ;
                    this.form.newsType =successResponse.data.result[0].newsType ;
                    this.form.newsKeyword =successResponse.data.result[0].newsKeyword ;
                    this.form.newsContent =successResponse.data.result[0].newsContent ;
                    this.form.newsFrom =successResponse.data.result[0].newsFrom ;
                    this.form.newsFor =successResponse.data.result[0].newsFor ;
                    this.form.newsRef =successResponse.data.result[0].newsRef ;
                    this.form.newsPicturesPath =successResponse.data.result[0].newsPicturesPath ;
                    this.fileList=successResponse.data.result[0].fileList;
                    let refType=successResponse.data.result[0].newsRefType;
                    this.form.newsRefType =refType;
                    this.handleSelect(refType);
                }else{
                    this.$message({message: message, type: 'error'});
                }
            })
    },
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
    //取消
    handleCancel () {
      this.$router.replace({path: '/newsIndex'});
    },
    //保存修改
    handleSubmit () {
          let newsId=this.$route.query.newsId;
          this.$axios.post('/news/update', {
                newsTitle: this.form.newsTitle,
                newsId: newsId,
                newsType: this.form.newsType,
                newsKeyword: this.form.newsKeyword,
                newsContent: this.form.newsContent,
                newsFrom:this.form.newsFrom,
                newsFor:this.form.newsFor,
                newsRef:this.form.newsRef,
                newsFor:this.form.newsFor,
                newsPicturesPath:this.form.newsPicturesPath,
                picturesPathRemove:this.fileRemove,
          }).then(successResponse => {
            let message=successResponse.data.message;
            if (successResponse.data.code=== 200) {
                  this.$message({message: message, type: 'success'});
                  this.$router.replace({path: '/newsIndex'});
            }else{
                  this.$message({message: message, type: 'error'});
            }
          })
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
            this.newsContentShow=true;
        }else if("02"===opt){
            this.picturesPathShow=true;
            this.newsContentShow=false;
            this.form.newsContent='';
        }
    },
  }
}
</script>

<style scoped>
.dialogClass{
  margin-left: 200px;
  margin-top: 0px;
}
</style>
