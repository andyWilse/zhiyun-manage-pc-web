<template>
  <div>
    <el-dialog title="流程信息" :visible="dialogActModify" :before-close="handleClose" width="70%" height="220%">
        <el-form ref="form" :model="form" label-width="100px">
            <div style="display: flex; justify-content: flex-end;margin-right:100px;margin-bottom:12px;">
                <slot name=”header”>
                    <el-button @click="handleCancel" type="warning">取消</el-button>
                    <el-button @click="handleSubmit" type="primary">保存</el-button>
                </slot>
            </div>
            <el-row :gutter="24">
                <el-col :span="7">
                    <el-form-item label="岗位："  prop="actNode">
                        <el-input v-model="form.actNode" :readonly="true" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="推送时间:" prop="actReceiveTime">
                        <el-date-picker v-model="form.actReceiveTime"
                        @change="actReceiveTmChange"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="处理时间:" prop="actHandleTime">
                        <el-date-picker v-model="form.actHandleTime"
                        @change="actHandleTmChange"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="24">
                <el-col :span="7">
                    <el-form-item label="处理人：" prop="actHandler">
                        <el-select v-model="form.actHandler" @change="actHandChange" clearable >
                          <el-option
                              v-for="item in rTableData"
                              :key="item.assMobile"
                              :label="item.assAssignee"
                              :value="item.assMobile"
                          />
                        </el-select>
                    </el-form-item>
                 </el-col>
                <el-col :span="15">
                    <el-form-item label="反馈:" prop="actComment">
                        <el-input v-model="form.actComment"
                            @change="actCommentChange"
                          placeholder=""
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 10}">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="0">
                <el-col :span="12" class="actClass">
                    <el-form-item label="推送人:" prop="actReceiver">
                        <div class="item" style="padding-left:77%;">
                          <el-button @click="assAddClick"  style="padding:5px;" type="primary" :style="{ display: userDel }">
                            增加推送人
                          </el-button>
                          </div>
                         <el-table
                            :data="rTableData"
                            border
                            stripe
                            style="width: 95%">

                            <el-table-column
                                prop="assAssignee"
                                label="接收人"
                                align="center"
                                width="130">
                            </el-table-column>

                            <el-table-column
                                prop="assMobile"
                                label="电话"
                                align="center"
                                width="150">
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

                <el-col :span="12">
                 <el-form-item label="照片" v-show="false">
                        <el-input v-model="form.actPicture"></el-input>
                  </el-form-item>
                   <el-upload ref="elUpload"
                      action="http://localhost:7081/api/file/images/upload"
                      list-type="picture-card"
                      :on-preview="handlePictureCardPreview"
                      :on-success="imgSuccess"
                      :on-error="imgError"
                      :on-remove="imgRemove"
                      :file-list="actPictureList">
                      <i class="el-icon-plus"></i>
                   </el-upload>
                </el-col>

           <!--      <el-col :span="10">
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
        -->
            </el-row>
        </el-form>
    </el-dialog>
    <ass-dialog :dialog-ass-add="cAss_add" @cAss_add="changeAss_add" ref="assAddRef"> </ass-dialog>

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
            actReceiveTm:'',
            actHandleTm:'',
            addAssignee:[],
            changeHandler:'',
            actPictureList:[],
            actPicture:'',
            fileRemove:'',
            actComment:'',
            userDel:'none',
            actHandNm:'',
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
                    //this.hTableData = result.actHandler;
                    this.form = result.actDetail;
                    this.actHandler = result.actHandler;
                    this.actHandNm=result.actHandNm;
                    this.actPictureList=result.cutPictureList
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
        //保存
        handleSubmit () {
            //保存修改
            this.$axios.post('/aiWarnTask/saveAct',
            {
                actId:this.form.actId,
                actReceiveTm:this.actReceiveTm,
                actHandleTm:this.actHandleTm,
                addAssignee:this.addAssignee,
                changeHandler:this.changeHandler,
                actComment:this.actComment,
                actPicture:this.form.actPicture,
                fileRemove:this.fileRemove,
            }
            ).then(successResponse => {
                let response=successResponse.data;
                let message=response.message;
                if (response.code === 200) {
                    this.$message({message: '修改保存成功！', type: 'success'});
                    this.addAssignee = [];
                    this.$refs.assAddRef.redisSr = [];
                    this.$emit('cAct_modify');
                }else{
                     this.$message({message: message,type: 'warning'});
                     this.showAct(this.actId);
                }
              })
        },

        //删除
        delReClick(index, rows) {
            let assId = rows[index].assId;
            let assMobile = rows[index].assMobile;
            let assAssignee = rows[index].assAssignee;
            this.$confirm('此操作将删除任务接收人, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteConfirm(assId,assMobile,assAssignee,index)
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },
        deleteConfirm(assId,assMobile,assAssignee,index){
            if(0===assId){
                this.rTableData.splice(index,1);
                this.addAssignee.splice(index,1);
            }else{
                this.$axios.post('/aiWarnTask/delAss',
                    {
                        assId:assId,
                        actId:this.actId,
                        assMobile:assMobile,
                        assAssignee:assAssignee
                    }
                ).then(successResponse => {
                    let response=successResponse.data;
                    let message=response.message;
                    if (response.code === 200) {
                        //this.$message({message: message, type: 'success'});
                        this.rTableData.splice(index,1);
                    }else{
                        this.$message({message: message,type: 'warning'});
                    }
                })
            }

        },
        //增加接收人
        assAddClick() {
            this.cAss_add = true;
            this.$refs.assAddRef.getSelect();
        },
        //接收人返回追加
        changeAss_add() {
            this.cAss_add= false;
            let addAss=this.$refs.assAddRef.redisSr;
            if(addAss.length>0){
                this.addAssignee=addAss;
                for (let i = 0; i < addAss.length; i++) {
                  const item = addAss[i];
                  let userMobile=item.userMobile;
                  let userNm=item.userNm;
                  let obj = { assAssignee: userNm, assMobile: userMobile };
                  let newTableData=this.rTableData.concat(obj);
                  this.rTableData=newTableData;
                }
            }
        },
        //接收人新增
        actHandChange(value) {
           let resultArr = this.rTableData.filter((item)=>{
              return item.assMobile === value;
            });
            let liveUserName = resultArr[0].assAssignee;
            this.actHandNm = liveUserName;
            this.actHandler = value;
            this.changeHandler=value;
        },
        //接收时间
        actReceiveTmChange(value) {
            this.actReceiveTm=value;
        },
        //处理时间
        actHandleTmChange(value) {
            this.actHandleTm=value;
        },
        //反馈
        actCommentChange(value) {
            this.actComment=value;
        },

        // 上传成功
        imgSuccess(res, file, fileList) {
            this.imageUrl = URL.createObjectURL(file.raw);
            //重点  得到上传图片的名字
            if(this.form.actPicture===undefined){
                this.form.actPicture='';
            }
            this.form.actPicture=this.form.actPicture+res.result+',';
        },
        // 上传失败
        imgError(res) {
            this.$message({type: "error", message: "图片上传失败",});
        },
        // 删除图片
        imgRemove(file, fileList) {
                let url=file.url;
                let remove='';
                if(url.includes('blob:http:')){
                    remove=file.response.result;
                }else{
                    remove=file.fileId;
                }
            this.fileRemove=this.fileRemove+remove+',';
            this.form.actPicture=this.form.actPicture.replace(remove+",", '');
        },
        //图片处理
        handlePictureCardPreview(file) {
            console.log(file);
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

  .actClass{
  	    #border: 1px solid #9b2e25;
  	    #margin-left: 30px;

  }

  .slotClass{
      margin-right: 0px;
      #float:right;

  }
</style>
