<template>
    <div>
        <el-dialog title="三色要素信息修改：" :visible="dialogThreeColorModify" :before-close="handleClose" width="50%">
            <el-form ref="form" :model="form" label-width="100px" label-position="right" :rules="formRules" style="border:1px solid #C4E1C5;padding:20px;">

                <el-row>
                    <el-col :span="12">
                       <el-form-item label="场所名称" prop="coVenuesId" label-width="">
                           <el-select v-model="form.coVenuesId"
                           @focus="venuesSelect"
                           @change="coVenuesChange"
                           ref="venuesRef"
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
                    <el-col :span="12">
                       <el-form-item label="要素类型:" prop="coType">
                          <el-select v-model="form.coType"
                          @focus="getTypeList"
                          @change="coTypeChange"
                          clearable>
                            <el-option
                                v-for="item in typeData"
                                :key="item.dictCd"
                                :label="item.dictCnDesc"
                                :value="item.dictCd"
                            />
                          </el-select>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="要素颜色:" prop="coColor">
                             <el-select v-model="form.coColor"
                             @focus="getColorList"
                             @change="coColorChange"
                             clearable>
                                   <el-option
                                       v-for="item in colorData"
                                       :key="item.dictCd"
                                       :label="item.dictCnDesc"
                                       :value="item.dictCd"
                                   />
                             </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发生时间:"  prop="coOccurTm">
                           <el-date-picker
                           v-model="form.coOccurTm"
                           type="datetime"
                           @change="coOccurTmChange"
                           placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss">
                           </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                            <el-form-item label="问题描述:" prop="coContent">
                                <el-input v-model="form.coContent"
                                  placeholder="请填写"
                                  @change="coContentChange"
                                  type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 10}">
                                </el-input>
                            </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                         <el-form-item label="处理进度:" prop="coState">
                             <el-select v-model="form.coState"
                             @focus="getCoStateList"
                             @change="coStateChange"
                             clearable>
                                   <el-option
                                       v-for="item in StateData"
                                       :key="item.dictCd"
                                       :label="item.dictCnDesc"
                                       :value="item.dictCd"
                                   />
                             </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="完成时间:"  prop="coHandleTm" v-if="showCoHandleTm">
                           <el-date-picker
                           v-model="form.coHandleTm"
                           @change="coHandleTmChange"
                           type="datetime" placeholder="选择日期时间"
                           value-format="yyyy-MM-dd HH:mm:ss">
                           </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                            <el-form-item label="进度描述:" prop="coProgress">
                                <el-input
                                  v-model="form.coProgress"
                                  @change="coProgressChange"
                                  placeholder="请填写"
                                  type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 10}">
                                </el-input>
                            </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                            <el-form-item label="备注说明:" prop="coRemark">
                                <el-input
                                  v-model="form.coRemark"
                                  @change="coRemarkChange"
                                  placeholder="请填写"
                                  type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 10}">
                                </el-input>
                            </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleSave" type="success">保存</el-button>
                <el-button @click="handleCancel" type="warning">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: ['isactive', 'dialogThreeColorModify', 'index_from_parent'],

    components: {

    },

    data () {
        return {
            message: '来自子组件的消息',
            venuesList:[],
            colorData:[],
            typeData:[],
            StateData:[],
            showCoHandleTm:false,
            modifyFlag:false,
            form: {
                coId: '',
                coVenuesId: '',
                coType:'',
                coColor:'',
                coOccurTm:null,
                coContent:'',
                coState:'',
                coHandleTm:null,
                coProgress:'',
                coRemark:'',
            },
            formRules: {
                coVenuesId:[{required: true, message: '请输入场所名称', trigger: 'blur'}],
                coType:[{required: true, message: '请输入要素类型', trigger: 'blur'}],
                coColor:[{required: true, message: '请输入要素颜色', trigger: 'blur'}],
                coOccurTm:[{required: true, message: '请输入发生时间', trigger: 'blur'}],
                coContent:[{required: true, message: '请输入问题描述', trigger: 'blur'}],
                coState:[{required: true, message: '请输入处理进度', trigger: 'blur'}],
                coProgress:[{required: false, message: '请输入进度描述', trigger: 'blur'}],
            },
        }
    },

    mounted(){

    },
     created(){

     },
    methods: {
        getHandleTm(coState){
            if('01'===coState){
                this.showCoHandleTm=true;
            }else{
                this.showCoHandleTm=false;
            }
        },
        //保存
        handleSave () {
            if('01'===this.form.coState){
               let coHandleTm= this.form.coHandleTm;
               if(''===coHandleTm || null===coHandleTm || undefined ===coHandleTm){
                    this.$alert('已处理的完成时间不能为空，请填写后提交！');
                    return;
               }
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                  if(this.modifyFlag){
                    this.handleSubmitPost();
                  }else{
                    this.$alert('信息无修改，退出请点击取消！');
                  }
                }else{
                  this.$alert('填写信息有误，请重新填写后提交！');
                }
            });
        },
        //提交
        handleSubmitPost(){
              this.$axios.post('/color/update', {
                    coId: this.form.coId,
                    coVenuesId: this.coVenuesId,
                    coType:this.coType,
                    coColor:this.coColor,
                    coOccurTm: new Date(this.coOccurTm),
                    coContent:this.coContent,
                    coState:this.coState,
                    coHandleTm:new Date(this.coHandleTm),
                    coProgress:this.coProgress,
                    coRemark:this.coRemark
              }).then(successResponse => {
                    let code=successResponse.data.code;
                    let message=successResponse.data.message;
                    if (code === 200) {
                        this.$message({message: message, type: 'success'});
                        this.clearData();
                        this.$emit('three_modify');
                    }else{
                        this.$message({message: message,type: "error"});
                    }
              })
            },
        //取消
        handleCancel () {
            this.clearData();
            this.$emit('three_modify');
        },
        //关闭
        handleClose (done) {
            this.clearData();
            this.$emit('three_modify');
            done();
        },
        //获取场所
        venuesSelect(e) {
             let value = e.target.value;
              this.getVenuesList(value);
        },
        //查询
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
        //获取处理进度
        getCoStateList(){
           this.$axios.get('/dict/getSysDict', {
               params: {
                 dictTypeCd: '7001',
               }
             }).then(successResponse => {
               if (successResponse.data.code=== 200) {
                 this.StateData=successResponse.data.resultArr;
               }else{
                 this.$router.replace({path: '/error'})
               }
             })
        },
        //更新场所
        coVenuesChange(value) {
            this.coVenuesId=value;
            this.checkData(this.coVenuesId);
        },
        //更新类型
        coTypeChange(value) {
            this.coType=value;
            this.checkData(this.coType);
        },
        //更新颜色
        coColorChange(value) {
            this.coColor=value;
            this.checkData(this.coColor);
        },
        //更新发生时间
        coOccurTmChange(value) {
            this.coOccurTm=value;
            this.checkData(this.coOccurTm);
        },
        //更新问题描述
       coContentChange (value) {
            this.coContent=value;
            this.checkData(this.coContent);
        },
        //更新处理进度
       coStateChange(value){
            //更新进度
            this.coState=value;
            this.checkData(this.coState);
            //完成时间
            if('01'===this.form.coState){
                this.showCoHandleTm=true;
            }else{
                this.coHandleTm ='';
                this.form.coHandleTm ='';
                this.showCoHandleTm=false;
            }
        },
        //更新完成时间
        coHandleTmChange(value) {
            this.coHandleTm=value;
            this.checkData(this.coHandleTm);
        },
        //更新进度描述
        coProgressChange(value) {
            this.coProgress=value;
            this.checkData(this.coProgress);
        },
        //更新备注说明
        coRemarkChange(value) {
            this.coRemark=value;
            this.checkData(this.coRemark);
        },
        //空值校验
        checkData(value){
            if(''!==value && null!=value && typeof(value) != "undefined"){
                this.modifyFlag=true;
            }
        },
        //清空数据
        clearData(){
            this.modifyFlag=false;
            this.coVenuesId = '';
            this.coType ='';
            this.coColor ='';
            this.coOccurTm ='';
            this.coContent ='';
            this.coState ='';
            this.coHandleTm ='';
            this.coProgress ='';
            this.coRemark ='';
        },
    }
}
</script>

<style scoped>

</style>
