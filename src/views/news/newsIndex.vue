<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="7">
          <el-form-item label="新闻标题:">
            <el-input v-model="searchForm.one" placeholder="新闻标题"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7">
            <el-button class="qclass" icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button class="aclass" icon="el-icon-circle-plus-outline" type="primary" @click="addClick">新增</el-button>
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
          prop="newsTitle"
          label="新闻标题"
          width="179"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
          prop="newsKeyword"
          label="新闻关键字"
          width="200"
          align="center">
      </el-table-column>

      <el-table-column
          prop="newsFrom"
          label="来源"
          align="center"
          width="230">
      </el-table-column>

<!--
      <el-table-column
            prop="newsRef"
            label="链接"
            align="center"
            width="200">
        </el-table-column>
-->
      <el-table-column
          prop="newsType"
          label="新闻类别"
          align="center"
          width="130">
      </el-table-column>

      <el-table-column
          prop="creator"
          label="发布者名称"
          align="center"
          width="120">
      </el-table-column>

      <el-table-column
          prop="createTime"
          label="发布日期"
          align="center"
          width="200">
      </el-table-column>

      <el-table-column
          align="center"
          width="215"
          label="操作">
        <template slot-scope="scope">
            <el-button @click.native.prevent="refClick(scope.$index, tableData)" type="primary" class="refCLass">
                新闻链接
            </el-button>

          <el-button @click.native.prevent="modifyClick(scope.$index, tableData)" style="padding:5px;" type="primary">
            修改
          </el-button>
          <el-button @click.native.prevent="handleDelete(scope.$index, tableData)" style="padding:5px;" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-item :dialog-visible-news-add="isActive" @cActive="changeActive" @cAdd="handleAdd" ref="myaddchild"></add-item>
    <!--    @cActive控制添加表单的显示,每当点击取消时,不再显示弹窗-->
    <!--    @cAdd控制提交form表单的信息,点击确定时,子组件向父组件传递表单数据,同时isActive=false,不再显示弹窗-->
    <modify-item :dialog-visible-news-modify="isActive_modify" :index_from_parent="index_modify"
                 @cActive_modify="changeActive_modify" @cmodify="handleRewrite" ref="mymodifychild"></modify-item>

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
import newsAdd from './newsAdd'
import newsModify from './newsModify'

export default {
  name: "newsIndex",
  components: {
    'add-item': newsAdd,
    'modify-item': newsModify
  },
  data () {
    return {
      message: '',
      isActive: false,
      isActive_modify: false,
      index_modify: 0,
      isShow: true,
      searchdata: '',
      searchList: [],
      tempList: [],
      //查询
      tableData:[],
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
  methods: {
    refClick (index, rows) {
        let url=this.tableData[index].newsRef;
        window.open(url, '_blank');
    },
    addClick () { // 每次点击“添加”按钮时,首先将isActive激活,显示表单;再调用子组件的childaddClicj方法,清空之前子组件中的form表单
      this.isActive = true // 显示弹窗
      this.$refs.myaddchild.childaddClick() // 调用子组件中的childaddClick方法,清空表单
    },
    modifyClick (index, rows) {
      this.isActive_modify = true // 显示修改弹窗
      this.index_modify = index

      this.$refs.mymodifychild.form.newsTitle = this.tableData[this.index_modify].newsTitle
      this.$refs.mymodifychild.form.newsKeyword = this.tableData[this.index_modify].newsKeyword
      this.$refs.mymodifychild.form.newsFrom = this.tableData[this.index_modify].newsFrom
      this.$refs.mymodifychild.form.newsFor = this.tableData[this.index_modify].newsFor
      this.$refs.mymodifychild.form.newsRef = this.tableData[this.index_modify].newsRef
      this.$refs.mymodifychild.form.newsType = this.tableData[this.index_modify].newsType
      this.$refs.mymodifychild.form.creator = this.tableData[this.index_modify].creator
      this.$refs.mymodifychild.form.newsContent = this.tableData[this.index_modify].newsContent
      this.$refs.mymodifychild.form.createTime = this.tableData[this.index_modify].createTime
      this.$refs.mymodifychild.form.newsId = this.tableData[this.index_modify].newsId
      this.$refs.mymodifychild.form.newsPicturesPath = this.tableData[this.index_modify].newsPicturesPath
      this.getPictures(this.tableData[this.index_modify].newsPicturesPath);
    },
    handleRewrite (form) {
      this.isActive_modify = false; // 显示修改弹窗
      this.tableData[this.index_modify].newsTitle = form.newsTitle;
      this.tableData[this.index_modify].newsKeyword = form.newsKeyword;
      this.tableData[this.index_modify].newsType = form.newsType;
      this.tableData[this.index_modify].creator = form.creator;
      this.tableData[this.index_modify].createTime = form.createTime;
      this.tableData[this.index_modify].newsFrom = form.newsFrom;
      this.tableData[this.index_modify].newsRef = form.newsRef;
      this.tableData[this.index_modify].newsFor = form.newsFor;
      this.isActive_modify = false;
      this.tempList = this.tableData;
      this.initTableData();
    },
    handleAdd (form) {
      const obj = {
        newsTitle: form.newsTitle,
        newsKeyword: form.newsKeyword,
        createTime:form.createTime
      } // 这里用临时变量存储子组件提交来的form表单的数据,而不能直接push子组件的form,因为那样做会导致是将form添加到了tableDate中,每次push都只是
      // 增加了同一个form(个数有多个),修改一次form,其他的数据也会改变
      this.tableData.push(obj);
      this.tempList = this.tableData;
      this.isActive = false; // 关闭显示弹窗
      this.initTableData();
    },
    handleSearch () {
      this.initTableData()
    },
    handleClear () {
      this.tableData = this.tempList
    },
    changeActive () { // 用于只改变isActive的值来取消显示弹窗
      this.isActive = false
    },
    changeActive_modify () {
      this.isActive_modify = false
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
      this.$axios.get('/news/find', {
        params: {
          page: this.page,
          size: this.size,
          newsTitle:this.searchForm.one,
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.tableData=successResponse.data.result;//这里resp里面返回的数据是个对象，真正的数据在resp的data里；
          this.total=successResponse.data.total;
        }else{
          let message=successResponse.data.message;
          this.$message({message: message, type: 'error'});
        }
      })
    },
    //删除
    handleDelete (index, rows) {
      console.log(index)
      this.$confirm('此操作将删除该新闻信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(index, rows)
      }).catch(() => {
        this.$message('已取消删除');
      });
    },
    deleteData(index, rows){
      let fd = new FormData()
      fd.append("newsId",rows[index].newsId)
      let newsId=rows[index].newsId
      this.$axios.post('/news/delete/'+newsId)
          .then(successResponse => {
            if (successResponse.status === 200) {
              // 因为后来要实现一个搜索功能,但搜索出来的结果也要实现删除功能,所以tempList和tableData要实现同步删除
              /*for (var i = 0; i < this.tempList.length; i++) {
                if (this.tempList[i].name === rows[index].name) {
                  this.tempList.splice(i, 1)
                }
              }
              rows.splice(index, 1)*/
              this.initTableData()
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

    getPictures(userPhotoUrls){
      this.$axios.get('/file/show', {
        params: {
          picture: userPhotoUrls,
        }
      }).then(successResponse => {
        if (successResponse.status === 200) {
          this.$refs.mymodifychild.imagesrcList=successResponse.data;
        }else{
          this.$router.replace({path: '/error'})
        }
      })
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
