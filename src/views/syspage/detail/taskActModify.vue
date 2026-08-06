<template>
  <div>
    <el-dialog title="流程信息" :visible="dialogActModify" :before-close="handleClose" width="70%">

        <el-form ref="form" :model="form" label-width="100px">
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="岗位"  prop="actNode">
                        <el-input v-model="form.actNode" :readonly="true" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="接收时间" prop="actReceiveTime">
                        <el-date-picker v-model="form.actReceiveTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="处理时间" prop="actHandleTime">
                        <el-date-picker v-model="form.actHandleTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="14">
                    <el-form-item label="接收人" prop="actReceiver">
                        <div class="item" style="padding-left:77%;">
                          <el-button @click.native.prevent="computedTableData()" style="padding:5px;" type="primary" :style="{ display: userDel }">
                            增加接收人
                          </el-button>
                          <ass-dialog :dialog-ass-add="cAss_add" @cAss_add="changeAss_add" ref="assAddChild"> </ass-dialog>
                          </div>
                         <el-table
                            :data="rTableData"
                            border
                            stripe
                            @cell-mouse-enter="handleCellEnter"
                            @cell-mouse-leave="handleCellLeave"
                            style="width: 95%">

                            <el-table-column
                                prop="assAssignee"
                                label="接收人"
                                align="center"
                                width="130">
                                <div class="item" slot-scope="scope">
                                  <el-input class="item_input" v-model="scope.row.assAssignee" placeholder="请输入内容" clearable></el-input>
                                  <div class="item_txt" >{{scope.row.assAssignee}}</div>
                                </div>
                            </el-table-column>

                            <el-table-column
                                prop="assMobile"
                                label="电话"
                                align="center"
                                width="150">
                            <div class="item" slot-scope="scope">
                              <el-input class="item_input" v-model="scope.row.assMobile" placeholder="请输入内容"></el-input>
                              <div class="item_txt" >{{scope.row.assMobile}}</div>
                            </div>
                            </el-table-column>
                            <el-table-column
                              align="center"
                              label="操作">
                                  <template slot-scope="scope">
                                     <el-button @click.native.prevent="delReClick(scope.$index, rTableData)" style="padding:5px;" type="danger" :style="{ display: userDel }">
                                        删除
                                     </el-button>
                                 </template>
                             </el-table-column>
                         </el-table>
                    </el-form-item>
                </el-col>

                <el-col :span="10">
                    <el-form-item label="处理人"  prop="actHandNm">
                        <el-table
                            :data="hTableData"
                            style="width: 95%"
                            @cell-mouse-enter="handleCellEnter"
                            @cell-mouse-leave="handleCellLeave"
                            border
                            stripe>

                            <el-table-column
                                prop="actHandNm"
                                label="处理人"
                                align="center"
                                width="">
                                <div class="item" slot-scope="scope">
                                  <el-input class="item_input" v-model="scope.row.actHandNm" placeholder="请输入内容"></el-input>
                                  <div class="item_txt" >{{scope.row.actHandNm}}</div>
                                </div>
                            </el-table-column>

                            <el-table-column
                                prop="actHandler"
                                label="电话"
                                align="center"
                                width="">
                                <div class="item" slot-scope="scope">
                                  <el-input class="item_input" v-model="scope.row.actHandler" placeholder="请输入内容"></el-input>
                                  <div class="item_txt" >{{scope.row.actHandler}}</div>
                                </div>
                            </el-table-column>
                         </el-table>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>


        <span slot="footer" class="dialog-footer">
            <el-button @click="handleSubmit" type="primary">保存</el-button>
            <el-button @click="handleCancel" type="warning">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import assDialog from './taskAssAdd'

export default {
    props: ['isactive', 'dialogActModify', 'index_from_parent'],
    components: {
            'ass-dialog': assDialog,
        },
    data () {
        return {
            message: '来自子组件的消息',
            cAss_add: false,
            actId:'',
            rTableData:[],
            hTableData:[],
            form: {},
            userDel:'none',
            editProp: ['assAssignee', 'assMobile', 'actHandNm', 'actHandler'],
        }
    },
    created(){
        this.userDel=this.$gloMsg.userDel;
    },
    computed: {
    },
    methods: {
        //内容反显
        showAct(actId){
            this.actId = actId;
            this.$axios.get('/aiWarnTask/getNode/'+actId).then(successResponse => {
                let response=successResponse.data;
                let message=response.message;
                let result=response.result;
                if (response.code === 200) {
                    this.rTableData = result.actReceiver;
                    this.hTableData = result.actHandler;
                    this.form = result.actDetail;
                }else{
                    this.$message({message: message,type: 'warning'});
                }
            })
        },
        //取消
        handleCancel () {
          // 对应事件cActive
          this.$emit('cAct_modify');
        },
        //关闭
        handleClose (done) {
          this.$emit('cAct_modify');
          done();
        },
        /** 鼠标移入cell */
        handleCellEnter (row, column, cell, event) {
            const property = column.property
            if (this.editProp.includes(property)) {
                cell.querySelector('.item_input').style.display = 'block';
                cell.querySelector('.item_txt').style.display = 'none';
            }
        },
        /** 鼠标移出cell */
        handleCellLeave (row, column, cell, event) {
            const property = column.property
            if (this.editProp.includes(property)) {
                cell.querySelector('.item_input').style.display = 'none';
                cell.querySelector('.item_txt').style.display = 'block';
            }
        },
        //保存
        handleSubmit () {
            //保存修改
            this.$axios.post('/aiWarnTask/saveAct',
            {
                actReceiver:this.rTableData,
                actHandler:this.hTableData,
                actDetail:this.form
            }
            ).then(successResponse => {
                let response=successResponse.data;
                let message=response.message;
                if (response.code === 200) {
                    this.$message({message: '修改保存成功！', type: 'success'});
                }else{
                     this.$message({message: message,type: 'warning'});
                     this.showAct(this.actId);
                }
              })
        },

        //删除
        delReClick(index, rows) {
            let assId=rows[index].assId;
            this.$confirm('此操作将删除任务接收人, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteConfirm(assId)
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },
        deleteConfirm(assId){
            this.$axios.post('/aiWarnTask/delAss/'+assId).then(successResponse => {
                let response=successResponse.data;
                let message=response.message;
                if (response.code === 200) {
                    this.$message({message: message, type: 'success'});
                    this.showAct(this.actId);
                }else{
                    this.$message({message: message,type: 'warning'});
                }
            })
        },
        //增加接收人
        addReClick() {
            this.cAss_add = true;
            this.$refs.assAddChild.init(this.actId);
        },
        changeAss_add() {
            this.cAss_add= false;
            this.showAct(this.actId);
        },
        //添加一行 1
        computedTableData() {
           const newData = this.rTableData; // 克隆原始数据
           const customRow = { assAssignee: "", assMobile: "" }; // 自定义行内容
           newData.splice(0, 0, customRow); // 插入到第二行位置
           return newData;
        },
        //添加一行 2
        handleAddDetails() {
         if (this.rTableData == undefined) {
           this.rTableData = new Array();
         }
         let obj = {};
         obj.assAssignee = "1";
         obj.assMobile = "1";
         this.rTableData.push(obj);
        },

    }
}
</script>

<style scoped>
.item{
    .item_input{
      display: none;
      width: 100px;
      /* 调整elementUI中样式 如果不需要调整请忽略 */
      .el-input__inner{
        height: 24px!important;
      }
      /* 调整elementUI中样式 如果不需要调整请忽略 */
      .el-input__suffix{
        i{
          font-size: 12px !important;
          line-height: 26px !important;
        }
      }
    }
    .item_txt{
      box-sizing: border-box;
      line-height: 24px;
      padding: 0 9px;
    }
  }
</style>
