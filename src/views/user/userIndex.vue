<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="登录名:">
            <el-input v-model="searchForm.one" placeholder="登录名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="角色：">
            <el-select v-model="searchForm.two"  clearable>
              <el-option
                  v-for="item in roleslist"
                  :key="item.roleId"
                  :label="item.roleNm"
                  :value="item.roleId"
                  ref="ad"
              />
            </el-select>
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
        style="width: 200%"
    >

      <el-table-column
          prop="userNm"
          label="中文名"
          width="200"
          align="center">
      </el-table-column>

      <el-table-column
          prop="loginNm"
          label="登录名"
          width="150"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
          prop="userMobile"
          label="电话"
          align="center"
          width="200">
      </el-table-column>

      <el-table-column
          prop="userEmail"
          label="邮箱"
          align="center"
          width="220">
      </el-table-column>

      <el-table-column
          prop="userNbr"
          label="工号"
          align="center"
          width="120">
      </el-table-column>

      <el-table-column
          prop="identity"
          label="角色"
          align="center"
          width="180">
      </el-table-column>

      <el-table-column
          fixed="right"
          align="center"
          label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="modifyClick(scope.$index, tableData)" type="primary" style="padding:5px;">
            修改
          </el-button>
          <el-button @click.native.prevent="handleDelete(scope.$index, tableData)" style="padding:5px;" type="danger">
            删除
          </el-button>
          <el-button @click.native.prevent="grandClick(scope.$index, tableData)" style="padding:5px;" type="primary">
              权限管理
           </el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-item :dialog-visible-user-add="isActive" @cActive="changeActive" @cAdd="handleAdd" ref="myaddchild"></add-item>
    <!--    @cActive控制添加表单的显示,每当点击取消时,不再显示弹窗-->
    <!--    @cAdd控制提交form表单的信息,点击确定时,子组件向父组件传递表单数据,同时isActive=false,不再显示弹窗-->
    <modify-item :dialog-visible-user-modify="isActive_modify" :index_from_parent="index_modify"
                 @cActive_modify="changeActive_modify" @cmodify="handleRewrite" ref="mymodifychild"></modify-item>

      <grand-item :dialog-visible-user-grand="isActive_grand" :index_from_parent="index_grand"
              @cActive_grand="changeActive_grand" @cGrand="handleGrand" ref="myGrandChild">
      </grand-item>


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
import userAdd from './userAdd'
import userModify from './userModify'
import userGrand from './limit/grandAdd'

export default {
  components: {
    'add-item': userAdd,
    'modify-item': userModify,
    'grand-item': userGrand,
  },
  data () {
    return {
      message: '',
      isActive: false,
      isActive_modify: false,
      isActive_grand: false,
      index_modify: 0,
      index_grand: 0,
      isShow: true,
      searchdata: '',
      searchList: [],
      tempList: [],
      roleslist: [],
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
  created(){
    this.getRoleslist();
  },
  methods: {
    async getRoleslist(){
      this.$axios.get('/role/getRoles').then(successResponse => {
        if (successResponse.status === 200) {
          this.roleslist=successResponse.data;
        }else{
          this.$router.replace({path: '/'})
        }
      })
    },
    addClick () { // 每次点击“添加”按钮时,首先将isActive激活,显示表单;再调用子组件的childaddClicj方法,清空之前子组件中的form表单
      this.isActive = true // 显示弹窗
      this.$refs.myaddchild.childaddClick() // 调用子组件中的childaddClick方法,清空表单
    },
    modifyClick (index, rows) {
      this.isActive_modify = true // 显示修改弹窗
      this.index_modify = index

      this.$refs.mymodifychild.form.userNm = this.tableData[this.index_modify].userNm
      this.$refs.mymodifychild.form.loginNm = this.tableData[this.index_modify].loginNm
      this.$refs.mymodifychild.form.weakPwInd = this.tableData[this.index_modify].weakPwInd
      this.$refs.mymodifychild.form.userMobile = this.tableData[this.index_modify].userMobile
      this.$refs.mymodifychild.form.userEmail = this.tableData[this.index_modify].userEmail
      this.$refs.mymodifychild.form.userNbr = this.tableData[this.index_modify].userNbr
      this.$refs.mymodifychild.form.identity = this.tableData[this.index_modify].identity
      this.$refs.mymodifychild.form.userId = this.tableData[this.index_modify].userId
      this.$refs.mymodifychild.form.userPhotoUrl = this.tableData[this.index_modify].userPhotoUrl
      this.getPictures(this.tableData[this.index_modify].userPhotoUrl);
    },
    //点击事件
    grandClick (index, rows) {
        this.isActive_grand = true;
        this.index_grand = index;
        this.$refs.myGrandChild.userId = this.tableData[this.index_grand].userId
    },
    handleDelete (index, rows) {
      console.log(index)
      this.$confirm('此操作将永久删除场所信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(index, rows)
      }).catch(() => {
        this.$message.info('已取消删除');
      });

    },
    handleRewrite (form) {

      this.tableData[this.index_modify].userNm = form.userNm
      this.tableData[this.index_modify].loginNm = form.loginNm
      this.tableData[this.index_modify].passwords = form.passwords
      this.tableData[this.index_modify].userMobile = form.userMobile
      this.tableData[this.index_modify].userEmail = form.userEmail
      this.tableData[this.index_modify].userNbr = form.userNbr
      //this.tableData[this.index_modify].identity = form.identity

      this.isActive_modify = false // 显示修改弹窗
      this.tempList = this.tableData
    },
    //授权管理
    handleGrand (index, rows) {
      this.isActive_grand = true ;
    },

    handleAdd (form) {
      const obj = {
        userNm: form.userNm,
        loginNm: form.loginNm,
        passwords: form.passwords,
        userNbr:form.userNbr
      } // 这里用临时变量存储子组件提交来的form表单的数据,而不能直接push子组件的form,因为那样做会导致是将form添加到了tableDate中,每次push都只是
      // 增加了同一个form(个数有多个),修改一次form,其他的数据也会改变
      this.tableData.push(obj)
      this.tempList = this.tableData
      this.isActive = false // 关闭显示弹窗
      this.initTableData()
    },
    handleSearch () {
      this.page =1;
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
    changeActive_grand () {
      this.isActive_grand= false
    },
    sizeChange(pageSize){
      this.size=pageSize;
      this.initTableData();
    },
    currentChange(currentPage){
      this.page=currentPage;
      this.initTableData();
    },
    //查询
    initTableData(){
      this.$axios.get('/user/find', {
        params: {
          page: this.page,
          size: this.size,
          loginNm:this.searchForm.one,
          identity: this.searchForm.two,
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
                this.$alert('新增失败,请联系管理员！');
              }
        }
      })
    },
    deleteData(index, rows){
      let fd = new FormData()
      fd.append("userId",rows[index].userId)
      let userId=rows[index].userId
      this.$axios.post('/user/delete/'+userId)
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
              this.$router.replace({path: '/'})
            }
          })
    },

    // 时间确认触发
    dateChange(val) {
      this.search.startTime = val;
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
.addClass {
  /*background-color: darkgreen;
  color: wheat;
  border: 1px solid #ccc;*/
}


</style>
