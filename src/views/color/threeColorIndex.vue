<template>
  <div v-show="true">
    <el-form :inline="true" :model="searchForm" label-width="100px" class="searchForm" >
      <el-row>
        <el-col :span="6.2">
            <el-form-item label="场所:">
            <el-select v-model="searchForm.three"
               @focus="venuesSelect"
               clearable
               filterable
               allow-create>
                    <el-option
                        v-for="item in venuesList"
                        :key="item.venuesId"
                        :label="item.venuesName"
                        :value="item.venuesId"/>
            </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6.2">
         <el-form-item label="颜色:">
             <el-select v-model="searchForm.one" clearable @focus="getColorList" >
               <el-option
                   v-for="item in colorData"
                   :key="item.dictCd"
                   :label="item.dictCnDesc"
                   :value="item.dictCd"
               />
             </el-select>
           </el-form-item>
        </el-col>

        <el-col :span="6.2">
           <el-form-item label="类型:">
               <el-select v-model="searchForm.two" clearable @focus="getTypeList" >
                 <el-option
                     v-for="item in typeData"
                     :key="item.dictCd"
                     :label="item.dictCnDesc"
                     :value="item.dictCd"
                 />
               </el-select>
           </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-button class="refCLass" icon="el-icon-search" type="primary" @click="getThreeColorList" :style="{ display: veQue }">查询</el-button>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="2">
            <el-button class="aclass" icon="el-icon-circle-plus-outline" type="primary" @click="threeAddClick" :style="{ display: veAdd }">新增</el-button>
            <three-add-dialog :dialog-three-color-add="three_add_active" @three_add="three_add_change" @threeAdd="threeAddRewrite" ref="threeAddRef"></three-add-dialog>
        </el-col>
        <el-col :span="2">
            <el-button class="aclass" icon="el-icon-upload2" type="primary" @click="threeImportClick" :style="{ display: veAdd }">导入</el-button>
            <three-import-dialog :dialog-three-color-import="three_import_active" @three_import="three_import_change" @threeImport="threeImportRewrite" ref="threeImportRef"></three-import-dialog>
        </el-col>
      </el-row>
    </el-form>

    <el-table
        :data="tableData"
        border
        stripe
        style="width:100%"
        v-show="true"
    >
        <el-table-column
              prop="venuesName"
              label="场所名称"
              align="center"
              fixed>
        </el-table-column>

        <el-table-column
            prop="coTypeNm"
            label="要素类型"
            align="center"
            fixed>
        </el-table-column>

        <el-table-column
            prop="coColorNm"
            label="要素颜色"
            align="center"
            fixed>
        </el-table-column>

        <el-table-column
            prop="occurTm"
            label="发生时间"
            align="center"
            fixed>
        </el-table-column>

    <!--    <el-table-column
            prop="coContent"
            label="问题描述"
            align="center"
            fixed>
        </el-table-column>
     -->
        <el-table-column
            prop="coStateNm"
            label="处理进度"
            align="center"
            fixed>
        </el-table-column>

        <el-table-column
            prop="handleTm"
            label="完成时间"
            align="center"
            fixed>
        </el-table-column>

 <!--
      <el-table-column
            prop="coProgress"
            label="进度描述"
            align="center"
            fixed>
        </el-table-column>
        <el-table-column
            prop="coRemark"
            label="备注说明"
            align="center"
            fixed>
        </el-table-column>
-->


         <el-table-column prop="coId" label="是否在终端展示" width="160px" align="center">
            <template slot-scope="scope">
                <el-switch
                    v-model="scope.row.coShow"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="展示"
                    inactive-text="不展示"
                    @change="switchShow(scope.row.coShow,scope.row.coId,scope.row.coVenuesId)">
                 </el-switch>
            </template>
        </el-table-column>

        <el-table-column
        fixed="right"
        align="center"
        width="180"
        label="操作">
            <template slot-scope="scope">
                <el-button  class="refCLass" @click.native.prevent="threeDetailClick(scope.$index, tableData)" type="primary" style="padding:5px;" :style="{ display: veQue }">
                    详情
                </el-button>
                <el-button @click.native.prevent="threeModifyClick(scope.$index, tableData)" type="primary" style="padding:5px;" :style="{ display: veMod }">
                    修改
                </el-button>
                <el-button @click.native.prevent="handleDelete(scope.$index, tableData)" style="padding:5px;" type="danger" :style="{ display: veDel }">
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <three-detail-dialog :dialog-three-color-detail="three_detail_active" @three_detail="three_detail_change" @threeDetail="threeDetailRewrite" ref="threeDetailRef"></three-detail-dialog>
    <three-modify-dialog :dialog-three-color-modify="three_modify_active" @three_modify="three_modify_change" @threeModify="threeModifyRewrite" ref="threeModifyRef"></three-modify-dialog>


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
import threeAdd from './dialog/threeColorAdd';
import threeImport from './dialog/threeColorImport';
import threeModify from './dialog/threeColorModify';
import threeDetail from './dialog/threeColorDetail';
export default {
    components: {
        'three-add-dialog': threeAdd,
        'three-import-dialog': threeImport,
        'three-modify-dialog': threeModify,
        'three-detail-dialog': threeDetail,
    },
    data () {
        return {
            veQue:'',
            veAdd:'none',
            veMod:'none',
            veDel:'none',
            //查询
            page:1,
            size:10,
            tableData:[],
            total:0,
            // 绑定搜索数据
            searchForm: {
                one: null,
                two: null,
            },
            colorData:[],
            typeData:[],
            venuesList:[],
            three_add_active:false,
            three_import_active:false,
            three_modify_active:false,
            three_detail_active:false,
        }
    },

  mounted(){
      this.getThreeColorList();
      this.veAdd=this.$gloMsg.veAdd;
      this.veMod=this.$gloMsg.veMod;
      this.veDel=this.$gloMsg.veDel;
  },

  //加载
  created(){
  },

  methods: {
    //获取颜色
    getColorList(){
        this.$axios.get('/dict/getSysDict', {
            params: {
              dictTypeCd: '5001',
            }
          }).then(successResponse => {
            if (successResponse.data.code=== 200) {
              this.colorData=successResponse.data.resultArr;
            }else{
              this.$router.replace({path: '/error'})
            }
          })
    },
    //获取三色要素全要素
    getTypeList(){
       this.$axios.get('/dict/getSysDict', {
           params: {
             dictTypeCd: '5002',
           }
         }).then(successResponse => {
           if (successResponse.data.code=== 200) {
             this.typeData=successResponse.data.resultArr;
           }else{
             this.$router.replace({path: '/error'})
           }
         })
    },
    //获取场所
    venuesSelect(e) {
         let value = e.target.value;
          this.getVenuesList(value);
    },
    getVenuesList(query) {
        this.$axios.get('/venues/getStaffVenues', {
            params: {
                search: query
            }
          }).then(successResponse => {
            if (successResponse.data.code === 200) {
              this.venuesList=successResponse.data.result;
            }else{
                let message=successResponse.data.message;
                this.$message({message: message,type: 'warning'});
          }
        });
    },
    //三色要素列表数据
    getThreeColorList(){
        this.$axios.get('/color/list', {
            params: {
                page: (this.page-1)*this.size,
                size: this.size,
                searchOne:this.searchForm.one,
                searchTwo: this.searchForm.two,
                searchThree: this.searchForm.three,
            }
        }).then(successResponse => {
            let data=successResponse.data;
            if (data.code === 200) {
                this.tableData=data.result;
                this.total=data.total;
                this.tableData.map(function(val){
                    if(val.coShow==='1'){
                        val.coShow=true;
                    }else{
                        val.coShow=false;
                    }
                });
            }else{
                this.$message({message: data.message,type: "error"});
            }
        })
    },
    //分页
    sizeChange(pageSize){
        this.size=pageSize;
        this.getThreeColorList();
    },
    currentChange(currentPage){
        this.page=currentPage;
        this.getThreeColorList();
    },
    //新增
    threeAddClick(){
        this.three_add_active = true;
    },
    three_add_change() {
        this.three_add_active = false;
        this.getThreeColorList();
    },
    threeAddRewrite () {
        this.three_add_active = false;
    },
    //导入
    threeImportClick(){
        this.three_import_active = true;
    },
    three_import_change() {
        this.three_import_active = false;
        this.getThreeColorList();
    },
    threeImportRewrite () {
        this.three_import_active = false;
    },
    //详情
    threeDetailClick(index, rows){
        this.three_detail_active = true;
        this.$refs.threeDetailRef.form.coContent = this.tableData[index].coContent;
        this.$refs.threeDetailRef.form.coProgress = this.tableData[index].coProgress;
        this.$refs.threeDetailRef.form.coRemark = this.tableData[index].coRemark;
    },
    three_detail_change() {
        this.three_detail_active = false;
    },
    threeDetailRewrite () {
        this.three_detail_active = false;
    },
    //修改
    threeModifyClick(index, rows){
        this.three_modify_active = true;
        //参数回显
        this.$refs.threeModifyRef.form.coId = this.tableData[index].coId;
        this.$refs.threeModifyRef.form.coVenuesId = this.tableData[index].coVenuesId;
        this.$refs.threeModifyRef.form.coVenuesNm = this.tableData[index].venuesName;
        this.$refs.threeModifyRef.form.coType = this.tableData[index].coTypeNm;
        this.$refs.threeModifyRef.form.coColor = this.tableData[index].coColorNm;
        this.$refs.threeModifyRef.form.coState = this.tableData[index].coStateNm;
        this.$refs.threeModifyRef.form.coHandleTm = this.tableData[index].coHandleTm;
        this.$refs.threeModifyRef.form.coOccurTm = this.tableData[index].coOccurTm;
        this.$refs.threeModifyRef.form.coContent = this.tableData[index].coContent;
        this.$refs.threeModifyRef.form.coProgress = this.tableData[index].coProgress;
        this.$refs.threeModifyRef.form.coRemark = this.tableData[index].coRemark;
        //显示框
        //this.$refs.threeModifyRef.getHandleTm(this.tableData[index].coState);
    },
    three_modify_change() {
        this.three_modify_active = false;
        this.getThreeColorList();
    },
    threeModifyRewrite () {
        this.three_modify_active = false;
    },
    //删除
    handleDelete (index, rows) {
        let venuesName=rows[index].venuesName;
        let coTypeNm=rows[index].coTypeNm;
        let coColorNm=rows[index].coColorNm;
        const h = this.$createElement;
        this.$confirm('', {
            title:"提示",
            type:'warnig',
            message:h('p', null, [
                h('span', venuesName+"("+coTypeNm+"),"+coColorNm+"色要素。", ''),
                h('p', { style: 'color: red;font-weight:bold;position:absolute;' }, "删除后无法恢复，请谨慎操作！")
            ]),
        }).then(() => {
            this.deleteData(index, rows)
        }).catch(() => {
            this.$message.info('已取消删除');
        });
    },
    //删除
    deleteData(index, rows){
        let coId=rows[index].coId;
        let coVenuesId=rows[index].coVenuesId;
        this.$axios.post('/color/delete',{coId:coId,coVenuesId:coVenuesId})
        .then(successResponse => {
            let data=successResponse.data;
            if (data.code === 200) {
                this.getThreeColorList();
                this.$message({message:  data.message, type: 'success'});
            }else{
                this.$message({message: data.message,type: 'warning'});
            }
        })
    },
    //切换是否上架
    switchShow(coShow, coId,coVenuesId) {
        let isShow="";
        if (coShow == true) {
            isShow = "1";
        } else {
            isShow = "0";
        }
        this.$axios.post('/color/show',{
            coShow: isShow,
            coId: coId,
            coVenuesId:coVenuesId
        }).then(successResponse => {
            let data=successResponse.data;
            if (data.code === 200) {
                if("1"===coShow){
                    this.$message({message: data.message, type: 'success'});
                }else{
                    this.$message({message: data.message, type: 'warning'});
                };
                this.getThreeColorList();
            }else{
                this.$message({message: message, type: 'error'});
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

.refCLass{
    background-color:#156AA8;
    padding:5px;
}


</style>
