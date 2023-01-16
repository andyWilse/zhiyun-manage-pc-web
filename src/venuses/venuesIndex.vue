<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm">
      <el-row>
        <el-col :span="8">
      <el-form-item label="场所名称:">
        <el-input v-model="searchForm.one" placeholder="场所名称"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人:">
            <el-input v-model="searchForm.three" placeholder="负责人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="教派类别：">
            <el-select v-model="searchForm.four"  placeholder="----------- 请选择 -----------">
              <el-option
                  v-for="item in religiousSects"
                  :key="item.dictCd"
                  :label="item.dictCnDesc"
                  :value="item.dictCd"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="text-align:center">
        <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
      </div>
      <div style="text-align:right">
        <el-button class="addClass" @click="addClick">添加</el-button>
      </div>

    </el-form>

    <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
    >
      <el-table-column
          prop="venuesName"
          label="场所名称"
          width="90"
          align="center"
          fixed>
      </el-table-column>
      <el-table-column
          prop="religiousSect"
          label="教派类别"
          width="100"
          align="center">
      </el-table-column>
      <el-table-column
          prop="registerNbr"
          label="登记证号"
          align="center"
          width="100">
      </el-table-column>
      <el-table-column
          prop="venuesPhone"
          label="场所电话"
          align="center"
          width="100">
      </el-table-column>
      <el-table-column
          prop="organization"
          label="所属机构"
          align="center"
          width="100">
      </el-table-column>
      <el-table-column
          prop="venuesAddres"
          label="场所地址"
          align="center">
      </el-table-column>
      <el-table-column
          prop="responsiblePerson"
          label="负责人"
          align="center"
          width="100">
      </el-table-column>

      <el-table-column
          fixed="right"
          align="center"
          width="130"
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
    <add-item :dialog-visible-venues-add="isActive_add" @cActive="changeActive" @cAdd="handleAdd" ref="myaddchild"></add-item>
    <!--    @cActive控制添加表单的显示,每当点击取消时,不再显示弹窗-->
    <!--    @cAdd控制提交form表单的信息,点击确定时,子组件向父组件传递表单数据,同时isActive=false,不再显示弹窗-->
    <modify-item :dialog-visible-venues-modify="isActive_modify" :index_from_parent="index_modify"
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
import additem from './addItem'
import modifyitem from './modifyItem'

export default {
  components: {
    'add-item': additem,
    'modify-item': modifyitem
  },
  data () {
    return {
      message: '',
      isActive_add: false,
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
        all: null,
        one: null,
        two: null,
        three: null,
        four: null,
        value: null,
        key: null,
        time: '',
        startTime: ''
      },
    }
  },
  mounted(){
    this.initTableData();
  },
  created(){
    this.getReligiousSect();
  },
  methods: {
    async getReligiousSect(){
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
      this.isActive_add = true // 显示弹窗
      this.$refs.myaddchild.childaddClick() // 调用子组件中的childaddClick方法,清空表单
    },
    modifyClick (index, rows) {
      this.isActive_modify = true // 显示修改弹窗
      this.index_modify = index

      this.$refs.mymodifychild.form.venuesName = this.tableData[this.index_modify].venuesName
      this.$refs.mymodifychild.form.religiousSect = this.tableData[this.index_modify].religiousSect
      this.$refs.mymodifychild.form.registerNbr = this.tableData[this.index_modify].registerNbr
      this.$refs.mymodifychild.form.venuesPhone = this.tableData[this.index_modify].venuesPhone
      this.$refs.mymodifychild.form.responsiblePerson = this.tableData[this.index_modify].responsiblePerson
      this.$refs.mymodifychild.form.liaisonMan = this.tableData[this.index_modify].liaisonMan
      this.$refs.mymodifychild.form.venuesAddres = this.tableData[this.index_modify].venuesAddres
      this.$refs.mymodifychild.form.organization = this.tableData[this.index_modify].organization
      this.$refs.mymodifychild.form.briefIntroduction = this.tableData[this.index_modify].briefIntroduction
      this.$refs.mymodifychild.form.venuesId = this.tableData[this.index_modify].venuesId

      this.$refs.mymodifychild.form.picturesPath = this.tableData[this.index_modify].picturesPath
      this.getPictures(this.tableData[this.index_modify].picturesPath);


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
      // eslint-disable-next-line no-unused-vars
      this.tableData[this.index_modify].venuesName = form.venuesName
      this.tableData[this.index_modify].religiousSect = form.religiousSect
      this.tableData[this.index_modify].registerNbr = form.registerNbr
      this.tableData[this.index_modify].venuesPhone = form.venuesPhone
      this.tableData[this.index_modify].organization = form.organization
      this.tableData[this.index_modify].venuesAddres = form.venuesAddres
      this.tableData[this.index_modify].responsiblePerson = form.responsiblePerson
      this.isActive_modify = false
      this.tempList = this.tableData
    },
    handleAdd (form) {
      const obj = {
        venuesName: form.venuesName,
        religiousSect: form.religiousSect,
        registerNbr: form.registerNbr,
        venuesPhone: form.venuesPhone,
        organization: form.organization,
        venuesAddres: form.venuesAddres,
        picturesPath:form.picturesPath,
        responsiblePerson:form.responsiblePerson
      } // 这里用临时变量存储子组件提交来的form表单的数据,而不能直接push子组件的form,因为那样做会导致是将form添加到了tableDate中,每次push都只是
      // 增加了同一个form(个数有多个),修改一次form,其他的数据也会改变
      this.tableData.push(obj)
      this.tempList = this.tableData
      this.isActive_add = false // 关闭显示弹窗
      this.initTableData()
    },
    handleSearch () {
      this.initTableData()
      /*this.searchList = [] // 每次搜索,要将上次的搜索结果searchList清空
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].venuesName.includes(this.searchForm.one) ||
            this.tableData[i].religiousSect.includes(this.searchForm.four) ||
            this.tableData[i].responsiblePerson.includes(this.searchForm.three)) {
          this.searchList.push(this.tableData[i])
        }
      }
      this.tempList = this.tableData // 用tempList暂存tableDate,即搜索前的数据
      this.tableData = this.searchList*/

    },
    handleClear () {
      this.tableData = this.tempList
    },
    changeActive () { // 用于只改变isActive的值来取消显示弹窗
      this.isActive_add = false
    },
    changeActive_modify () {
      this.isActive_modify = false
    },
    sizeChange(pageSize){
      //console.log('pageSize:'+pageSize)
      this.size=pageSize;
      this.initTableData();
    },
    currentChange(currentPage){
      //console.log('currentPage:'+currentPage)
      this.page=currentPage;
      this.initTableData();
    },
    initTableData(){
      this.$axios.get('/venues/find', {
        params: {
          page: this.page,
          size: this.size,
          venuesName:this.searchForm.one
          ,
          responsiblePerson: this.searchForm.three,
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
      fd.append("venuesId",rows[index].venuesId)
      let venuesId=rows[index].venuesId

      this.$axios.post('/venues/delete/'+venuesId)
          .then(successResponse => {
                if (successResponse.status === 200) {
                  for (var i = 0; i < this.tempList.length; i++) { // 因为后来要实现一个搜索功能,但搜索出来的结果也要实现删除功能,所以tempList和tableData要实现同步删除
                    if (this.tempList[i].name === rows[index].name) {
                      this.tempList.splice(i, 1)
                    }
                  }
                  rows.splice(index, 1)
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


</style>
