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
                       action="http://localhost:7081/api/user/import"
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
                            1.职务：请选择”组员“或”组长“;<br/>
                            2.驻堂场所编号：请前往场所信息管理查看;<br/>
                            3.上传文件只能是xls、xlsx格式;<br/>
                         </span>
                    </div>
                    </el-upload>
                </el-form-item>

           </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSubmit">保存</el-button>
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
            this.$alert("上传失败", "error");
        },
        handleClose (done) {
          this.$emit('cActive_excel') // 如果确认,就取消弹窗,
          done()
        },
        handleCancel () {
          // 对应事件cActive
          this.$emit('cActive_excel');
          this.clearTag ();
        },
        //上传成功，保存数据
        handleSubmit () {
            //数据保存
            const array = this.userList;
            this.$axios.post('/user/import/add',array
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
