<template>
  <div>
    <el-form :model="loginForm">
      <el-form-item label="手机号">
        <el-input type="text" v-model="loginForm.username" style="width: 200px"></el-input>
      </el-form-item>
 <el-form-item  prop="fileList">
            <el-row>
              <el-col>
               		<el-upload
                           action="http://zszjadmin.860577.net:8808/api/file/pc/imagesUpload"
                           list-type="picture-card"
                           :on-preview="handlePictureCardPreview"
                           :on-success="imgSuccess1"
                           :on-error="imgError1"
                           :on-remove="imgRemove1"
                           :file-list="fileList2"
                         >
                           <i class="el-icon-plus"></i>
                         </el-upload>

              </el-col>
            </el-row>
          </el-form-item>
<el-button size="small" type="primary">点击上传</el-button>
    </el-form>
  </div>
</template>
<script>
//这是我封装的axios的方法，各位自己写即可

export default {
  name: "Login",
  data(){
    return{
      loginForm: {
        code:'',
        username:''
      },
fileList2:[{name: '2023013122461811.png', url: 'http://zypc.860577.net:8808/super/20230317/2023031720575011.png'}],
fileRemove:'',
fileUpload:'',
    }
  },
  methods:{
// 删除图片
    imgRemove1(file, fileList) {
        let url=file.url;
        if(url.includes('blob:http:')){

        }
    let aa=file.response.result;
      this.fileList1 = fileList;
    },

    // 上传失败
    imgError1(res) {
      this.$message({
        type: "error",
        message: "附件上传失败",
      });
    },
    handlePictureCardPreview(file) {
      console.log(file);
    },
    // 上传成功
    imgSuccess1(res, file, fileList) {
    this.imageUrl = URL.createObjectURL(file.raw);
          //重点  得到上传图片的名字
          //this.ruleForm.userHeaderPicture = res.result
          this.fileUpload=this.fileUpload+res+',';
      this.fileList1 = fileList;
    },

  },
  computed:{
  }
}
</script>
