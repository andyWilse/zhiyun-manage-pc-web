<template>
  <div>
      <el-dialog
          title="选择场所"
          :visible="dialogUserVenuesSelect"
          :before-close="handleClose"
          width="60%"
          @open="show"
      >
      <el-table
              ref="checkTable"
              :data="venuesList"
              tooltip-effect="dark"
              style="width: 100%"
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
  props: ['dialogUserVenuesSelect'],
  data () {
    return {
      message: '来自子组件的消息',
      venuesList:[],
      selects:[],
      selectData:[],
      userId:0,
      userNm:'',

    }
  },

  //方法
  methods: {
    //获取id值
    checkSelect(){
        let data=this.$refs.checkTable.selection;
        this.selectData=data;
    },
    //场所
    getSelect(data){
        this.userId=data[0];
        this.userNm=data[1];
        this.venuesList=data[2];
    },
  //场所多选弹出框
      getVenuesList(query) {
          //执行查询
          this.$axios.get('/venues/querySelect', {
              params: {
                  search: query,
                  town:this.regions.town
              }
          }).then(successResponse => {
              if (successResponse.data.code === 200) {
                  this.venuesList=successResponse.data.resultArr;
              }else{
                  let message=successResponse.data.result;
                  if(''!=message && null!=message){
                      this.$alert(message);
                  }else{
                      this.$router.replace({path: '/'})
                  }
              }
          });
      },
        //回显
        show(){
            setTimeout(() => {
                //console.log(this.$refs);
                if(this.selects !== undefined && this.selects !==''){
                    if(this.selects.length>0){
                        for(let k=0;k<this.selects.length;k++){
                            let kv=this.selects[k].venuesId;
                            for(let i=0;i<this.venuesList.length;i++){
                                let hv=this.venuesList[i].venuesId;
                                if(kv==hv){
                                    this.$refs.checkTable.toggleRowSelection(this.venuesList[i]);
                                }
                            }
                        }
                    }
                }
              }, 0)
        },
        //确认
        handleSubmit () {
           let userId=this.userId;
           let userNm=this.userNm;
           let selects=this.selectData;
           this.$axios.post('/user/addVenue/',{
               venueList: this.selectData,
               userId: userId,
               userNm: userNm,
               }).then(successResponse => {
                   if (successResponse.data.code === 200) {
                       this.$message({message: '三人驻堂成员加入场所成功！', type: 'success'});
                       this.$emit('cActive_addVe');
                   }else{
                       let mes= successResponse.data.message;
                       this.$message({type: "error", message: mes,});
                   }
           })
        },

        // 取消
        handleCancel () {
            // 清除选中的数据
            this.$refs.checkTable.clearSelection();
            this.$emit('cActive_addVe');
        },
        //关闭
        handleClose (done) {
            this.$confirm('确认关闭？').then(_ => {
                this.$refs.checkTable.clearSelection();
                this.$emit('cActive_addVe');
                done()
            }).catch(_ => {})
        },
    }
}
</script>

<style scoped>

</style>
