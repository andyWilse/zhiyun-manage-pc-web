<template>
  <div>
    <el-dialog title="三人驻堂Excel文件上传" :visible="dialogVisibleExcel" :before-close="handleClose" width="40%">
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
                       accept=".pdf, .doc, .docx, .xls, .xlsx"
                       ref="uploadRef"
                       :http-request="excelUpload"
                       :limit="1"
                       :before-upload="beforeUpload"
                       :on-success="upSuccess"
                       :on-error="upError">
                       <el-button size="big" type="primary" icon="el-icon-upload2">
                           <span class="iconfont icon-shangchuan" />上传文件
                       </el-button>
                   </el-upload>
                    <div >
                         <span class="spa-class">
                            注意事项：<br/>
                            1.请下载模板后填写;<br/>
                            2.编辑表格时，请“启用宏”;<br/>
                         </span>
                    </div>
                </el-form-item>

           </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleSubmit" type="primary">保存</el-button>
        <el-button @click="handleCancel" type="warning">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['isactive', 'dialogVisibleExcel', 'index_from_parent'],
  data () {
    return {
        userList:[],
    }
  },
    created(){

    },
    methods: {
        // 下载模板
        downloadExcel(){
            let a = document.createElement("a");
            //public下
            a.href = "./static/srzt.xlsx";
            a.download = "三人驻堂模板.xlsx";
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
                this.$alert("上传文件只能是 pdf、doc、docx、xls、xlsx格式", "error");
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$alert("上传文件大小不能超过 2MB", "error");
                return false;
            }
        },
        // 上传成功
        upSuccess(e) {
            var code=e.code;
            var message=e.message;
            if (200 === code) {
                this.userList=e.result;
                this.$message({message: message, type: 'success'});
            }else if (500 === code) {
                this.$message({message: message, type: 'warning'});
            }
        },
        // 上传失败
        upError(e) {
            this.$refs.uploadRef.clearFiles();
            this.$alert("上传失败", "error");
        },
        handleClose (done) {
          this.$refs.uploadRef.clearFiles();
          this.$emit('cActive_excel') // 如果确认,就取消弹窗,
          done()
        },
        handleCancel () {
          // 对应事件cActive
          this.$refs.uploadRef.clearFiles();
          this.$emit('cActive_excel');
        },

        //上传文件
        excelUpload(param) {
            let reader = new FileReader();
            reader.readAsDataURL(param.file);
            let baseFile ='';
            reader.onload = e => {
                baseFile = e.target.result;
                // 此处可对该base64进行获取赋值传入后端
                this.$axios.post('/user/import',{
                    fileContent:baseFile,
                    fileName:param.file.name
                }).then(successResponse => {
                    let data=successResponse.data;
                    if (data.code === 200) {
                        this.userList=data.result;
                        this.$message({message: '文件上传成功，请保存！', type: 'success'});
                    }else{
                        this.$alert(data.message, "问题：", {
                            confirmButtonText: '确定',
                            dangerouslyUseHTMLString:true,
                            showClose: false,
                            customClass:'my-alert-box'
                        });
                        this.$refs.uploadRef.clearFiles();
                    }
                })
           }
        },
        //上传成功，保存数据
        handleSubmit () {
            //数据保存
            const array = this.userList;
            this.$axios.post('/user/import/add',{sysUserList:this.userList,}
            ).then(successResponse => {
            if (successResponse.data.code === 200) {
              this.$message({message: '三人驻堂excel导入数据保存成功！',type: 'success'});
              this.$emit('cActive_excel'); // 如果确认,就取消弹窗,
            }else{
              this.$router.replace({path: '/'})
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


</style>
