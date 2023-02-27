<template>

    <div>
      <el-dialog title="流程部署" :visible="dialogVisibleTaskAdd" :before-close="handleClose" width="50%">
        <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-row>
            <el-col :span="20">
               <el-form-item label="流程key值"  prop="taskKey">
                              <el-input v-model="form.taskKey"></el-input>
                        </el-form-item>
            </el-col>
        </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleSubmit()">部署</el-button>
        </span>
      </el-dialog>
    </div>

</template>

<script>

export default {
  props: ['dialogVisibleTaskAdd'],
  data () {
    return {
      message: '来自子组件的消息',
      form: {},
      formRules: {
        taskKey:[{required: true, message: '请输入流程key值', trigger: 'blur'}],
    },
    }

  },
methods: {
    handleClose (done) {
      this.messageWarn('确认关闭？',done);
    },
    handleCancel () {
      this.$emit('cActive') // $emit应是用来子组件向父组件传参的,但是,这里我只是想改变父组件中isActive为false,
      // 对应事件cActive
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
        this.$axios.post('/task/deploy',{
            taskKey: this.form.taskKey,
        }).then(successResponse => {
              if (successResponse.status === 200) {
                this.$message({message: '流程部署成功', type: 'success'});
                // &emit向父组件提交form表单
                this.$emit('cAdd', this.form)
              }else{
                this.$alert('流程部署失败,请联系管理员！');
              }
        })
     },
    // 如果确认,就取消弹窗
    messageWarn(message,done){
      this.$confirm(message).then(_ => {this.$emit('cActive') ,done()}).catch(_ => {});
    },
  },

}
</script>

<style scoped>

</style>
