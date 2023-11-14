<template>

  <div>
    <el-dialog title="职员信息新增" :visible="dialogVisibleVenuesDetail" :before-close="handleClose" width="50%">
      <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="中文名:" prop="staffName">
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
      this.$confirm('确认关闭？')
          .then(_ => {
            this.$emit('cActive') // 如果确认,就取消弹窗,
            done()
          })
          .catch(_ => {})
    },
  },

}
</script>

<style scoped>

</style>
