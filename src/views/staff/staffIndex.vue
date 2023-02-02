<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="6.2">
          <el-form-item label="中文名称:">
            <el-input v-model="searchForm.one" placeholder="中文名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6.2">
          <el-form-item label="职位:">
            <el-input v-model="searchForm.three" placeholder="职位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6.2">
          <el-form-item label="教派类别：">
            <el-select v-model="searchForm.four"  placeholder="请选择">
              <el-option
                  v-for="item in religiousSects"
                  :key="item.dictCd"
                  :label="item.dictCnDesc"
                  :value="item.dictCd"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6.8">
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
          prop="staffName"
          label="中文名称"
          width="260"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
          prop="religiousSect"
          label="教派类别"
          width="160"
          align="center">
      </el-table-column>

      <el-table-column
          prop="staffTelphone"
          label="电话"
          align="center"
          width="200">
      </el-table-column>
      
      <el-table-column
          prop="staffPost"
          label="职位"
          align="center"
          width="160">
      </el-table-column>

      <el-table-column
          prop="venuesName"
          label="场所"
          align="center"
          width="320">
      </el-table-column>

      <el-table-column
          align="center"
          width="175"
          label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="modifyClick(scope.$index, tableData)" type="primary" style="padding:5px;">
            修改
          </el-button>
          <el-button @click.native.prevent="handleDelete(scope.$index, tableData)" style="padding:5px;" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-item :dialog-visible-staff-add="isActive" @cActive="changeActive" @cAdd="handleAdd" ref="myaddchild"></add-item>
    <!--    @cActive控制添加表单的显示,每当点击取消时,不再显示弹窗-->
    <!--    @cAdd控制提交form表单的信息,点击确定时,子组件向父组件传递表单数据,同时isActive=false,不再显示弹窗-->
    <modify-item :dialog-visible-staff-modify="isActive_modify" :index_from_parent="index_modify"
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
import staffAdd from './staffAdd'
import staffModify from './staffModify'

export default {
  components: {
    'add-item': staffAdd,
    'modify-item': staffModify
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
      // 类型下拉选择内容
      religiousSects:[],
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
    this.getreligiousSect();
  },
  methods: {
    async getreligiousSect(){
      this.$axios.get('/dict/getSysDicts', {
        params: {
          dictTypeCd: '1001',
        }
      }).then(successResponse => {
        if (successResponse.status === 200) {
          this.religiousSects=successResponse.data;
          this.religiousSects[this.religiousSects.length]=this.religiousSects[0]
          this.religiousSects[0]={"dictCnDesc":"----------- 请选择 -----------"}
        }else{
          this.$router.replace({path: '/error'})
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

      this.$refs.mymodifychild.form.staffName = this.tableData[this.index_modify].staffName
      this.$refs.mymodifychild.form.religiousSect = this.tableData[this.index_modify].religiousSect
      this.$refs.mymodifychild.form.staffTelphone = this.tableData[this.index_modify].staffTelphone
      this.$refs.mymodifychild.form.certTypeCd = this.tableData[this.index_modify].certTypeCd
      this.$refs.mymodifychild.form.certNbr = this.tableData[this.index_modify].certNbr
      this.$refs.mymodifychild.form.staffPost = this.tableData[this.index_modify].staffPost
      this.$refs.mymodifychild.form.relVenuesId = this.tableData[this.index_modify].relVenuesId
      this.$refs.mymodifychild.form.staffId = this.tableData[this.index_modify].staffId
      this.$refs.mymodifychild.form.staffPicture = this.tableData[this.index_modify].staffPicture
      this.getPictures(this.tableData[this.index_modify].staffPicture);
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
      this.isActive_modify = false // 显示修改弹窗
      this.tableData[this.index_modify].staffName = form.staffName
      this.tableData[this.index_modify].religiousSect = form.religious
      this.tableData[this.index_modify].staffTelphone = form.staffTelphone
      this.tableData[this.index_modify].certTypeCd = form.certTypeCd
      this.tableData[this.index_modify].certNbr = form.certNbr
      this.tableData[this.index_modify].staffPost = form.staffPost

      this.isActive_modify = false
      this.tempList = this.tableData
    },
    handleAdd (form) {
      const obj = {
        staffName: form.staffName,
        religiousSect: form.religious,
        staffTelphone: form.staffTelphone,
        staffPost:form.staffPost
      } // 这里用临时变量存储子组件提交来的form表单的数据,而不能直接push子组件的form,因为那样做会导致是将form添加到了tableDate中,每次push都只是
      // 增加了同一个form(个数有多个),修改一次form,其他的数据也会改变
      this.tableData.push(obj)
      this.tempList = this.tableData
      this.isActive = false // 关闭显示弹窗
      this.initTableData()
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
      this.$axios.get('/staff/find', {
        params: {
          page: this.page,
          size: this.size,
          staffName:this.searchForm.one,
          staffPost: this.searchForm.three,
          religiousSect: this.searchForm.four,
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
    deleteData(index, rows){
      let fd = new FormData()
      fd.append("staffId",rows[index].staffId)
      let staffId=rows[index].staffId
      this.$axios.post('/staff/delete/'+staffId)
          .then(successResponse => {
              if (successResponse.status === 200) {
                 this.initTableData()
                /*for (var i = 0; i < this.tempList.length; i++) { // 因为后来要实现一个搜索功能,但搜索出来的结果也要实现删除功能,所以tempList和tableData要实现同步删除
                  if (this.tempList[i].name === rows[index].name) {
                    this.tempList.splice(i, 1)
                  }
                }
                rows.splice(index, 1)*/
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

    //获取图片
    getPictures(userPhotoUrls){
      this.$axios.get('/file/show', {
        params: {
          picture: userPhotoUrls,
        }}
      ).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.$refs.mymodifychild.imagesrcList=successResponse.data.datas;
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
