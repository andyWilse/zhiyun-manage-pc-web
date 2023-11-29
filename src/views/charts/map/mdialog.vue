<template>
<transition class="tran-class" name="dialog">
	<div
		v-if="showDialog"
		id="dialog-bg"
		@touchmove.prevent
		@scroll.prevent >
		<div id="dialog" >
            <div class="title-left">

                <div style="border:none;margin-left:10px;">
                    <el-button class="dialog-button" @click="close" >关闭</el-button>
                    <div class="titlt-left-top" style="display: flex;">
                        <div style="font-weight:700;font-size:25px;text-align:center;margin-right: 10px;">
                            {{ data.venuesName }}
                        </div>
                        <div class="text-one">
                            <img class="church-icon" src="@/assets/region/T.png" alt width="15px" />
                            {{ data.reSectNm }}
                        </div>
                    </div>
                    <div class="text-two">所属机构：{{ data.organization }}</div>
                    <div class="text-two">场所地址： {{ data.venuesAddres }}</div>
                </div>
                <div style="margin-top:20px;">
                     <el-collapse v-model="activeNames" style="border:none;margin-left:10px;">
                          <el-collapse-item name="1">
                              <template slot="title">
                                <p class="title">基本信息</p>
                              </template>
                              <div class="rows">
                                <div class="block-line-left">所属机构：{{ data.organization }}</div>
                                <div class="block-line-left">登记证号：{{ data.registerNbr }}</div>
                                <div class="block-line-left">负责人：{{ data.oneDirector.name }} {{ data.oneDirector.phone }} </div>
                                <div class="block-line-left">场所电话：{{ data.venuesPhone }}</div>
                              </div>
                          </el-collapse-item>
                          <el-collapse-item name="2">
                              <template slot="title">
                                <p class="title">关联活动</p>
                              </template>
                              <div class="block-line" v-for="(activity, index) in data.joinActivity" :key="index">
                                    <div class="block-line-left">
                                        备案{{ index + 1 }}：{{ activity }}
                                    </div>
                                    <div class="block-line-right"></div>
                                </div>
                          </el-collapse-item>
                          <el-collapse-item name="3">
                              <template slot="title">
                                <p class="title">教职人员</p>
                              </template>
                              <div class="block-line-left">{{ data.veStaffStr }}</div>
                          </el-collapse-item>

                          <el-collapse-item name="4">
                              <template slot="title">
                                <p class="title">三人驻堂</p>
                              </template>
                              <div class="block-line" v-for="(item, index) in data.garrison" :key="index">
                                    <div class="block-line-left">
                                        {{ item.type == "10000006" ? "组长" : "组员" }}：{{ item.name }}
                                    </div>
                              </div>
                          </el-collapse-item>

                     </el-collapse>
                </div>

                <div style="margin-bottom:50px;bottom:0px">

                </div>
            </div>
		</div>
	</div>
</transition>
</template>

<script>

	export default{

		props:{
			showDialog: Boolean,
			title: String,
		},
		data () {

            return {
              message: '来自子组件的消息',
              data:[],
              activeNames: ['1'],
            }

        },
        created(){
            this.initTableData();
        },

		methods: {
            initTableData(){
               this.$axios.get('/venues/map/venuesDetail', {
                    params: {
                      venuesId: '10000001',
                    }
               }).then(successResponse => {
                    if (successResponse.data.code === 200) {
                      this.data=successResponse.data.result;
                    }else{
                          let message=successResponse.data.message;
                          if(''!=message && null!=message){
                            this.$message({message: message,type: 'warning'});
                          }else{
                            this.$message({message: '用户信息获取失败，请联系管理员！',type: 'error'});
                          }
                    }
               })
            },


			close: function(){
				this.$emit("closeDialog");
			}
		},

		watch:{

		}

	}
</script>

<style >
	* {
		box-sizing: border-box;
	}

	#dialog-bg{
		top: 0;
		left: 0;
		position: fixed;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0,0,0,0.5);
		z-index: 98;
	}

	#dialog{
		border-radius: 20px 20px 0 0;
		position: fixed;
		bottom: 0;
		background-color: #FFFFFF;
		width: 100vw;
		padding: 15px;
		padding-bottom: 25px;
	}

	/* 适配电脑等大屏幕 */
	@media (min-width: 750px) {
		#dialog{
			width: 60%;
			left:13%;
			right:0;
			margin:0 auto;
		}
	}

	.dialog-button{
	    position: relative;
		width: 5%;
		left:90%;
		background-color: #6367D5;
		border-width: 0;
		border-radius: 360px;
		padding: 5px;
		outline: none;
		color: white;
		margin-bottom: 0px;
	}

	.dialog-button:focus {
		outline: none;
	}

	.dialog-button:active{
		background-color: #585dbe;
		border-color: #585dbe;
	}


	.dialog-enter-active, .dialog-leave-active {
	  transition: all .5s ease;
	}

	.dialog-enter, .dialog-leave-to {
	  opacity: 0;
	  transform: translateY(300px);
	}

	.firstLogo {
      vertical-align: middle;
      padding: 10px 20px 0 150px;
      margin-top: 5px;
    }

.tran-class{
position: absolute;
}

.titlt-left-top {
    display: flex;
    align-items: center;

    .title-type {
        display: flex;
        align-items: center;
        margin-left: 10px;

        .van-image {
            margin-right: 5px;
        }
    }
}


.text-one{
    font-size:12px;
    text-align:center;
    margin-right: 6px;
}

.text-two{
    font-size:12px;
}

.title {
  font-size: 15px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #303133;
  padding-bottom: 17px;
  padding-top: 17px;
}
::v-deep .el-collapse-item__header.is-active {
  border-bottom: 1px dashed  #c8c8c8;
}
::v-deep .el-collapse-item__wrap {
  border: none;
}
p {
  margin: 0;
  padding: 0;
}



</style>

