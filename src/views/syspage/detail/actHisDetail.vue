<template>
  <div v-show="true">
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm" >
      <el-row>
        <el-col :span="6.2">
         <el-form-item label="操作类型:">
             <el-select v-model="searchForm.one" clearable @focus="getHisActTypeList" >
               <el-option
                   v-for="item in hisActTypeData"
                   :key="item.dictCd"
                   :label="item.dictCnDesc"
                   :value="item.dictCd"
               />
             </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="6.2">
            <el-button class="qclass" icon="el-icon-search" type="primary" @click="getTableData" :style="{ display: staffQue }">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
        :data="tableData"
        border
        stripe
        style="width:80%"
    >
        <el-table-column
          prop="hisActNew"
          label="修改后内容"
          align="center"
          fixed>
        </el-table-column>

        <el-table-column
          prop="hisActOld"
          label="修改前内容"
          width="180"
          align="center">
        </el-table-column>

        <el-table-column
            prop="hisActType"
            label="操作类型"
            width="180"
            align="center">
        </el-table-column>

        <el-table-column
            prop="hisActModifier"
            label="操作人"
            width="180"
            align="center">
        </el-table-column>

        <el-table-column
            prop="hisActMoTm"
            label="操作时间"
            width="180"
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
            staffQue:'',
            hisActTypeData:[],
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
        this.getTableData();
    },
  methods: {
    //列表数据
    getTableData(search){
      let procInstId=this.$route.query.procInstId;
      this.$axios.get('/aiWarnTask/history', {
        params: {
          page: (this.page-1)*this.size,
          size: this.size,
          searchOne:this.searchForm.one,
          searchSix:procInstId
        }
      }).then(successResponse => {
        let data=successResponse.data;
        if (data.code === 200) {
          this.tableData=data.result;
          this.total=data.total;
        }else{
          this.$message({message: data.message,type: 'warning'});
        }
      })
    },

      //翻页
      sizeChange(pageSize){
        this.size=pageSize;
        this.getTableData();
      },
      currentChange(currentPage){
        this.page=currentPage;
        this.getTableData();
      },
      //获取操作类型
      getHisActTypeList(){
          this.$axios.get('/dict/getSysDict', {
              params: {
                dictTypeCd: '4001',
              }
            }).then(successResponse => {
              if (successResponse.data.code=== 200) {
                this.hisActTypeData=successResponse.data.resultArr;
              }else{
                this.$router.replace({path: '/error'})
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
