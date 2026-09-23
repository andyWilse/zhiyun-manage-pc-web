<template>
  <div>
      <el-dialog title="选择用户：" :visible="dialogAssAdd" :before-close="handleClose" width="50%">
      <el-form :model="searchForm" label-width="100px" class="searchForm">
          <el-row >
           <el-col :span="12">
                <el-form-item label="用户名称:">
                  <el-input v-model="searchForm.one" placeholder="用户名称" clearable></el-input>
                </el-form-item>
           </el-col>
           <el-col :span="6">
               <el-button class="qclass" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
           </el-col>
          </el-row>

      </el-form>
      <el-table
              :data="tableData"
              border
              stripe
              style="width: 100%"
              ref="checkTable"
              @select="checkSelect">

            <el-table-column
                type="selection"
                width="50">
            </el-table-column>

            <el-table-column
                prop="userNm"
                label="中文名称"
                width="350"
                align="center"
                fixed>
            </el-table-column>

            <el-table-column
                prop="userMobile"
                label="电话"
                width="300"
                align="center">
            </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleSubmit()" type="primary">保存</el-button>
          <el-button @click="handleCancel" type="warning">取消</el-button>
        </span>

        <div style="display:flex;justify-content:flex-start">
            <el-pagination
                background
                @current-change="currentChange"
                @size-change="sizeChange"
                layout="total,sizes, prev, pager, next, jumper, ->,  slot"
                :total="total">
            </el-pagination>
          </div>
      </el-dialog>
  </div>
</template>

<script>

export default {
  props: ['dialogAssAdd'],
  data () {
    return {
      message: '来自子组件的消息',
      selectData:[],
      tableData:[],
      page:1,
      size:10,
      total:0,
      searchForm: {
          one: null
      },
      redisSr:[],
    }
  },

  //方法
  methods: {
        //列表获取
        getSelect(data){
            this.$axios.get('/user/find', {
            params: {
              page: this.page,
              size: this.size,
              userNm:this.searchForm.one,
            }
          }).then(successResponse => {
            if (successResponse.data.code === 200) {
              this.tableData=successResponse.data.result;
              this.total=successResponse.data.total;
            }else{
                  let message=successResponse.data.message;
                  if(''!=message && null!=message){
                    this.$message({message: message,type: 'warning'});
                  }else{
                    this.$message({message: '用户信息获取失败，请联系管理员！',type: 'error'});
                  }
            }
          })
        },

        //多选框选择
        checkSelect () {
            let data=this.$refs.checkTable.selection;
            this.selectData=data;
        },
        // 取消
        handleCancel () {
            // 清除选中的数据
            this.$refs.checkTable.clearSelection();
            this.$emit('cAss_add');
        },
        //关闭
        handleClose (done) {
            this.$refs.checkTable.clearSelection();
            this.$confirm('确认关闭？').then(_ => {
                this.$emit('cAss_add'); 
                done();
            }).catch(_ => {})
        },
        //翻页
        currentChange(currentPage){
          this.page=currentPage;
          this.getSelect();
        },
        //翻页
        sizeChange(pageSize){
          this.size=pageSize;
          this.getSelect();
        },
        //查询
       handleSearch () {
          this.page =1;
       },
       //确认
       handleSubmit(){
            this.redisSr=this.selectData;
            this.$emit('cAss_add');
       },

    }
}
</script>

<style scoped>
.qclass{
  float: right;
}
</style>
