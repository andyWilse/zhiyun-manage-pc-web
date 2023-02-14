<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="7">
          <el-form-item label="任务名称:">
            <el-input v-model="searchForm.one" placeholder="任务名称"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="7">
          <el-form-item label="任务内容:">
            <el-input v-model="searchForm.two" placeholder="任务内容"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7">
            <el-button class="qclass" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
    >
      <el-table-column
          prop="taskName"
          label="任务名称"
          width="190"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
          prop="taskContent"
          label="任务内容"
          width="280"
          align="center">
      </el-table-column>

      <el-table-column
          prop="venuesAddres"
          label="场所地址"
          align="center"
          width="450">
      </el-table-column>

      <el-table-column
          prop="endTime"
          label="截至时间"
          align="center"
          width="200">
      </el-table-column>

      <el-table-column
            prop="emergencyLevel"
            label="紧急状态"
            align="center"
            width="150">
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
  name: "FirstPage",

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
        two: null
      },
    }
  },
  mounted(){
    this.initTableData();
  },
  methods: {
    handleSearch () {
      this.initTableData()
    },
    handleClear () {
      this.tableData = this.tempList
    },
    sizeChange(pageSize){
      this.size=pageSize;
      this.initTableData();
    },
    currentChange(currentPage){
      this.page=currentPage;
      this.initTableData();
    },
    initTableData(){
      this.$axios.get('/eventTask/getTasking', {
        params: {
          page: this.page,
          size: this.size,
          taskName:this.searchForm.one,
          taskContent:this.searchForm.two,
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.tableData=successResponse.data.resultArr;//这里resp里面返回的数据是个对象，真正的数据在resp的data里；
          this.total=successResponse.data.total;
        }else{
          this.$alert('新闻信息获取失败,请联系管理员！');
        }
      })
    },
    // 时间确认触发
    dateChange(val) {
      this.search.startTime = val
    },
    searchData() {},
  }
}
</script>

<style>
.refCLass{
    background-color:#156AA8;
    padding:5px;
}
</style>
