<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备编号:">
            <el-input v-model="searchForm.one" placeholder="设备编号" clearable></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="8">
           <el-form-item label="场所名称:">
             <el-input v-model="searchForm.two" placeholder="场所名称" clearable></el-input>
           </el-form-item>
         </el-col>
      </el-row>

      <el-row>
            <el-col :span="8">
                <el-form-item label="预警类型：">
                  <el-select v-model="searchForm.three" placeholder="预警类型" clearable >
                    <el-option
                        v-for="item in eventSelect"
                        :key="item.dictCd"
                        :label="item.dictCnDesc"
                        :value="item.dictCd"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                     <el-form-item label="状态:">
                       <el-select v-model="searchForm.four"  placeholder="状态" clearable>
                        <el-option
                         v-for="item in statArr"
                         :key="item.cd"
                         :label="item.desc"
                         :value="item.cd"/>
                       </el-select>
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
          prop="eventType"
          label="预警类型"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
          prop="accessNumber"
          label="设备编号"
          width="200"
          align="center">
      </el-table-column>

      <el-table-column
           prop="warnTime"
           label="预警时间"
           align="center"
           width="160">
      </el-table-column>

      <el-table-column
          prop="venuesName"
          label="场所名称"
          align="center"
          width="100">
      </el-table-column>

      <el-table-column
          prop="venuesAddres"
          label="场所地址"
          align="center"
          width="330">
      </el-table-column>

       <el-table-column
          prop="eventState"
          label="状态"
          width="90"
          align="center">
       </el-table-column>

      <el-table-column
          prop="handlePerson"
          label="处理人"
           width="100"
          align="center">
      </el-table-column>

      <el-table-column
          prop="handleTime"
          label="处理时间"
          width="160"
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
      // 类型下拉选择内容
      eventSelect:[],
      statArr:[{cd:'01',desc:'未完成'},{cd:'02',desc:'已完成'}],
      total:0,
      page:1,
      size:10,
      // 绑定搜索数据
      searchForm: {
        one: null,
        two: null,
        three: null,
        four: null,
      },
    }
  },
  mounted(){
    this.initTableData();
  },
created(){
    this.getEventSelect();
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
      this.$axios.get('/event/findPage', {
        params: {
          page: this.page,
          size: this.size,
          accessNumber:this.searchForm.one,
          venuesName:this.searchForm.two,
          eventType:this.searchForm.three,
          eventState:this.searchForm.four,
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.tableData=successResponse.data.resultArr;//这里resp里面返回的数据是个对象，真正的数据在resp的data里；
          this.total=successResponse.data.total;
        }else{
              let message=successResponse.data.result;
              if(''!=message && null!=message){
                this.$alert(message);
              }else{
                this.$alert('预警查询失败,请联系管理员！');
              }
        }
      })
    },
   async getEventSelect(){
      this.$axios.get('/dict/getSysDict', {
        params: {
          dictTypeCd: '1004',
        }
      }).then(successResponse => {
        if (successResponse.data.code=== 200) {
          this.eventSelect=successResponse.data.resultArr;
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
