<template>
  <div>
    <el-dialog  title="流程信息" :visible="dialogAssAdd" :before-close="handleClose" width="70%">

        <el-form  class="assClass" ref="form" :model="form" label-width="100px" style="height: 350px;">
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="电话" prop="assMobile">
                        <el-input v-model="form.assMobile" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="姓名" prop="assAssignee">
                        <el-input v-model="form.assAssignee" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleSubmit" type="primary">保存</el-button>
            <el-button @click="handleCancel" type="warning">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    props: ['isactive', 'dialogAssAdd', 'index_from_parent'],
    data () {
        return {
            message: '来自子组件的消息',
            actId:'',
            form: {},
        }
    },
    created(){
    },
    methods: {
        init(data){
            this.actId = data;
        },
        //取消
        handleCancel () {
          // 对应事件cActive
          this.$emit('cAss_add');
        },
        //关闭
        handleClose (done) {
          this.$emit('cAss_add');
          done();
        },
        handleSubmit () {
            this.$alert(this.actId);
            this.form.actId = this.actId;
            //保存修改
            this.$axios.post('/aiWarnTask/saveAss',{actReceiver:this.form}
            ).then(successResponse => {
                if (successResponse.data.code === 200) {

                }else{

                }
              })
        },
    }
}
</script>

<style scoped>
.item{
    .item_input{
      display: none;
      width: 100px;
      /* 调整elementUI中样式 如果不需要调整请忽略 */
      .el-input__inner{
        height: 24px!important;
      }
      /* 调整elementUI中样式 如果不需要调整请忽略 */
      .el-input__suffix{
        i{
          font-size: 12px !important;
          line-height: 26px !important;
        }
      }
    }
    .item_txt{
      box-sizing: border-box;
      line-height: 24px;
      padding: 0 9px;
    }

    assClass .el-dialog__body {
    max-height: 70vh;
    overflow-y: auto;
    }
  }
</style>
