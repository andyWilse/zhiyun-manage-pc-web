<template>
  <div>
    <el-form :inline="true" :model="searchForm" label-width="82px" class="searchForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="设备编号:">
                <el-input v-model="searchForm.one" placeholder="设备编号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
               <el-form-item label="场所名称:">
                 <el-input v-model="searchForm.two" placeholder="场所名称" clearable></el-input>
               </el-form-item>
             </el-col>
             <el-col :span="6">
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
               <el-col :span="6">
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
          </el-row>

        <el-row>
           <el-col :span="6">
             <el-form-item label="起始时间:">
                 <el-date-picker v-model="searchForm.five" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                 </el-date-picker>
             </el-form-item>
           </el-col>
           <el-col :span="6">
              <el-form-item label="结束时间:">
                  <el-date-picker v-model="searchForm.six" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
              </el-form-item>
           </el-col>

           <el-col :span="6">
              <el-button icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
           </el-col>

           <el-col :span="6">
             <download-excel :before-generate="startDownload"
                             :fetch="fetchData"
                             :before-finish="finishDownload"
                             :fields="fields"
                             :name="excelName">
                  <el-button type="primary" icon="el-icon-top" >导出excel</el-button>
             </download-excel>
            </el-col>
        </el-row>
    </el-form>

    <el-table
        :data="tableData"
        border
        stripe
        style="width: 95%"
    >

      <el-table-column
          prop="eventType"
          label="预警类型"
          align="center"
          width="100"
          >
      </el-table-column>

      <el-table-column
          prop="accessNumber"
          label="设备编号"
          auto
          align="center">
      </el-table-column>

      <el-table-column
           prop="warnTime"
           label="预警时间"
           align="center"
           width="180">
      </el-table-column>

      <el-table-column
          prop="venuesName"
          label="场所名称"
          align="center"
          width="150">
      </el-table-column>

   <!--   <el-table-column
          prop="venuesAddres"
          label="场所地址"
          align="center"
          width="330">
      </el-table-column> -->

       <el-table-column
          prop="eventState"
          label="状态"
          width="90"
          align="center">
       </el-table-column>

      <el-table-column
          prop="handlePerson"
          label="处理人"
           width="130"
          align="center">
      </el-table-column>

      <el-table-column
          prop="handleTime"
          label="处理时间"
          width="180"
          align="center">
      </el-table-column>

      <el-table-column  align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click.native.prevent="handleClick(scope.$index, tableData)" style="padding:5px;" type="primary">
              查看详情
           </el-button>
            <el-button @click.native.prevent="handleDelete(scope.$index, tableData)" style="padding:5px;" type="danger" :style="{display: eventDel}">
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
import DownloadExcel from 'vue-json-excel';

export default {
  components: {
    DownloadExcel,
  },
  data () {
    return {
      message: '',
      isShow: true,
      eventDel:'none',
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
        five: null,
        six: null,
      },
      fields: {
          '预警类型': 'eventType',
          '预警时间': 'warnTime',
          '场所名称': 'venuesName',
          '状态': 'eventState',
          '处理人': 'handlePerson',
          '处理时间': 'handleTime',
      },
      exportList:[],
      excelName: '20250304-002.xls',
    }
  },
  mounted(){
    this.initTableData();
  },
created(){
    this.getEventSelect();
    this.eventDel=this.$gloMsg.eventDel;
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
          startTime:this.searchForm.five,
          endTime:this.searchForm.six,
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

	startDownload() {
        console.log('开始生成文件');
    },

    finishDownload() {
        //alert('hide loading');
        console.log('文件生成完成');
    },
    // fetch 方法：动态获取数据
    fetchData() {
          return new Promise((resolve) => {
            this.exportTemplate();
                             // 返回要导出的数据
                            resolve(this.exportList);
          });
    },
    //下载
    exportTemplate() {
        this.$axios.get('/event/export', {
               params: {
                 accessNumber:this.searchForm.one,
                 venuesName:this.searchForm.two,
                 eventType:this.searchForm.three,
                 eventState:this.searchForm.four,
                 startTime:this.searchForm.five,
                 endTime:this.searchForm.six,
               }
        }).then(successResponse => {
            // 返回的数据
            if (successResponse.data.code === 200) {
               this.exportList = successResponse.data.resultArr;
               let now = new Date();
               let hours = now.getHours(); // 获取当前小时
               let minutes = now.getMinutes(); // 获取当前分钟
               let seconds = now.getSeconds(); // 获取当前秒数
               this.excelName='预警'+hours+minutes+seconds+'.xls';
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

    handleClick(index, rows){
      //this.isActive=true;
      let procInstId=this.tableData[index].procInstId;
      this.$router.push({path: '/taskDetail',query:{ procInstId:procInstId}});
      //this.$refs.myCommentChild.getComment(procInstId);
    },
    //删除
    handleDelete (index, rows) {
      let venuesAddres=rows[index].venuesAddres;
      let venuesName=rows[index].venuesName;
      let warnTime=rows[index].warnTime;
      let eventType=rows[index].eventType;
      let year=warnTime.slice(0,4);
      let month=warnTime.slice(5,7);
      let day=warnTime.slice(8,10);
      let time=warnTime.slice(11,16);
      let date=year+"年"+month+"月"+day+"日"+time;

      const h = this.$createElement;
      this.$confirm('', {
          title:"提示",
          type:'warnig',
          message:h('p', null, [
              h('span', "  "+venuesAddres+"("+venuesName+"),"+date+","+eventType+"事件。", ''),
              h('p', { style: 'color: red;font-weight:bold;position:absolute;' }, "删除后无法恢复，请谨慎操作！")
          ]),
          // iconClass:"el-icon-question colorYellow",
      	}).then(() => {
                  this.deleteData(index, rows)
                }).catch(() => {
                  this.$message.info('已取消删除');
                });
    },
    //删除
    deleteData(index, rows){
      let eventId=rows[index].eventId;
      this.$axios.post('/event/deleteEvent/' + eventId)
        .then(successResponse => {
              if (successResponse.data.code === 200) {
                 this.handleSearch();
                 this.$message({message: '预警信息删除成功！', type: 'success'});
              }else{
                let message=successResponse.data.message;
                this.$message({message: message,type: 'warning'});
              }
        })
    },

  }
}
</script>

<style>

</style>
