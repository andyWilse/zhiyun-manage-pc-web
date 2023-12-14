<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="7">
          <el-form-item label="任务名称:">
            <el-input v-model="searchForm.one" placeholder="任务名称" clearable></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="7">
          <el-form-item label="场所名称:">
            <el-input v-model="searchForm.two" placeholder="场所名称" clearable></el-input>
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
        style="width: 100%">

      <el-table-column
          prop="taskName"
          label="任务名称"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
          prop="venuesName"
          label="场所名称"
          fixed
          align="center">
      </el-table-column>

      <el-table-column
          prop="venuesAddres"
          label="场所地址"
          fixed
          align="center">
      </el-table-column>

      <el-table-column
            prop="launchPerson"
            label="发起者"
            fixed
            align="center">
        </el-table-column>

      <el-table-column
          prop="taskTime"
          label="发起时间"
          fixed
          align="center">
      </el-table-column>

      <el-table-column
          prop="emeLevelCn"
          label="紧急程度"
          fixed
          align="center">
      </el-table-column>

<!--      <el-table-column
            prop="taskContent"
            label="任务描述"
            fixed
            align="center">
      </el-table-column> -->

      <el-table-column
            prop="statTask"
            label="任务状态"
            fixed
            align="center">
      </el-table-column>


      <el-table-column  align="center" label="操作" fixed>
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleClick(scope.$index, tableData)" style="padding:5px;" type="primary">
            查看详情
         </el-button>
        </template>
      </el-table-column>
    </el-table>

    <comment-item :detail-visible="isActive" :index_from_parent="index_comment" @cActive_comment="changeActive"
                                     @cGrand="handleComment" ref="myCommentChild"></comment-item>

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
import taskComment from "./taskComment";

export default {
  name: "FirstPage",
    components:{
         'comment-item': taskComment
      },
  data () {
    return {
      message: '',
      isActive: false,
      index_comment: 0,
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
  created(){
      this.$alert("首页是需要处理的任务，请去“手机端”处理！", "", {
           confirmButtonText: "确定",
           callback: action => {
              //this.$router.go(0);
           }
      });
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
      this.$axios.get('/task/pc/getMyTask', {
        params: {
          page: this.page,
          size: this.size,
          taskName:this.searchForm.one,
          venues:this.searchForm.two,
          type:'00'
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.tableData=successResponse.data.result;//这里resp里面返回的数据是个对象，真正的数据在resp的data里；
          this.total=successResponse.data.total;
        }else{
          this.$alert('任务信息获取失败,请联系管理员！');
        }
      })
    },
    // 时间确认触发
    dateChange(val) {
      this.search.startTime = val
    },
    searchData() {},

    handleClick(index, rows){
      //this.isActive=true;
      let procInstId=this.tableData[index].procInstId;
      this.$router.push({path: '/taskDetail',query:{ procInstId:procInstId}});
      //this.$refs.myCommentChild.getComment(procInstId);
    },
    handleComment (data) {
        this.isActive= false;
    },
    changeActive () {
      this.isActive = false ;
    },

  }
}
</script>

<style>
.refCLass{
    background-color:#156AA8;
    padding:5px;
}
</style>
