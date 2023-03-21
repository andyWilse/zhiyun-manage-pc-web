<template>
  <div>
      <el-dialog title="场所选择" :visible="dialogVisibleStaff" :before-close="handleClose" width="50%">
      <el-form :model="searchForm" label-width="100px" class="searchForm">
        <el-row >
           <el-col :span="24">
                  <el-form-item label="已选职员:" prop="staff">
                      <el-input v-model="searchForm.staff"
                                placeholder=""
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}">
                      </el-input>
                </el-form-item>
           </el-col>
        </el-row>

          <el-row >
           <el-col :span="12">
                <el-form-item label="职员名称:">
                  <el-input v-model="searchForm.one" placeholder="职员名称" clearable></el-input>
                </el-form-item>
           </el-col>
           <el-col :span="6">
               <el-button class="qclass" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
           </el-col>
          </el-row>

      </el-form>
      <el-table
              :data="staffList"
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
                prop="staffName"
                label="中文名称"
                width="350"
                align="center"
                fixed>
            </el-table-column>

            <el-table-column
                prop="staffTelphone"
                label="电话"
                width="300"
                align="center">
            </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleSubmit()">确定</el-button>
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
  props: ['dialogVisibleStaff'],
  data () {
    return {
      message: '来自子组件的消息',
      staffList:[],
      staffIds:'',
      staffNms:'',
      total:0,
      page:1,
      size:10,
      searchForm: {
          one: null,
          staff:'',
          ids:'',
      },
    }
  },

  //方法
  methods: {
        //列表获取
        getSelect(){
            this.staffIds=this.searchForm.ids;
            this.staffNms=this.searchForm.staff;
            //调用
            this.$axios.get('/staff/select',{
            params: {
              page: this.page,
              size: this.size,
              search:this.searchForm.one
            }}).then(successResponse => {
              if (successResponse.data.code === 200) {
                this.staffList=successResponse.data.result;
                this.total=successResponse.data.total;
              }else{
                let message=successResponse.data.message
                this.$message({message: message,type: 'warning'});
              }
           })
        },
        //清理数据
        clearSelect(){
            //this.$refs.checkTable.clearSelection();
            this.searchForm.one='';
            this.searchForm.staff=this.staffNms;
            this.searchForm.ids=this.staffIds;
            this.getSelect();
            //this.$emit('cStaff', this.staffIds);
        },
        //多选框选择
        checkSelect () {
            let data=this.$refs.checkTable.selection;
            this.searchForm.staff='';
            this.searchForm.ids='';
            if(this.staffNms!==''){
                this.searchForm.ids=this.staffIds;
                this.searchForm.staff=this.staffNms;
            }
            if(null!==data){
                for(var i = 0; i < data.length; i++){
                    let staffId=data[i].staffId;
                    let staffNm=data[i].staffName;
                    if(!(this.searchForm.ids).includes(staffId)){
                        this.searchForm.ids = this.searchForm.ids + staffId + ',';
                        this.searchForm.staff = this.searchForm.staff + staffNm + ',';
                    }
                }
            }
        },
        // 取消
        handleCancel () {
            // 清除选中的数据
            this.$refs.checkTable.clearSelection();
            this.staffIds='';
            this.staffNms='';
            this.$emit('cActive_staff');
        },
        //关闭
        handleClose (done) {
            this.$refs.checkTable.clearSelection();
            this.staffIds='';
            this.staffNms='';
            this.$confirm('确认关闭？').then(_ => {
                this.$emit('cActive_staff') // 如果确认,就取消弹窗,
                done()
            }).catch(_ => {})
        },
        //翻页
        currentChange(currentPage){
          this.staffIds=this.searchForm.ids;
          this.staffNms=this.searchForm.staff;
          this.page=currentPage;
          this.getSelect();
        },
        //翻页
        sizeChange(pageSize){
          this.staffIds=this.searchForm.ids;
          this.staffNms=this.searchForm.staff;
          this.size=pageSize;
          this.getSelect();
        },
        //查询
       handleSearch () {
          this.page =1;
          this.getSelect();
       },
       //确认
       handleSubmit(){
          //this.$refs.checkTable.clearSelection();
          this.$emit('cStaff', this.staffIds);
       },

    }
}
</script>

<style scoped>
.qclass{
  float: right;
}
</style>
