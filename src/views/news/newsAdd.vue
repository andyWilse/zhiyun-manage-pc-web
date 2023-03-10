<template>

  <div>
    <el-dialog title="新闻信息新增" class="dialogClass"
               :visible="dialogVisibleNewsAdd" :before-close="handleClose" width="100%">
      <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-row>
            <el-form-item label="新闻标题:" prop="newsTitle">
              <el-input v-model="form.newsTitle"></el-input>
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新闻类别:" prop="newsType">
            <el-select v-model="form.newsType"  placeholder="请选择">
              <el-option
                  v-for="item in newsTypeArr"
                  :key="item.dictCd"
                  :label="item.dictCnDesc"
                  :value="item.dictCd"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新闻来源:" prop="newsFrom">
            <el-input v-model="form.newsFrom"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新闻链接:" prop="newsRef">
            <el-input v-model="form.newsRef"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新闻关键字:" prop="newsKeyword">
            <el-input v-model="form.newsKeyword" placeholder="多个关键字请用逗号（ ，）隔开"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新闻内容:" prop="newsContent">
            <el-input v-model="form.newsContent"></el-input>
          </el-form-item>
        </el-row>

<!--        <el-row>
          <el-col :span="24">
            <el-form-item label="内容" prop="nr" class="form-item-content">
              <quill-editor ref="myQuillEditor" v-model="form.nr" class="editor" :options="editorOption" @focus="quillEditorFocus($event)"/>
            </el-form-item>
          </el-col>
        </el-row>-->

      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleSubmit()">确定</el-button>
        </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "newsAdd",
  props: ['dialogVisibleNewsAdd'],
  data () {
    return {
      message: '来自子组件的消息',
      newsTypeArr:[],
      fileList:[],
      form: {
        newsTitle: '',
        newsType: '',
        newsKeyword: '',
        newsContent: '',
        newsFrom:'',
        newsRef:'',
      },
      formRules: {
        newsTitle:[{required: true, message: '请输入新闻标题', trigger: 'blur'}],
      },
    }

  },
  created(){
    this.getNewsTypeArr();
  },
  methods: {
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
    // $emit应是用来子组件向父组件传参的,但是,这里我只是想改变父组件中isActive为false,
    handleCancel () {
      // 对应事件cActive
      this.$emit('cActive')
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
      this.$axios.post('/news/add', {
        newsTitle: this.form.newsTitle,
        newsType: this.form.newsType,
        newsKeyword: this.form.newsKeyword,
        newsContent: this.form.newsContent,
        newsFrom:this.form.newsFrom,
        newsRef:this.form.newsRef,
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$message.info({message: '新增新闻信息成功！', type: 'success'});
          // 对应事件cAdd
          // &emit向父组件提交form表单
          this.$emit('cAdd', this.form)
          this.$refs.elupload.clearFiles()
        }else{
          this.$alert('新增新闻信息失败,请联系管理员！');
        }
      })
    },
    childaddClick () {
      this.form.newsTitle = ''
      this.form.newsType = ''
      this.form.newsKeyword = ''
      this.form.newsContent = ''
      this.form.newsFrom=''
      this.form.newsRef=''
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('cActive') // 如果确认,就取消弹窗,
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

  },

}
</script>

<style scoped>
.dialogClass{
  margin-left: 200px;
  margin-top: 0px;
}
</style>
