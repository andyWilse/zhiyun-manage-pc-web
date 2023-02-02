<template>
  <div>
    <el-dialog title="修改新闻信息" :visible="dialogVisibleNewsModify" :before-close="handleClose" width="50%">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">

        <el-form-item label="新闻id:" prop="newsId" v-show="false">
          <el-input v-model="form.newsId"></el-input>
        </el-form-item>

        <el-row>
          <el-form-item label="新闻标题:" prop="newsTitle">
            <el-input v-model="form.newsTitle"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新闻类别:" prop="newsType">
            <el-select v-model="form.newsType"  placeholder="----------- 请选择 -----------">
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
            <el-input v-model="form.newsKeyword"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="新闻内容:" prop="newsContent">
            <el-input v-model="form.newsContent"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
<!--      <el-image
          style="width: 150px; height: 100px"
          v-for="item in imagesrcList"
          :src="'data:image/png;base64,' +item.filePath"
          :key="item.fileId"
          :preview-src-list="getImgList(imagesrcList)"
      >
      </el-image>-->

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSubmit">确定</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "newsModify",
  props: ['isactive', 'dialogVisibleNewsModify', 'index_from_parent'],
  data () {
    return {
      message: '来自子组件的消息',
      newsTypeArr:[],
      imagesrcList:[],
      fileList:[],
      form: {
        newsTitle: '',
        newsType: '',
        newsKeyword: '',
        newsContent: '',
        newsFrom:'',
        newsRef:'',
      },
      rules: {
        newsTitle:[{required: true, message: '请输入中文名称', trigger: 'blur'}],
      },
    }
  },
  created(){
    this.getNewsTypeArr();
  },
  methods: {
    async getNewsTypeArr(){
      this.$axios.get('/dict/getSysDicts', {
        params: {
          dictTypeCd: '1002',
        }
      }).then(successResponse => {
        if (successResponse.status === 200) {
          this.newsTypeArr=successResponse.data;
        }else{
          this.$alert('数据获取失败,请联系管理员！');
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
      this.$axios.post('/news/update', {
        newsTitle: this.form.newsTitle,
        newsId: this.form.newsId,
        newsType: this.form.newsType,
        newsKeyword: this.form.newsKeyword,
        newsContent: this.form.newsContent,
        newsFrom:this.form.newsFrom,
        newsRef:this.form.newsRef,
      }).then(successResponse => {
        if (successResponse.data.code=== 200) {
          this.$message.info('修改新闻信息成功！');
          // 对应事件cAdd
          // &emit向父组件提交form表单
          this.$emit('cmodify', this.form)
        }else{
          this.$alert('修改新闻信息失败,请联系管理员！');
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
  }
}
</script>

<style scoped>

</style>
