<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="6">
          <el-form-item label="任务名称:">
            <el-input v-model="searchForm.one" placeholder="任务名称"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
            <el-button class="handClass" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button class="depClass" icon="el-icon-circle-plus-outline" type="primary" @click="deployClick">流程部署</el-button>
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
          prop="name"
          label="流程名称"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
          prop="taskKey"
          label="key值"
          fixed
          align="center">
      </el-table-column>

      <el-table-column
          prop="version"
          label="版本"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
          prop="resourceName"
          label="配置文件"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
            prop="description"
            label="流程描述"
            align="center"
            fixed>
        </el-table-column>

    </el-table>
    
    <add-item :dialog-visible-task-add="isActive_add" @cActive="changeActive" @cAdd="handleAdd" ref="myaddchild"></add-item>
    
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
import deployItem from './deployItem'

export default {
  name: "FirstPage",
  components: {
    'add-item': deployItem
  },
  data () {
    return {
      message: '',
      isActive_add: false,
      //查询
      tableData:[],
      total:0,
      page:0,
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
      this.$axios.get('/task/getProcdef', {
        params: {
          page: this.page,
          size: this.size,
          taskName:this.searchForm.one,
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
    // 每次点击“添加”按钮时,首先将isActive激活,显示表单;再调用子组件的childaddClicj方法,清空之前子组件中的form表单
    deployClick () { 
      this.isActive_add = true // 显示弹窗
      //this.$refs.myDeployChild.childaddClick() // 调用子组件中的childaddClick方法,清空表单
    },
    changeActive () { // 用于只改变isActive的值来取消显示弹窗
      this.isActive_add = false
    },
    handleAdd (form) {
          const obj = {

          } // 这里用临时变量存储子组件提交来的form表单的数据,而不能直接push子组件的form,因为那样做会导致是将form添加到了tableDate中,每次push都只是
          // 增加了同一个form(个数有多个),修改一次form,其他的数据也会改变
          this.tableData.push(obj)
          this.tempList = this.tableData
          this.isActive_add = false // 关闭显示弹窗
          this.initTableData()
        },
  }
}
</script>

<style>
.refCLass{
    background-color:#156AA8;
    padding:5px;
}
.depClass{
  background-color:#aa7700;
}

.handClass{
  background-color:#156AA8;
}
</style>
