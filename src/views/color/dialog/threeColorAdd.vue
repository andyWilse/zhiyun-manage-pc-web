<template>
    <div>
        <el-dialog title="三色要素信息新增：" :visible="dialogThreeColorAdd" :before-close="handleClose" width="50%">
            <el-form ref="form" :model="form" label-width="" label-position="right" :rules="formRules" style="border:1px solid #C4E1C5;padding:20px;">
                       <el-form-item label="场所名称" prop="coVenuesId" label-width="">
                           <el-select v-model="form.coVenuesId"
                           @focus="venuesSelect"
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
                       <el-form-item label="要素类型:" prop="coType">
                          <el-select v-model="form.coType"  @focus="getTypeList" clearable>
                            <el-option
                                v-for="item in typeData"
                                :key="item.dictCd"
                                :label="item.dictCnDesc"
                                :value="item.dictCd"
                            />
                          </el-select>
                      </el-form-item>
                        <el-form-item label="要素颜色:" prop="coColor">
                             <el-select v-model="form.coColor"  @focus="getColorList" clearable>
                                   <el-option
                                       v-for="item in colorData"
                                       :key="item.dictCd"
                                       :label="item.dictCnDesc"
                                       :value="item.dictCd"
                                   />
                             </el-select>
                        </el-form-item>
                        <el-form-item label="发生时间:"  prop="coOccurTm">
                           <el-date-picker v-model="form.coOccurTm" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                           </el-date-picker>
                        </el-form-item>
                        <el-row>
                            <el-form-item label="问题描述:" prop="coContent">
                                <el-input v-model="form.coContent"
                                  style="width: 280%"
                                  placeholder="请填写"
                                  type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 10}">
                                </el-input>
                            </el-form-item>
                        </el-row>
                         <el-form-item label="处理进度:" prop="coState">
                             <el-select v-model="form.coState"  @focus="getCoStateList" @change="changeCoState" clearable>
                                   <el-option
                                       v-for="item in StateData"
                                       :key="item.dictCd"
                                       :label="item.dictCnDesc"
                                       :value="item.dictCd"
                                   />
                             </el-select>
                        </el-form-item>
                        <el-form-item label="完成时间:"  prop="coHandleTm" v-if="showCoHandleTm" >
                           <el-date-picker v-model="form.coHandleTm" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
                           </el-date-picker>
                        </el-form-item>
                        <el-row>
                            <el-form-item label="进度描述:" prop="coProgress">
                                <el-input v-model="form.coProgress"
                                  style="width: 280%"
                                  placeholder="请填写"
                                  type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 10}">
                                </el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item label="备注说明:" prop="coRemark">
                                <el-input v-model="form.coRemark"
                                  style="width: 280%"
                                  placeholder="请填写"
                                  type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 10}">
                                </el-input>
                            </el-form-item>
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
    props: ['isactive', 'dialogThreeColorAdd', 'index_from_parent'],

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
            form: {
                coVenuesId: '',
                coType:'',
                coColor:'',
                coOccurTm:null,
                coContent:'',
                coState:'',
                coHandleTm:'',
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
//this.getVenuesList();
     },
    methods: {
        //保存
        handleSave () {
            //this.form.venuesName=this.$refs.venuesRef.selected.label;
            if('01'===this.form.coState){
               let coHandleTm= this.form.coHandleTm;
               if(''===coHandleTm || null===coHandleTm || undefined ===coHandleTm){
                    this.$alert('完成时间不能为空，请填写后提交！');
                    return;
               }
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                  this.handleSubmitPost();
                }else{
                  this.$alert('填写信息有误，请重新填写后提交！');
                }
            });
        },
        //提交
        handleSubmitPost(){
              this.$axios.post('/color/add', {
                    coVenuesId: this.$refs.venuesRef.selected.value,
                    coType:this.form.coType,
                    coColor:this.form.coColor,
                    coOccurTm: new Date(this.form.coOccurTm),
                    coContent:this.form.coContent,
                    coState:this.form.coState,
                    coHandleTm:new Date(this.form.coHandleTm),
                    coProgress:this.form.coProgress,
                    coRemark:this.form.coRemark
              }).then(successResponse => {
                    let code=successResponse.data.code;
                    let message=successResponse.data.message;
                    if (code === 200) {
                        this.$message({message: message, type: 'success'});
                        this.$emit('three_add');
                        this.form={};
                    }else{
                        this.$message({message: message,type: "error"});
                    }
              })
            },
        //取消
        handleCancel () {
            this.form={};
            this.$emit('three_add');
        },
        //关闭
        handleClose (done) {
            this.form={};
            this.$emit('three_add');
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
        //完成时间
        changeCoState(){
            if('01'===this.form.coState){
                this.showCoHandleTm=true;
            }else{
                this.showCoHandleTm=false;
                this.form.coHandleTm ='';
            }
        },

    }
}
</script>

<style scoped>

</style>
