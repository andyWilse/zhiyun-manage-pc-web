<template>
<!--1.首先，弹窗页面中要有el-dialog组件即弹窗组件，我们把弹窗中的内容放在el-dialog组件中-->
<!--2.设置:visible.sync属性，动态绑定一个布尔值，通过这个属性来控制弹窗是否弹出-->
  <el-dialog title="流转意见" :visible="detailVisible" :before-close="handleClose" width="65%">
    <el-table
            :data="tableData"
            border
            stripe
            style="width: 100%">

          <el-table-column
              prop="handlePerson"
              label="处理人"
              align="left">
          </el-table-column>

            <el-table-column
                prop="handleTime"
                label="处理时间"
                align="left">
            </el-table-column>

            <el-table-column
                prop="feedBack"
                label="意见"
                align="left">
            </el-table-column>
        </el-table>
  </el-dialog>
</template>

<script>
    export default {
        name: "taskComment",
        props: ['isactive', 'detailVisible', 'index_from_parent'],
        data(){
          return{
            tableData:[],
          }
        },
      methods:{
      //3.定义一个init函数，通过设置detailVisible值为true来让弹窗弹出，这个函数会在父组件的方法中被调用
        getComment(data){
          console.log(data);
            this.$axios.get('/task/app/getTaskDetail', {
                  params: {
                    procInstId:data,
                  }
                }).then(successResponse => {
                  if (successResponse.data.code === 200) {
                    this.tableData=successResponse.data.result[0].taskComment;
                  }else{
                    this.$alert('任务信息获取失败,请联系管理员！');
                  }
                })
        },
        handleClose (done) {
             this.$emit('cActive_comment'); // 如果确认,就取消弹窗,
             done();
            },
      }
    }
</script>
