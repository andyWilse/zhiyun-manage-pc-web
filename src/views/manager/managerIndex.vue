<template>
  <div v-show="true">
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm" >
      <el-row>
        <el-col :span="10">
        </el-col>
        <el-col :span="6.2">
          <el-form-item label="人员名称:">
            <el-input v-model="searchForm.one" placeholder="中文名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6.8">
            <el-button class="qclass" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button class="aclass" icon="el-icon-circle-plus-outline" type="primary" @click="addClick">新增</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
        :data="tableData"
        border
        stripe
        style="width:50%"
        v-show="true"
    >
      <el-table-column
          prop="managerCnNm"
          label="中文名称"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
          prop="managerMobile"
          label="电话"
          align="center">
      </el-table-column>

      <el-table-column
            prop="managerTypeCd"
            label="身份"
            align="center">
      </el-table-column>

      <el-table-column
          align="center"
          width="175"
          label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="modifyClick(scope.$index, tableData)" type="primary" style="padding:5px;">
            修改
          </el-button>
          <el-button @click.native.prevent="handleDelete(scope.$index, tableData)" style="padding:5px;" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="display:flex;justify-content:flex-start">
      <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="total,sizes, prev, pager, next, jumper, ->,  slot"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data () {
    return {
      message: '',
      //查询
      tableData:[],
      total:0,
      page:1,
      size:10,
      // 绑定搜索数据
      searchForm: {
        one: null,
        two: null,
      },
    }
  },
  mounted(){
  },
  //加载
  created(){
    this.handleSearch();
  },
  methods: {
    //列表数据
    handleSearch(){
        this.$axios.get('/manager/findManager', {
          params: {
            page: this.page,
            size: this.size,
            managerCnNm:this.searchForm.one,
          }
        }).then(successResponse => {
          if (successResponse.data.code === 200) {
            this.tableData=successResponse.data.result;
            this.total=successResponse.data.total;
          }else{
            let message=successResponse.data.message;
            this.$message({message: message,type: 'warning'});
          }
        })
    },
    //分页
    sizeChange(pageSize){
        this.size=pageSize;
        this.handleSearch(this.searchForm.one);
    },
    currentChange(currentPage){
        this.page=currentPage;
        this.handleSearch(this.searchForm.one);
    },
    //新增
    addClick () {
       this.$router.replace({path: '/managerAdd'})
    },
    //修改
    modifyClick (index, rows) {
        this.index_modify = index;
        let managerId= this.tableData[this.index_modify].managerId;
        this.$router.push({path: '/managerModify',query:{ managerId:managerId}});
    },
    //删除
    handleDelete (index, rows) {
      console.log(index)
      this.$confirm('此操作将把教职人员在该场所除名, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(index, rows)
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    //删除
    deleteData(index, rows){
      let managerId=rows[index].managerId;
      this.$axios.post('/manager/delete/' + managerId)
        .then(successResponse => {
              if (successResponse.data.code === 200) {
                 this.handleSearch();
              }else{
                let message=successResponse.data.message;
                this.$message({message: message,type: 'warning'});
              }
        })
    },

  }
}
</script>

<style>
.addClass {
  background-color: darkgreen;
  color: wheat;
  border: 1px solid #ccc;
}


</style>
