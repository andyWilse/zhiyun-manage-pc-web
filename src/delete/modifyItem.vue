<template>
  <div>
    <el-dialog title="修改场所信息" :visible="dialogVisibleVenuesModify" :before-close="handleClose" width="50%">
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="id" prop="venuesId" v-show="false">
          <el-input v-model="form.venuesId" class="venuesName-input"></el-input>
        </el-form-item>
        <el-form-item label="religious" prop="religious" v-show="false">
          <el-input v-model="form.religious" class="religiousclass"></el-input>j
        </el-form-item>
        <el-form-item label="照片:" prop="picturesPath" v-show="false">
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="场所名称" prop="venuesName" >
              <el-input v-model="form.venuesName" class="venuesName-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教派类别" prop="religiousSect">
              <el-select v-model="form.religiousSect" @change="selectChanged" placeholder="----------- 请选择 -----------">
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
            <el-form-item label="登记证号" prop="registerNbr">
              <el-input v-model="form.registerNbr" class="rn-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场所电话" prop="venuesPhone">
              <el-input v-model="form.venuesPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="responsiblePerson">
              <el-input v-model="form.responsiblePerson"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联络员" prop="liaisonMan">
              <el-input v-model="form.liaisonMan"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="场所地址" prop="venuesAddres" readonly="true" class="va-input">
              <el-input v-model="form.venuesAddres"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属机构" prop="organization">
              <el-input v-model="form.organization"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="简介:" prop="briefIntroduction">
              <el-input v-model="form.briefIntroduction"
                        placeholder="请填写"
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

  <!--       <h1>场所照片：</h1>
        <el-image
            style="width: 150px; height: 100px"
            v-for="item in imagesrcList"
            :src="'data:image/png;base64,' +item.filePath"
            :key="item.fileId"
            :preview-src-list="getImgList(imagesrcList)"
        >
        </el-image>-->

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
        <el-button @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['isactive', 'dialogVisibleVenuesModify', 'index_from_parent'],
  data () {
    return {
      message: '来自子组件的消息',
      religiousSects:[],
      imagesrcList:[],
      fileList:[],
      form: {
        venuesName: '',
        religiousSect: '',
        registerNbr: '',
        venuesPhone: '',
        organization: '',
        venuesAddres: '',
        /*picturesPath:'',*/
        responsiblePerson:'',
        liaisonMan:'',
        venuesId:'',
        briefIntroduction:'',
      }
    }
  },
  created(){
    this.getReligiousSect();
  },
  methods: {
    handleCancel () {
      this.$emit('cActive_modify') // $emit应是用来子组件向父组件传参的,但是,这里我只是想改变父组件中isActive为false,
      // 对应事件cActive
    },
    async getReligiousSect(){
      this.$axios.get('/dict/getSysDict', {
        params: {
          dictTypeCd: '1001',
        }
      }).then(successResponse => {
        if (successResponse.data.code  === 200) {
          this.religiousSects=successResponse.data.resultArr;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },
    handleSubmit () {
      this.$emit('cmodify', this.form)
      // 对应事件cAdd
      // &emit向父组件提交form表单
      this.$axios
          .post('/venues/updateVenues', {
            venuesName: this.form.venuesName,
            religiousSect: this.form.religiousSect,
            registerNbr: this.form.registerNbr,
            venuesPhone: this.form.venuesPhone,
            organization: this.form.organization,
            venuesAddres: this.form.venuesAddres,
            picturesPath: this.form.picturesPath,
            responsiblePerson: this.form.responsiblePerson,
            liaisonMan: this.form.liaisonMan,
            venuesId: this.form.venuesId,
            briefIntroduction: this.form.briefIntroduction,

          })
          .then(successResponse => {
            if (successResponse.data.code === 200) {
              this.$alert('修改场所信息成功！');
              // 对应事件cAdd
              // &emit向父组件提交form表单
              this.$emit('cmodify', this.form);
              this.$refs.elUpload.clearFiles();
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
    //循环展示图片
    getImgList(srcLis) {
      let arr = []
      let i = 0
      for (i; i < srcLis.length; i++) {
        arr.push(srcLis[i].filePath)
      }
      return arr
    },
  /*  childmodifyClick () {
      /!*this.form.venuesName = ''
      this.form.registerNbr = ''
      this.form.religiousSect = ''
      this.form.venuesAddres = ''
      this.form.venuesPhone = ''
    },*/
    selectChanged(params) {
        this.religiousSects.map(item => {
            if(item.dictCd == params){
                this.form.religious = item.dictCnDesc
            }
        })
     },
     // 上传成功
         imgSuccess(res, file, fileList) {
           this.fileList = fileList;
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
  }
}
</script>


<style lang="less" scoped>
.el-form-item__label{
  /* 给el-form组件的label标签颜色修改 */
  color: #FFFFFF;
}

.venuesName-input /deep/ .el-input__inner{
  /* 使input框的背景变透明 */
  background-color: lightgray;
  /* 使边框也变透明 */
  /*border-color: transparent;
  !* 给边框加阴影能够使其有立体感 *!
  box-shadow: 2px 2px 0 0 rgba(0,0,0,0.2);
  !* 改变获取焦点后的竖线颜色 *!
  caret-color: rgba(0, 255, 255,0.8);
  color:#FFFFFF;*/
}

.va-input /deep/ .el-input__inner{
  background-color: lightgray;
}
.rn-input /deep/ .el-input__inner{
  background-color: lightgray;
}

.el-input__inner:hover{
  border-color: rgb(0, 255, 255);
}

.el-input__inner:focus{
  border-color: aqua;
}

</style>



