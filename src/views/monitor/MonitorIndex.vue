<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备编号:">
            <el-input v-model="searchForm.one" placeholder="设备编号"></el-input>
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
          label="设备编号"
          align="center"
          fixed>
      </el-table-column>
<!--
      <el-table-column
          prop="functionType"
          label="功能类别"
          width="170"
          align="center">
      </el-table-column>
      -->
      <el-table-column
          prop="venuesAddres"
          label="场所名称"
          align="center"
          width="220">
      </el-table-column>

      <el-table-column
          prop="state"
          label="状态"
          align="center"
          width="110">
      </el-table-column>

      <el-table-column
          prop="lastModifier"
          label="维护人"
          align="center"
          width="160">
      </el-table-column>

      <el-table-column
          prop="lastModifyTime"
          label="维护时间"
          align="center"
          width="200">

      </el-table-column>

        <el-table-column
            align="center"
            width="240"
            label="操作">
          <template slot-scope="scope">
            <el-button @click.native.prevent="nowClick(scope.$index, tableData)" type="primary" style="padding:5px;">
              监控查看
            </el-button>
            <el-button @click.native.prevent="backClick(scope.$index, tableData)" style="padding:5px;" type="danger">
              监控回放
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
        this.page=1;
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
      this.$axios.get('/monitor/findPage', {
        params: {
          page: this.page,
          size: this.size,
          accessNumber:this.searchForm.one
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.tableData=successResponse.data.result;
          this.total=successResponse.data.total;
        }else{
            let message=successResponse.data.message;
            this.$message({message: message, type: 'error'});
        }
      })
    },

    // 时间确认触发
    dateChange(val) {
      this.search.startTime = val
    },

    nowClick (index, rows) {
         this.$router.push ({
             path: '/monitorNow',
             replace: true,
             query: { monitorUrl: rows[index].monitorUrl}
         })

    },
    backClick (index, rows) {
        this.$router.push ({
             path: '/monitorBack',
             replace: true,
             query: { monitorUrl: rows[index].monitorUrl}
         })
    }
  }
}
</script>

<style>

</style>
