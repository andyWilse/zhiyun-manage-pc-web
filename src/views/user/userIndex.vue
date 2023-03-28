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
                  ref="ad"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
            <el-button class="qclass" icon="el-icon-search" type="primary" @click="handleSearch" :style="{ display: userQue }">查询</el-button>
            <el-button class="aclass" icon="el-icon-circle-plus-outline" type="primary" @click="addClick" :style="{ display: userAdd }">新增</el-button>
        </el-col>
      </el-row>

    </el-form>

    <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%">

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
          <el-button @click.native.prevent="modifyClick(scope.$index, tableData)" type="primary" style="padding:5px;" :style="{ display: userMod }">
            修改
          </el-button>
          <el-button @click.native.prevent="handleDelete(scope.$index, tableData)" style="padding:5px;" type="danger" :style="{ display: userDel }">
            删除
          </el-button>
          <el-button @click.native.prevent="grandClick(scope.$index, tableData)" style="padding:5px;" type="primary" :style="{ display: userGra }">
              权限管理
           </el-button>
        </template>
      </el-table-column>
    </el-table>
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
import userGrand from './limit/grandAdd'

export default {
  components: {
    'grand-item': userGrand,
  },
  data () {
    return {
      message: '',
      userAdd:'none',
      userMod:'none',
      userDel:'none',
      userGra:'none',
      userQue:'',
      isActive_grand: false,
      index_grand: 0,
      isShow: true,
      tempList: [],
      roleslist: [],
      fileList: [],
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

    created(){
        this.initTableData();
        this.getRolesList();
        this.userAdd=this.$gloMsg.userAdd;
        this.userMod=this.$gloMsg.userMod;
        this.userDel=this.$gloMsg.userDel;
        this.userGra=this.$gloMsg.userGra;
    },
  //方法
  methods: {
    async getRolesList(){
      this.$axios.get('/role/getRoles').then(successResponse => {
        if (successResponse.status === 200) {
          this.roleslist=successResponse.data;
        }else{
          this.$router.replace({path: '/'})
        }
      })
    },
    //新增
    addClick () {
      this.$router.replace({path: 'userAdd/'});
    },
    //修改
    modifyClick (index, rows) {
      this.index_modify = index;
      let userId= this.tableData[this.index_modify].userId;
      this.$router.push({path: '/userModify',query:{ userId:userId}});
    },
    //点击事件
    grandClick (index, rows) {
        this.isActive_grand = true;
        this.index_grand = index;
        this.$refs.myGrandChild.userId = this.tableData[this.index_grand].userId;
        let user=this.tableData[this.index_grand].userId;
        this.$refs.myGrandChild.showMenu(user);
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

    //授权管理
    handleGrand (data) {
      this.isActive_grand = false ;
    },

    handleSearch () {
      this.page =1;
      this.initTableData()
    },
    handleClear () {
      this.tableData = this.tempList
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
          this.tableData=successResponse.data.result;
          this.total=successResponse.data.total;
        }else{
              let message=successResponse.data.message;
              if(''!=message && null!=message){
                this.$message({message: message,type: 'warning'});
              }else{
                this.$message({message: '用户信息获取失败，请联系管理员！',type: 'error'});
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

    //获取图片url
    getFile(path){
          this.$axios.get('/file/getFile', {
              params: {
                picPath:path,
              }
            }).then(successResponse => {
              if (successResponse.data.code === 200) {
                    this.fileList=successResponse.data.result;
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
