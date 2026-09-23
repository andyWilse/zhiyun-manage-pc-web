<template>
<div>
      <el-button class="veQueryClass" icon="el-icon-search" type="primary" @click="hisSearch" :style="{ display: userMod }">
     			        查看历史版本
     			    </el-button>

        <el-table
            :data="tableData"
            border
            stripe
            style="width: 95%">

            <el-table-column
                prop="actNode"
                label="岗位"
                align="center"
                width="120">
            </el-table-column>

            <el-table-column
              prop="actReceiver"
              label="接收人"
              width=""
              align="center">
            </el-table-column>

            <el-table-column
              prop="actReceiveTime"
              label="接收时间"
              width="180"
              align="center">
            </el-table-column>

            <el-table-column
              prop="actHandNm"
              label="处理人"
               width="120"
              align="center">
            </el-table-column>

            <el-table-column
              prop="actHandleTime"
              label="处理时间"
              width="180"
              align="center">
            </el-table-column>

            <el-table-column
              prop="actState"
              label="状态"
              width="80"
              align="center">
            </el-table-column>

            <el-table-column
              prop="actComment"
              label="意见"
              width=""
              align="center">
            </el-table-column>

             <el-table-column
                  align="center"
                  width="220"
                  label="操作">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="modifyClick(scope.$index, tableData)" type="primary" style="padding:5px;" :style="{ display: userMod }">
                    修改
                  </el-button>
                  <el-button @click.native.prevent="deleteClick(scope.$index, tableData)" style="padding:5px;" type="danger" :style="{ display: userDel }">
                    删除
                  </el-button>
                </template>
              </el-table-column>
        </el-table>

        <act-dialog :dialog-act-modify="cAct_modify" @cAct_modify="changeAct_modify" ref="actModifyChild"> </act-dialog>

        <div style="position:absolute;right:100px;padding:20px;">
          <el-button @click="handleCancel" type="warning">取消</el-button>
        </div>

    </div>

</template>

<script>
import actDialog from './taskActModify'

export default {
    components: {
        'act-dialog': actDialog,
    },
    data () {
        return {
            message: '来自子组件的消息',
            procInstId:'',
            tableData:[],
            userMod:'none',
            userDel:'none',
            cAct_modify: false,
        }
    },
    created(){
        this.userMod=this.$gloMsg.userMod;
        this.userDel=this.$gloMsg.userDel;
        let procInstId=this.$route.query.procInstId;
        this.procInstId=procInstId;
        this.getModifyTask(procInstId);
    },
    //方法
    methods: {
        //获取用户信息
        getModifyTask(procInstId){
            this.$axios.get('/aiWarnTask/getAct', {
                params: {
                    procInstId: procInstId,
                }
            }).then(successResponse => {
                let response=successResponse.data;
                if (response.code === 200) {
                    this.tableData=response.resultList;
                    //this.$message({message: response.message, type: 'success'});
                }else{
                    this.$message({message: response.message,type: 'warning'});
                }
            })
        },
        //取消
        handleCancel () {
            this.$router.replace({path: '/eventIndex'});
        },

        //修改
        modifyClick (index, rows) {
            this.cAct_modify = true;
            let data=rows[index].actId;
            this.$refs.actModifyChild.showAct(data);
        },
        changeAct_modify() {
            this.cAct_modify= false;
            this.getModifyTask(this.procInstId);
        },
        //删除
        deleteClick(index, rows) {
            let actId=rows[index].actId;
            this.$confirm('此操作将删除该流程节点信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteConfirm(actId)
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },
        deleteConfirm(actId){
            this.$axios.post('/aiWarnTask/delAct/'+actId).then(successResponse => {
                let response=successResponse.data;
                let message=response.message;
                if (response.code === 200) {
                    this.$message({message: message, type: 'success'});
                    this.getModifyTask(this.procInstId);
                }else{
                    this.$message({message: message,type: 'warning'});
                }
            })
        },
        hisSearch(){
            this.$router.push({path: '/actHisDetail',query:{ procInstId:this.procInstId}});
        },
    },

}
</script>

<style scoped>

</style>
