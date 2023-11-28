<template>

  <div >
    <el-dialog title="场所详情" :visible="dialogVisibleVenuesDetail" :before-close="handleClose" >
      <el-form ref="form" :model="form"  :rules="formRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="场所名称:" prop="staffName">
              <el-input v-model="form.staffName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
export default {
  props: ['dialogVisibleVenuesDetail'],
  data () {

    return {
      message: '来自子组件的消息',
      religiousSects:[],
      form: {
              staffName: '',

            },
            formRules: {},
    }

  },
  created(){

  },

  methods: {
    handleClose (done) {
      this.$emit('cActive'); // 如果确认,就取消弹窗,
      done();
    },
  },

}
</script>

<style scoped>

</style>
