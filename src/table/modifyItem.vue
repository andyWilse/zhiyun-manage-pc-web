<template>
  <div>
    <el-dialog title="修改场所信息" :visible="dialogVisibleVenuesModify" :before-close="handleClose" width="50%">
      <el-form ref="form" :model="form" label-width="80px">

        <el-form-item label="id" prop="venuesId" v-show="false">
          <el-input v-model="form.venuesId" class="venuesName-input"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="场所名称" prop="venuesName" >
              <el-input v-model="form.venuesName" class="venuesName-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教派类别" prop="religiousSect">
              <el-select v-model="form.religiousSect"  placeholder="----------- 请选择 -----------">
                <el-option
                    v-for="item in religiousSects"
                    :key="item.dictCd"
                    :label="item.dictCnDesc"
                    :value="item.dictCnDesc"
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
<!--
        <el-form-item label="照片1" prop="picturesPath">
          <el-input v-model="form.picturesPath"></el-input>
        </el-form-item>-->

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
<!--
          <el-col :span="12">
            <el-form-item label="状态" prop="venuesStatus">
              <el-input v-model="form.venuesStatus"></el-input>
            </el-form-item>
          </el-col>-->
        </el-row>

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
  props: ['isactive', 'dialogVisibleVenuesModify', 'index_from_parent'],
  data () {
    return {
      message: '来自子组件的消息',
      religiousSects:[],
      form: {
        venuesName: '',
        religiousSect: '',
        registerNbr: '',
        venuesPhone: '',
        organization: '',
        venuesAddres: '',
        picturesPath:'',
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
              this.$message.info('修改场所信息成功');
              // 对应事件cAdd
              // &emit向父组件提交form表单
              this.$emit('cmodify', this.form)
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
  /*  childmodifyClick () {
      /!*this.form.venuesName = ''*!/
      this.form.registerNbr = ''
      this.form.religiousSect = ''
      this.form.venuesAddres = 'dddd'
      this.form.venuesPhone = ''
    },*/
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



