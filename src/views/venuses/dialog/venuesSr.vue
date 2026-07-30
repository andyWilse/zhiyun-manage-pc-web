<template>
  <div>
    <el-dialog title="三人驻堂信息：" :visible="dialogVenuesSr" :before-close="handleClose" width="50%">
         <el-col :span="2">
            <el-button class="aclass" icon="el-icon-circle-plus-outline" type="primary" @click="srAddClick" :style="{ display: veAdd }">
                新增
            </el-button>

        </el-col>
        <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%">

            <el-table-column
              prop="userNm"
              label="中文名"
              fixed
              align="center">
            </el-table-column>

            <el-table-column
              prop="userMobile"
              label="电话"
              align="center"
              fixed>
            </el-table-column>

            <el-table-column
              prop="identity"
              label="角色"
              align="center"
              fixed>
            </el-table-column>

            <el-table-column
                fixed="right"
                align="center"
                width="180"
                label="操作">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="srDelete(scope.$index, tableData)" style="padding:5px;" type="danger" class="veDeleteClass" :style="{ display: veDel }">
                      删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

      <add-dialog :dialog-sr-user-add="cActive_add" @cActive_add="changeActive_add"  ref="srUser">
      </add-dialog>

        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">关闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import venuesSrAdd from '@/views/venuses/dialog/venuesSrAdd.vue'

export default {
  props: ['isactive', 'dialogVenuesSr', 'index_from_parent'],
   components: {
      'add-dialog': venuesSrAdd
    },
  data () {
    return {
      message: '来自子组件的消息',
      tableData:[],
      veAdd:'none',
      veDel:'none',
      venuesId:'',
      venuesName:'',
      srData:[],
      veAddData:[],
      cActive_add: false,
    }
  },
  mounted(){
    this.veAdd=this.$gloMsg.veAdd;
    this.veDel=this.$gloMsg.veDel;
  },
  methods: {
    /*三人驻堂反显*/
    getVenuesSr(data){
        this.srData=data;
        this.venuesId=data[0];
        this.venuesName=data[1];
        this.$axios.get('/user/getSr', {
            params: {
                venuesId: this.venuesId,
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
      this.$emit('cActive_sr');
    },
    handleClose (done) {
      this.$emit('cActive_sr');
      done();
    },
    //删除1
    srDelete (index, rows) {
        let us=rows[index];
        let uvId=us.uvId;
        let ope='将( '+us.userNm+' )从场所('+this.venuesName+')删除';
        this.$confirm('此操作会'+ope+', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.deleteData(uvId,ope);
        }).catch(() => {
            this.$message.info('已取消删除');
        });
    },
    //删除2
    deleteData(uvId,ope){
        this.$axios.post('/user/deleteSr/',{
            uvId: uvId,
            operation: ope,
            }).then(successResponse => {
                if (successResponse.data.code === 200) {
                    this.getVenuesSr(this.srData);
                }else{
                    this.$router.replace({path: '/'});
                }
        })
    },

    //增加
    srAddClick() {
        this.cActive_add = true;
        let veAddData=[];
        veAddData[0]=this.venuesId;
        veAddData[1]=this.venuesName;
        this.$refs.srUser.getSelect(veAddData);
    },
    changeActive_add () {
        this.cActive_add= false;
        this.getVenuesSr(this.srData);
    },
  }
}
</script>

<style scoped>

</style>
