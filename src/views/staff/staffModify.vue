<template>
  <div>
    <el-dialog title="修改职员信息" :visible="dialogVisibleStaffModify" :before-close="handleClose" width="50%">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">

        <el-form-item label="id" prop="staffId" v-show="false">
          <el-input v-model="form.staffId" class="staffclass"></el-input>j
        </el-form-item>

        <el-form-item label="religious" prop="religious" v-show="false">
          <el-input v-model="form.religious" class="religiousclass"></el-input>j
        </el-form-item>

        <el-form-item label="照片:" prop="staffPicture" v-show="false">
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="中文名:" prop="staffName">
              <el-input v-model="form.staffName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教派类别:" prop="religiousSect">
              <el-select v-model="form.religiousSect"  placeholder="----------- 请选择 -----------"  @change="selectChanged">
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
            <el-form-item label="职位:"  prop="staffPost">
              <el-select v-model="form.staffPost"  placeholder="----------- 请选择 -----------">
                <el-option
                    v-for="item in staffPostList"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码:" prop="staffTelphone">
              <el-input v-model="form.staffTelphone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="证件类型:" prop="certTypeCd" >
              <el-select v-model="form.certTypeCd"  placeholder="----------- 请选择 -----------">
                <el-option
                    v-for="item in certTypeCdArr"
                    :key="item.dictCd"
                    :label="item.dictCnDesc"
                    :value="item.dictCd"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码:" prop="certNbr">
              <el-input v-model="form.certNbr"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        label-width="120px"-->
        <el-row>
          <el-form-item label="宗教场所:" prop="venuesAddres">
            <el-select v-model="form.venuesAddres"  placeholder="----------- 请选择 -----------">
              <el-option
                  v-for="item in venueslist"
                  :key="item.venuesId"
                  :label="item.venuesAddres"
                  :value="item.venuesId"
              />
            </el-select>
          </el-form-item>
        </el-row>

        <h1>场所照片：</h1>
        <el-image
            style="width: 150px; height: 100px"
            v-for="item in imagesrcList"
            :src="'data:image/png;base64,' +item.filePath"
            :key="item.fileId"
            :preview-src-list="getImgList(imagesrcList)"
        >
        </el-image>
      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSubmit">确定</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
export default {
  props: ['isactive', 'dialogVisibleStaffModify', 'index_from_parent'],
  data () {
    return {
      message: '来自子组件的消息',
      religiousSects:[],
      certTypeCdArr:[],
      venueslist:[],
      imagesrcList:[],
      staffPostList:[
        {"name":"普通职员","key":1},
        {"name":"管理","key":2}
      ],
      fileList:[],
      form: {
        staffName: '',
        religiousSect: '',
        staffPost: '',
        staffTelphone: '',
        certTypeCd:'',
        certNbr:'',
        relVenuesId:''
      },
      rules: {
        staffName:[{required: true, message: '请输入中文名称', trigger: 'blur'}],
        certNbr: [{ required: true, message: '请输入有效证件名称', trigger: 'blur' }],
        religiousSect: [{ required: true, message: '请选择宗教类别', trigger: 'change' }],
      },
    }
  },
  created(){
    this.getReligiousSect();
    this.getCertTypeCd();
    this.getVenueslist();
  },
  methods: {
    handleCancel () {
      this.$emit('cActive_modify') // $emit应是用来子组件向父组件传参的,但是,这里我只是想改变父组件中isActive为false,
      // 对应事件cActive
    },
    getVenueslist(){
      this.$axios.get('/venues/queryAll', {
        params: {
             search:''
        }
      }).then(successResponse => {
        if (successResponse.status === 200) {
          this.venueslist=successResponse.data;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },
    getCertTypeCd(){
      this.$axios.get('/dict/getSysDicts', {
        params: {
          dictTypeCd: '3010',
        }
      }).then(successResponse => {
        if (successResponse.status === 200) {
          this.certTypeCdArr=successResponse.data;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },
    async getReligiousSect(){
      this.$axios.get('/dict/getSysDicts', {
        params: {
          dictTypeCd: '1001',
        }
      }).then(successResponse => {
        if (successResponse.status === 200) {
          this.religiousSects=successResponse.data;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },

    handleSubmit () {
      this.$emit('cmodify', this.form)
      // 对应事件cAdd
      // &emit向父组件提交form表单
      this.$axios.post('/staff/update', {
            staffName: this.form.staffName,
            religiousSect: this.form.religiousSect,
            staffPost: this.form.staffPost,
            staffTelphone: this.form.staffTelphone,
            certTypeCd: this.form.certTypeCd,
            certNbr: this.form.certNbr,
            relVenuesId: this.form.relVenuesId,
            staffId: this.form.staffId,
            staffPicture: this.form.staffPicture
      })
          .then(successResponse => {
            if (successResponse.data.code === 200) {
              //this.$message.info('修改职员信息成功！');
              this.$alert('修改场所信息成功！');

              // 对应事件cAdd
              // &emit向父组件提交form表单
              this.$emit('cmodify', this.form)
            }else{
              this.$router.replace({path: '/error'})
            }
          })
    },
    /*childaddClick () {
      this.form.staffName = ''
    },*/
    handleClose (done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('cActive_modify') // 如果确认,就取消弹窗,
            done()
          })
          .catch(_ => {})
    },
    handleupload(param) {
      this.fileList.push(param);// 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
    },
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

    selectChanged(params) {
        this.religiousSects.map(item => {
        	if(item.dictCd == params){
        		this.form.religious = item.dictCnDesc
        	}
        })
     },
  }
}
</script>

<style scoped>

</style>
