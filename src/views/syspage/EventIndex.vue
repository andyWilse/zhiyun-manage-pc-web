<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="预警设备:">
            <el-input v-model="searchForm.one" placeholder="预警设备"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="8">
             <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
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
          prop="accessNumber"
          label="预警设备"
          width="160"
          align="center"
          fixed>
      </el-table-column>
      <el-table-column
          prop="responsiblePerson"
          label="责任人"
          width="130"
          align="center">
      </el-table-column>
      <el-table-column
          prop="eventType"
          label="类型"
          align="center"
          width="130">
      </el-table-column>
      <el-table-column
          prop="eventState"
          label="状态"
          align="center"
          width="100">
      </el-table-column>

      <el-table-column
          prop="warnTime"
          label="预警时间"
          align="center"
          width="160">
      </el-table-column>

      <el-table-column
          prop="relVenuesId"
          label="地点"
          align="center"
          width="260">
      </el-table-column>

      <el-table-column
          prop="handleTesults"
          label="处理结果"
          align="center">
      </el-table-column>

      <el-table-column
          prop="handleTime"
          label="处理时间"
          align="center">

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
      isShow: true,
      tempList: [],
      //查询
      tableData:[],
      total:0,
      page:1,
      size:10,
      // 绑定搜索数据
      searchForm: {
        one: null,
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
      this.$axios.get('/event/findpage', {
        params: {
          page: this.page,
          size: this.size,
          accessNumber:this.searchForm.one
        }
      }).then(successResponse => {
        if (successResponse.status === 200) {

          this.tableData=successResponse.data.datas;//这里resp里面返回的数据是个对象，真正的数据在resp的data里；
          this.total=successResponse.data.total;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
    },

    // 时间确认触发
    dateChange(val) {
      this.search.startTime = val
    },

  }
}
</script>

<style>

</style>
