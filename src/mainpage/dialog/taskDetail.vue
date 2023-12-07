<template>
	<div class="page padding15">
		<div class="head">
			<div class="title weight900 blackColor" :class="uiStyle + '_fontSize14'">我的任务</div>
			<div class="btns">
			</div>
		</div>
		<!-- 任务 -->
		<div class="task">
			<div class="top">
				<div class="left blackColor weight700" :class="uiStyle + '_fontSize14'">{{ data.taskName || '' }}</div>
				<div class="right">
					<div v-if="data.emeLevel == '01'" class="btn weight700 redColor1">{{ data.emeLevelCn || '' }}</div>
					<div v-else-if="data.emeLevel == '02'" class="btn danger weight700 yellowColor1">
						{{ data.emeLevelCn || '' }}
					</div>
					<div v-else-if="data.emeLevel == '03'" class="btn info weight700 blueColor1">
						{{ data.emeLevelCn || '' }}
					</div>
				</div>
			</div>
			<div class="bottom hasColor1">
				<div class="bottom-line" >
					场所名称：<span class="blackColor1">{{ data.venuesName || '所有场所' }}</span>
				</div>
				<!--<div class="bottom-line" :class="uiStyle + '_fontSize12'" v-if="areaListName">
					管辖街道：<span class="blackColor1">{{ areaListName }}</span>
				</div>-->
				<div class="bottom-line" :class="uiStyle + '_fontSize12'" v-if="data.hasOwnProperty('venuesAddres')">
					场所地址：<span class="blackColor1">{{ data.venuesAddres }}</span>
				</div>
				<div class="bottom-line" :class="uiStyle + '_fontSize12'" v-if="data.flowType != '05' && data.flowType != '07'">
					截止时间：<span class="blackColor1">{{ data.endTime }}</span>
				</div>
				<div class="bottom-line" :class="uiStyle + '_fontSize12'">
					发起者：<span class="blackColor1">{{ data.flowType == '05' || data.flowType == '07' ? data.launchMobil : data.launchPerson }}</span>
				</div>
				<div class="bottom-line" :class="uiStyle + '_fontSize12'">
					发起时间：<span class="blackColor1">{{ data.taskTime || '' }}</span>
				</div>
				<div class="bottom-line" :class="uiStyle + '_fontSize12'" v-if="data.reportMen">
					预警确认人：<span class="blackColor1">{{ data.reportMen || '' }}</span>
				</div>
				<div class="bottom-line" >
					任务描述：<span class="blackColor1">{{ data.taskContent || '' }}</span>
				</div>
			</div>
		</div>
		<div class="steps marginTop10" v-if="data.taskComment">
		    <el-steps :active="99999" finish-status="process" direction="vertical" :space="90" align-center>
               <el-step  v-for="(item , index) in data.taskComment" :id="index" class="stepClass">
                    <template slot="description" >
	                    <div class="contentClass" :style="{color: data.handleResults == '1' ? '#282828' : ''}">
                            <h3 :class="uiStyle + '_fontSize14'" v-if="item.sendNames" class="oneClass">推送：{{ item.sendNames }}</h3>
                            <h3 :class="uiStyle + '_fontSize14'" v-if="item.handlePerson" class="oneClass">
                                {{ index == 0 ? '发起：' : (index == data.taskComment.length - 1 ? '处置人：' : '上报：') }}{{ item.handlePerson }}
                            </h3>
                            <p :class="uiStyle + '_fontSize12'" v-if="item.handleTime">{{ item.handleTime }}</span></p>
                            <p :class="uiStyle + '_fontSize12'" v-if="item.sendTime">{{ item.sendTime }}</span></p>
                            <p :class="uiStyle + '_fontSize12'" v-if="item.hasOwnProperty('feedBack') && item.feedBack">{{ item.feedBack }}</p>
                            <div v-if="item.picture !==undefined && item.picture != null  && item.picture.length > 0">
                                <VViewer
                                    :options="item.picture"
                                    :imgStyle="'cover'"
                                    :border-radius="'8px'"
                                    :style="'width: 140px; height: 70px' ">
                                </VViewer>
                            </div>
                       </div>
                   </template>
               </el-step>
            </el-steps>
		</div>
	</div>
</template>

<script>
import VViewer from './imageUtil';
	export default {
	    components: { VViewer },
		data() {
			return {
				id: 0,
				procInstId: '',
				data: {},
				areaListName: '',
				uiStyle: localStorage.getItem('uiStyle') || 'normal',
				active: 0,
			};
		},
		created() {
			this.getTaskDetail();
		},
		methods: {
			/**
			 * 任务详情
			 */
			getTaskDetail() {

			    let id=this.$route.query.procInstId;
                this.$axios.get('/task/app/getTaskDetail', {
                      params: {
                        procInstId:id,
                      }
                    }).then(successResponse => {
                      if (successResponse.data.code === 200) {
                      this.data=successResponse.data.result[0];
                        this.tableData=successResponse.data.result[0].taskComment;
                      }else{
                        this.$alert('任务信息获取失败,请联系管理员！');
                      }
                    })
			},

			 aaa(item) {

                  var viewer = new Viewer(document.getElementById(item.url), {

                      url: item.url,

               });
            },
        }
	}
</script>

<style scoped lang="less">
	::v-deep [class*=van-hairline]::after{
		border: none;
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.btns{
			display: flex;
			.btn {
				width: 60px;
				height: 25px;
				line-height: 25px;
				background: #9b2e25;
				border-radius: 10px;
				text-align: center;
			}
		}
	}

	.title {
		position: relative;
		padding-left: 10px;
		padding-top: 0px;
	}

	.title::before {
		width: 2px;
		height: 13px;
		content: "";
		background-color: #9b2e25;
		position: absolute;
		left: 0px;
		top: 5px;
	}

	.task {
		background: #faf1ed;
		border: 1px solid #9b2e25;
		border-radius: 10px;
		padding: 0px 15px;
		margin-top: 0px;
        margin-bottom:20px;

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
					font-size: 13px;
					font-weight:bold;
                    color:#9b2e25;
				}

				.info {
					border-color: #135097;
					background-color: #e9f2f8;
					font-size: 13px;
                    font-weight:bold;
                    color:#135097;
				}

				.danger {
					border-color: #9a7a19;
					background-color: #faf1ed;
					font-size: 13px;
                    font-weight:bold;
                    color:#9a7a19;

				}
			}
		}

		.bottom {
			// display: flex;
			// align-items: center;
			// justify-content: space-between;
			padding: 10px 0px;
		}
	}

	.form {
		.block {
			background: #ffffff;
			border: 1px solid #e2e2e2;
			border-radius: 10px;
			margin-top: 15px;
			padding: 10px 25px;

			.block-title {
				border-bottom: 1px solid #e2e2e2;
				padding-bottom: 10px;
			}

			.textarea {
				border: none;
				width: 100%;
				height: 100px;
				padding: 10px 0px;
			}
		}

		.block-line {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.submit {
			width: 80vw;
			height: 40px;
			line-height: 40px;
			margin: 10px auto 60px;
			background: #9b2e25;
			border-radius: 10px;
			text-align: center;
		}
	}

	.left{
	    font-weight: 700;
	}

	.blackColor1{
	    font-size: 13px;
	    color:black;
	}

	.bottom-line{
	    font-size: 13px;
	    color:grey;
        //transform: scale(0.8); // 将字体缩小80% 也就是9.6px;如果想设置更小 可以修改scale中的数值
	}

    .contentClass{
        //min-width:500px;
        //margin-bottom:12px;
        //margin-top:12px;
        //background-color: #D9E5F9;
    }
    .stepClass{
        //top:0px;
    }

    ::v-deep .el-step{
        .el-step__title{
          //position: absolute;
          //margin-top: 0px;
          //left: 0px;
        }
    }

    .oneClass{
        margin-top: 0px;
    }
</style>
