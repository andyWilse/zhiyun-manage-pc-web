<template>
  <div>
    <el-dialog title="场所信息" :visible="dialogVenuesDetail" :before-close="handleClose" width="50%">
        <el-form ref="form" :model="form" label-width="100px">
            <el-row :gutter="24">
                <el-col :span="20">
                    <el-form-item label="所属机构"  prop="organization">
                        <el-input v-model="form.organization" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="20">
                    <el-form-item label="登记证号" prop="registerNbr">
                        <el-input v-model="form.registerNbr" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="10">
                    <el-form-item label="经度"  prop="longitude">
                        <el-input v-model="form.longitude" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="维度" prop="latitudes">
                        <el-input v-model="form.latitudes" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">关闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['isactive', 'dialogVenuesDetail', 'index_from_parent'],
  data () {
    return {
      message: '来自子组件的消息',
      form: {
        organization:'',
        registerNbr:'',
        longitude:'',
        latitudes:'',
      },
    }
  },

  methods: {
    /*权限反显*/
    showDetail(data){
        this.form.longitude=data;
        this.form.organization= data.organization;
        this.form.registerNbr= data.registerNbr;
        this.form.longitude= data.longitude;
        this.form.latitudes= data.latitudes;
    },
    handleCancel () {
      // 对应事件cActive
      this.$emit('cActive_detail');
    },
    handleClose (done) {
      this.$emit('cActive_detail');
      done();
    },
  }
}
</script>

<style scoped>

</style>
