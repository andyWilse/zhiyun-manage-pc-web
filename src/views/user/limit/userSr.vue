<template>
  <div>
    <el-dialog title="三人驻堂信息：" :visible="dialogUserSr" :before-close="handleClose" width="50%">
        <el-col :span="2">
            <el-button class="aclass" icon="el-icon-circle-plus-outline" type="primary" @click="venuesAddClick" :style="{ display: veAdd }">
                新增
            </el-button>
            <venues-user :dialog-user-venues-select="cActive_addVe" @cActive_addVe="changeActive_addVe" @cAdd="handleRewrite" ref="userVenueRef"></venues-user>
        </el-col>
        <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%">

            <el-table-column
                prop="venuesName"
                label="场所名称"
                width="150"
                align="center"
                fixed>
            </el-table-column>

            <el-table-column
                prop="venuesAddres"
                label="场所地址"
                align="center"
                fixed>
            </el-table-column>

            <el-table-column
                fixed="right"
                align="center"
                width="180"
                label="操作">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="userDelete(scope.$index, tableData)" style="padding:5px;" type="danger" class="veDeleteClass" :style="{ display: veDel }">
                      删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" type="warning">关闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import userVenuesAdd from '@/views/user/limit/userVenuesAdd';

export default {
  props: ['isactive', 'dialogUserSr', 'index_from_parent'],
   components: {
         'venues-user': userVenuesAdd,
    },
  data () {
    return {
      message: '来自子组件的消息',
      tableData:[],
      veAddData:[],
      srData:[],
      venuesList:[],
      venuesId:0,
      veDel:'none',
      veAdd:'none',
      cActive_addVe:false,
      userNm: '',
      userId:0,
    }
  },
  mounted(){
    this.veDel=this.$gloMsg.veDel;
    this.veAdd=this.$gloMsg.veAdd;
  },
  methods: {
    /*三人驻堂关联场所反显*/
    getSrVenues(data){
        this.srData=data;
        this.userId=data[0];
        this.userNm=data[1];
        this.venuesList=data[2];
        this.$axios.get('/venues/getVeUs', {
            params: {
                uvUserId: this.userId,
            }
        }).then(successResponse => {
            if (successResponse.data.code=== 200) {
                this.tableData=successResponse.data.result;
            }else{
                this.$router.replace({path: '/error'})
            }
        })
    },
    handleCancel () {
      // 对应事件cActive
      this.$emit('cActive_user');
    },
    handleClose (done) {
      this.$emit('cActive_user');
      done();
    },
    //删除1
    userDelete (index, rows) {
        let ve=rows[index];
        this.venuesId=ve.venuesId;
        let ope='将场所( '+ve.venuesName+' )从('+this.userNm+')删除';
        this.$confirm('此操作会'+ope+', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.deleteVenue(ope);
        }).catch(() => {
            this.$message.info('已取消删除');
        });
    },
    //删除2
    deleteVenue(ope){
        this.$axios.post('/user/deleteVe/',{
            venuesId: this.venuesId,
            operation: ope,
            }).then(successResponse => {
                if (successResponse.data.code === 200) {
                    this.$message({message: ope+'成功', type: 'success'});
                    this.getSrVenues(this.srData);
                }else{
                    this.$message({type: "error", message: successResponse.data.message,});
                    this.$router.replace({path: '/'});
                }
        })
    },
    changeActive_addVe () {
        this.cActive_addVe = false;
        this.$alert(this.srData);
        this.getSrVenues(this.srData);
    },
    handleRewrite () {
        this.cActive_addVe = false;
    },
    //增加
    venuesAddClick() {
        this.cActive_addVe = true;
        let veAddData=[];
        veAddData[0]=this.userId;
        veAddData[1]=this.userNm;
        veAddData[2]=this.venuesList;
        this.$refs.userVenueRef.getSelect(veAddData);
    },
    changeActive_addVe () {
        this.cActive_addVe= false;
        this.getSrVenues(this.srData);
    },
  }
}
</script>

<style scoped>

</style>
