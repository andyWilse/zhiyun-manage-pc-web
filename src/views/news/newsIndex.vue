<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="120px" class="searchForm">
      <el-row :gutter="25">
        <el-col :span="4.8">
          <el-form-item>
            <el-input v-model="searchForm.one" placeholder="新闻标题" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4.8">
          <el-form-item>
             <el-select v-model="searchForm.two"  placeholder="链接类型" clearable>
               <el-option
                   v-for="item in newsRefTypeArr"
                   :key="item.cd"
                   :label="item.desc"
                   :value="item.cd"/>
             </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4.8">
             <el-form-item>
               <el-select v-model="searchForm.three"  placeholder="发布平台" clearable>
                 <el-option
                     v-for="item in newsForArr"
                     :key="item.cd"
                     :label="item.desc"
                     :value="item.cd"/>
               </el-select>
             </el-form-item>
        </el-col>

        <el-col :span="4.8">
               <el-form-item>
                 <el-select v-model="searchForm.four"  placeholder="新闻类别" clearable>
                   <el-option
                       v-for="item in newsTypeArr"
                       :key="item.dictCd"
                       :label="item.dictCnDesc"
                       :value="item.dictCd"/>
                 </el-select>
               </el-form-item>
        </el-col>

        <el-col :span="4.8">
            <el-button class="qclass" icon="el-icon-search" type="primary" @click="handleSearch" :style="{ display: newsQue }">查询</el-button>
            <el-button class="aclass" icon="el-icon-circle-plus-outline" type="primary" @click="addClick" :style="{ display: newsMod }">新增</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%">

      <el-table-column
          prop="newsTitle"
          label="新闻标题"
          align="center"
          fixed>
      </el-table-column>

      <el-table-column
          prop="newsRefType"
          label="链接类型"
          align="center"
          width="100">
      </el-table-column>

      <el-table-column
          prop="newsType"
          label="新闻类别"
          width="100"
          align="center">
      </el-table-column>

      <el-table-column
          prop="newsFor"
          label="发布平台"
          align="center"
          :formatter="newsForFormat"
          width="130">
      </el-table-column>

      <el-table-column
          prop="createTime"
          label="发布日期"
          align="center"
          width="200">
      </el-table-column>

        <el-table-column prop="newsId" label="上下架" width="160px" align="center">
            <template slot-scope="scope">
                <el-switch
                        v-model="scope.row.isSale"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="上架"
                        inactive-text="下架"
                        @change="switchSale(scope.row.isSale,scope.row.newsId)">
                 </el-switch>
            </template>
        </el-table-column>

      <el-table-column
          align="center"
          width="215"
          label="操作">
        <template slot-scope="scope">
            <el-button @click.native.prevent="refClick(scope.$index, tableData)" type="primary" class="refCLass">
                详情展示
            </el-button>

          <el-button @click.native.prevent="modifyClick(scope.$index, tableData)" style="padding:5px;" type="primary" :style="{ display: newsMod }">
            修改
          </el-button>
          <el-button @click.native.prevent="handleDelete(scope.$index, tableData)" style="padding:5px;" type="danger" :style="{ display: newsDel }">
            删除
          </el-button>
        </template>
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
  name: "newsIndex",
  components: {
  },
  data () {
    return {
      message: '',
      newsQue:'',
      newsAdd:'none',
      newsDel:'none',
      newsMod:'none',
      tempList: [],
      newsTypeArr:[],
      newsForArr:[{cd:'01',desc:'监管端'},{cd:'02',desc:'服务端'},{cd:'03',desc:'监管+服务'}],
      newsRefTypeArr:[{cd:'01',desc:'一般新闻'},{cd:'02',desc:'图片新闻'}],
      //查询
      tableData:[],
      total:0,
      page:1,
      size:10,
      // 绑定搜索数据
      searchForm: {
        one: null,
        two:null,
        three:null,
        four:null
      },
    }
  },
  mounted(){
    this.initTableData();
    this.getNewsTypeArr();
    this.newsAdd=this.$gloMsg.newsAdd;
    this.newsDel=this.$gloMsg.newsDel;
    this.newsMod=this.$gloMsg.newsMod;
  },
  methods: {
      //获取新闻类别
      async getNewsTypeArr(){
        this.$axios.get('/dict/getSysDict', {
          params: {
            dictTypeCd: '1002',
          }
        }).then(successResponse => {
          if (successResponse.data.code === 200) {
            this.newsTypeArr=successResponse.data.resultArr;
          }else{
            this.$alert('数据获取失败,请联系管理员！');
          }
        })
      },
      newsForFormat(row, column){
          if (row.newsFor === '01') {
              return '监管端';
          } else if(row.newsFor === '02'){
              return '服务端';
          } else if(row.newsFor === '03'){
              return '监管+服务';
          }
      },
    refClick (index, rows) {
        let ref=this.tableData[index].newsRef;
        if('01'===ref){
            let newsId= this.tableData[index].newsId;
            this.$router.push({path: '/newDetail',query:{ aid:newsId}});
        }else{
            window.open(ref, '_blank');
        }
    },
    addClick () {
      this.$router.replace({path: '/newsAdd'});
    },
    modifyClick (index, rows) {
      let newsId= this.tableData[index].newsId;
      this.$router.push({path: '/newsModify',query:{ newsId:newsId}});
    },

    handleSearch () {
        this.page=1;
        this.initTableData();
    },
    handleClear () {
      this.tableData = this.tempList;
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
      this.$axios.get('/news/getPcNews', {
        params: {
          page: this.page,
          size: this.size,
          newsTitle:this.searchForm.one,
          newsRefType:this.searchForm.two,
          newsFor:this.searchForm.three,
          newsType:this.searchForm.four,
        }
      }).then(successResponse => {
        if (successResponse.data.code === 200) {
          this.tableData=successResponse.data.result;//这里resp里面返回的数据是个对象，真正的数据在resp的data里；
          this.total=successResponse.data.total;
          this.tableData.map(function(val){
            if(val.newsDown==='1'){
                val.isSale=true;
            }else{
                val.isSale=false;
            }
          });
        }else{
          let message=successResponse.data.message;
          this.$message({message: message, type: 'error'});
        }
      })
    },
    //删除
    handleDelete (index, rows) {
      let newsTitle=rows[index].newsTitle;
      this.$confirm('此操作将删除 ( '+newsTitle+' ) 新闻信息, 是否继续?', '提示', {
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

    //切换是否上架
    switchSale(isSale, newsId) {
      const _this = this;
      if (isSale == true) {
        isSale = "1";
      } else {
        isSale = "0";
      }
      this.$axios.post('/news/newsDown',
        {
            newsId: newsId+'',
            newsDown: isSale,
        }).then(successResponse => {
          let message=successResponse.data.message;
          if (successResponse.data.code === 200) {
                if("1"===isSale){
                    this.$message({message: message, type: 'success'});
                }else{
                    this.$message({message: message, type: 'warning'});
                };
                this.initTableData();
          }else{
                this.$message({message: message, type: 'error'});
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
