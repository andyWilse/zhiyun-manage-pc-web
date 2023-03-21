<template>
  <div>
      <el-dialog title="选择场所" :visible="dialogVisibleVenuesSelect" :before-close="handleClose" width="60%">
      <el-table
              :data="venuesList"
              border
              stripe
              style="width: 100%"
              ref="checkTable"
              @select="checkSelect"
          >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>

        <el-table-column
            prop="venuesName"
            label="场所名称"
            width="200"
            align="center"
            fixed>
        </el-table-column>

        <el-table-column
            prop="venuesAddres"
            label="场所地址"
            width="500"
            align="center">
        </el-table-column>
        </el-table>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleSubmit()">确定</el-button>
        </span>

      </el-dialog>
  </div>
</template>

<script>

export default {
  props: ['dialogVisibleVenuesSelect'],
  data () {
    return {
      message: '来自子组件的消息',
      venuesList:[],
      venuesIds:'',
      venuesNms:'',
    }
  },

  //方法
  methods: {
        //获取id值
        checkSelect(data){
        },
        //确认
        handleSubmit () {
            let data=this.$refs.checkTable.selection;
            let id='';
            let name='';
            for(var i = 0; i < data.length; i++){
                if(i===data.length-1){
                    id=id+data[i].venuesId;
                    name=name+data[i].venuesName;
                }else{
                    id=id+data[i].venuesId+',';
                    name=name+data[i].venuesName+',';
                }
            }
            this.venuesIds=id;
            this.venuesNms=name;
            this.$refs.checkTable.clearSelection();
            this.$emit('cmodify', this.venuesIds);
        },

        // 取消
        handleCancel () {
            // 清除选中的数据
            this.$refs.checkTable.clearSelection();
            this.venuesIds='';
            this.venuesNms='';
            this.$emit('cActive_modify');
        },

        childmodifyClick () {
        },
        //关闭
        handleClose (done) {
            this.$refs.checkTable.clearSelection();
            this.venuesIds='';
            this.venuesNms='';
            this.$confirm('确认关闭？').then(_ => {
                this.$emit('cActive_modify') // 如果确认,就取消弹窗,
                done()
            }).catch(_ => {})
        },
    }
}
</script>

<style scoped>

</style>
