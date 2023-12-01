<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="操作人:">
            <el-input v-model="searchForm.one" placeholder="操作人" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作类型：">
            <el-select v-model="searchForm.two" clearable >
              <el-option
                  v-for="item in typeList"
                  :key="item.dictCd"
                  :label="item.dictCnDesc"
                  :value="item.dictCd"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
              <el-col :span="8">
               <el-form-item label="起始时间:">
                   <el-date-picker v-model="searchForm.three" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                   </el-date-picker>
               </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="结束时间:">
                    <el-date-picker v-model="searchForm.four" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
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
        style="width: 70%"
        :header-cell-style="{'text-align':'center'}"
    >
      <el-table-column
          prop="operateType"
          label="操作类型"
          align="center"
          width="150">
      </el-table-column>

      <el-table-column
          prop="operator"
          label="操作人"
          align="center"
          width="200">
      </el-table-column>

      <el-table-column
          prop="operateTm"
          label="操作时间"
          align="center"
          width="210">
      </el-table-column>


      <el-table-column
          prop="operateDetail"
          label="操作主题"
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
      typeList:[],
      //查询
      tableData:[],
      total:0,
      page:1,
      size:10,
      // 绑定搜索数据
      searchForm: {
        all: null,
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
    this.getTypeList();
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
      this.$axios.get('/record/findByPage', {
        params: {
          page: this.page,
          size: this.size,
          userName:this.searchForm.one,
          type:this.searchForm.two,
          start:this.searchForm.three,
          end:this.searchForm.four,
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {

          this.tableData=successResponse.data.resultArr;//这里resp里面返回的数据是个对象，真正的数据在resp的data里；
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
    searchData() {},

    async getTypeList(){
          this.$axios.get('/dict/getSysDict', {
            params: {
              dictTypeCd: '1007',
            }
          }).then(successResponse => {
            if (successResponse.data.code=== 200) {
              this.typeList=successResponse.data.resultArr;
            }else{
              this.$router.replace({path: '/error'})
            }
          })
        },
  }
}
</script>

<style>

</style>
