<template>
    <div>
        <el-dialog title="三色要素详情：" :visible="dialogThreeColorDetail" :before-close="handleClose" width="50%">
            <el-form ref="form" :model="form" label-width="100px" :rules="formRules">
                <el-row>
                    <el-form-item label="问题描述:" prop="coContent">
                        <el-input v-model="form.coContent"
                          style="width: 80%"
                          readonly
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 10}">
                        </el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="进度描述:" prop="coProgress">
                        <el-input v-model="form.coProgress"
                          style="width: 80%"
                          readonly
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 10}">
                        </el-input>
                    </el-form-item>
                </el-row>
                 <el-row>
                    <el-form-item label="备注说明:" prop="coRemark">
                        <el-input v-model="form.coRemark"
                          style="width: 80%"
                          readonly
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 10}">
                        </el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel" type="warning">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: ['isactive', 'dialogThreeColorDetail', 'index_from_parent'],

    components: {

    },

    data () {
        return {
            message: '来自子组件的消息',
            form: {
                coContent:'',
                coProgress:'',
                coRemark:'',
            },
            formRules: {},
        }
    },

    mounted(){

    },

    methods: {
        //取消
        handleCancel () {
            this.$emit('three_detail');
        },
        //关闭
        handleClose (done) {
            this.$emit('three_detail');
            done();
        },

    }
}
</script>

<style scoped>

</style>
