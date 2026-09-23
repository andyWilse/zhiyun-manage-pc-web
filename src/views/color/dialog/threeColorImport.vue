<template>
  <div>
    <el-dialog title="三色要素Excel文件导入" :visible="dialogThreeColorImport" :before-close="handleClose" width="40%">
        <div class="content-body">
            <el-form>
             <el-form-item label="下载模板:">
                <el-button
                    class="filter-item"
                    size="big"
                    type="primary"
                    icon="el-icon-download"
                    @click="downloadExcel()">
                    下载模板
                    </el-button>
             </el-form-item>
                <el-form-item label="导入文件:" prop="file">
                   <el-upload
                       accept=" .xls, .xlsx"
                       action="#"
                       ref="uploadRef"
                       :http-request="excelUpload"
                       :limit="1"
                       :file-list="fileList"
                       :before-upload="beforeUpload"
                       :on-success="upSuccess"
                       :on-error="upError">
                       <el-button size="big" type="primary" icon="el-icon-upload2">
                           <span class="iconfont icon-shangchuan" />上传文件
                       </el-button>
                   </el-upload>
                </el-form-item>

           </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleSubmit" type="primary">保存上传</el-button>
            <el-button @click="handleCancel" type="warning">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
    props: ['isactive', 'dialogThreeColorImport', 'index_from_parent'],
    data () {
        return {
            threeColorList:[],
            fileList: [],
        }
    },
    created(){

    },
    methods: {
        // 下载模板
        downloadExcel(){
            let a = document.createElement("a");
            //public下
            a.href = "./static/colorMode.xlsx";
            a.download = "三色要素模板.xlsx";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            a.remove();
        },

        // 上传文件之前
        beforeUpload(file) {
            const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
            //const whiteList = ["pdf", "doc", "docx", "xls", "xlsx"];
            const whiteList = ["xls", "xlsx"];
            if (whiteList.indexOf(fileSuffix) === -1) {
                this.$alert("上传文件只能是xls、xlsx格式", "error");
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$alert("上传文件大小不能超过 2MB", "error");
                return false;
            }
        },
        //上传文件
        excelUpload(param) {
            let reader = new FileReader();
            reader.readAsDataURL(param.file);
            let baseFile ='';
            reader.onload = e => {
                baseFile = e.target.result;
                // 此处可对该base64进行获取赋值传入后端
                this.$axios.post('/color/upload',{
                    fileContent:baseFile,
                    fileName:param.file.name
                }).then(successResponse => {
                    let data=successResponse.data;
                    if (data.code === 200) {
                        this.threeColorList=data.result;
                        this.$message({message: '文件上传成功，请保存！', type: 'success'});
                    }else{
                        this.$refs.uploadRef.clearFiles();
                        this.$alert(data.message, "问题：", {
                                confirmButtonText: '确定',
                                dangerouslyUseHTMLString:true,
                                showClose: false,
                                customClass:'my-alert-box'
                              });
                    }
                })
           }
        },
        // 上传成功
        upSuccess(e) {
        　　this.$refs.uploadRef.clearFiles();
            var code=e.code;
            var message=e.message;
            if (200 === code) {
                this.threeColorList=e.result;
                this.$message({message: '文件上传成功，请点击保存', type: 'success'});
                this.$emit('three_import');
            }else if (500 === code) {
                this.$message({message: message, type: 'warning'});
            }
        },
        // 上传失败
        upError(e) {
            this.$alert("上传失败", "error");
            this.$refs.uploadRef.clearFiles();
            this.$emit('three_import');
        },
        // 关闭弹窗
        handleClose (done) {
          this.$refs.uploadRef.clearFiles();
          this.$emit('three_import');
          done();
        },
        //取消弹窗
        handleCancel () {
          this.$refs.uploadRef.clearFiles();
          this.$emit('three_import');
        },
        //上传成功，保存数据
        handleSubmit () {
            //数据保存
            this.$axios.post('/color/import',{threeColorList:this.threeColorList,}
                ).then(successResponse => {
                let data=successResponse.data;
                if (data.code === 200) {
                    this.$message({message: data.message,type: 'success'});
                    this.$refs.uploadRef.clearFiles();
                    this.$emit('three_import');
                }else{
                    this.$refs.uploadRef.clearFiles();
                    this.$message({message: data.message, type: 'warning'});
                }
            })
        },
    },
}
</script>

<style scoped>
    .main-container {
      color: black;
      border: 1px solid black;
      margin-left:0px;
      margin-right: 0px;
      margin-top:0px;
      padding: 10px;
    }

    .row-class{
        margin-top:5px;
    }

    .spa-class{
        color:black;
        ord-break: break-word;
        white-space: pre-wrap;
        overflow-wrap: break-word;
    }
    my-alert-box {
    width: 350px;
    background-color: #f5f7fa;
    border-radius: 8px;
    }
    my-alert-box .el-message-box__title {
    color: #409EFF;
    font-weight: bold;
    }


</style>
