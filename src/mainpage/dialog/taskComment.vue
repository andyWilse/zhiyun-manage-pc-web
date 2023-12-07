<template>
<!--1.首先，弹窗页面中要有el-dialog组件即弹窗组件，我们把弹窗中的内容放在el-dialog组件中-->
<!--2.设置:visible.sync属性，动态绑定一个布尔值，通过这个属性来控制弹窗是否弹出-->
  <el-dialog title="任务详情" :visible="detailVisible" :before-close="handleClose" width="65%">
  <div>
  <div  class="baseClass">
     <el-row :gutter="25">
            <el-col :span="4.8">
             <el-input v-model="newsId">jjjj</el-input>
            </el-col>

     </el-row>


 </div>
 <div style="margin-top:10px;">
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
       </div>

          </div>
  </el-dialog>
</template>

<script>
    export default {
        name: "taskComment",
        props: ['isactive', 'detailVisible', 'index_from_parent'],
        data(){
          return{
            tableData:[],
            newsId:1002,
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
<style>


	.baseClass {
		background: #faf1ed;
		border: 1px solid #9b2e25;
		border-radius: 10px;
		padding: 0px 15px;
		margin-top: 20px;

		.top {
			padding: 10px 0px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px dashed #9b2e25;

			.right {
				.btn {
					border: 1px solid #9b2e25;
					background-color: #fcefee;
					padding: 2px 10px;
					border-radius: 20px;
				}

				.info {
					border-color: #135097;
					background-color: #e9f2f8;
				}

				.danger {
					border-color: #9a7a19;
					background-color: #faf1ed;
				}
			}
		}

	}
</style>