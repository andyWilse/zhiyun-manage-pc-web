<template>
	<div class="numClass">
		<div class="log_container">
			<div class="church" :class="[type == '01' && listIndex.includes(index) ? 'check' : '']" @click="qiehuan(index)" v-for="(item, index) in list" :key="index">
				<img class="church-icon" :src="item.icon" alt="" />
				<div class="name blackColor">
					{{ item.name }}
				</div>
				<span style="margin-left: 10px">{{ item.num }}</span>
			</div>
			<div class="church" :class="[type == '02' ? 'check' : '']" @click="checkType()">
				<img class="church-icon" src="/region/xiaqu.png" alt="" />
				<div class="name blackColor">
					我的辖区
				</div>
				<span style="margin-left: 5px">{{ myNum }}</span>
			</div>
		</div>
	</div>
</template>

<script>
	//import { getMapAllNum } from "@/service/api/home";
	import bus from "@/utils/bus";
	export default {
		name: "Log",
		data() {
			return {
				listIndex: [],
				myNum: 0,
				type: '01',
				list: [{
						id: 100100000001,
						icon: "/region/F.png",
						sign: "/region/F_sign.png",
						name: "佛教",
						num: 0,
					},
					{
						id: 100100000002,
						icon: "/region/D.png",
						sign: "/region/D_sign.png",
						name: "道教",
						num: 0,
					},
					{
						id: 100100000003,
						icon: "/region/J.png",
						sign: "/region/J_sign.png",
						name: "基督教",
						num: 0,
					},
					{
						id: 100100000004,
						icon: "/region/T.png",
						sign: "/region/T_sign.png",
						name: "天主教",
						num: 0,
					},
					// {
					// 	id: 100100000005,
					// 	icon: '/region/Y.png',
					// 	sign: '/region/Y_sign.png',
					// 	name: '伊斯兰教'
					//	num: 0,
					// },
				],
			};
		},
		created() {
			bus.$on("usermap", (value) => {
				console.log(value);
			});

			this.getAllNum('01');
			this.getAllNum('02');
			this.selectChurch();
		},
		methods: {
			/**
			 * 各类教堂数量
			 */
			getAllNum(type) {
                this.$axios.get('/venues/map/getVeNum',{
                   params: {
                     type:type,
                   }
                }).then(successResponse => {
                    if (successResponse.data.code === 200) {
                      let allNum=successResponse.data.result[0];
                      if(type == '01'){
                            this.list[0].num = allNum.Buddhism;
                            this.list[1].num = allNum.Taoism;
                            this.list[2].num = allNum.Christianity;
                            this.list[3].num = allNum.Catholicism;
                      }else{
                            this.myNum = allNum.total;
                      }

                    }else{

                    }
                })
			},
			/**
			 * 切换宗教
			 * @param {Object} index
			 */
			qiehuan(index) {
				this.type = '01';
				console.log('切换宗教-qiehuan' , index , this.listIndex);
				if (!this.listIndex.includes(index)) {
					this.listIndex.push(index);
				} else {
					let indexArr = [];
					this.listIndex.forEach((item) => {
						if (item != index) indexArr.push(item);
					});

					this.listIndex = indexArr;
				}

				this.selectChurch();
			},
			/**
			 * 我的辖区
			 */
			checkType(){
				this.type = '02';
				this.listIndex = [];
				this.selectChurch();
			},
			/**
			 * 通知
			 */
			selectChurch() {
				let list = [];
				this.listIndex.forEach((item) => {
					list.push(this.list[item]);
				});
				
				console.log('通知selectChurch' , list);

				bus.$emit("selectChurch", {list: list,type: this.type});
			},
		},
	};
</script>

<style scoped lang="less">
	.log_container {
		position: absolute;
		right: 0;
		top: 25vh;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-end;
		width: 160px;
	}

	.church {
		width: 150px;
		display: flex;
		background-color: #ffffff;
		padding: 7px 10px;
		margin-bottom: 10px;
		border-radius: 60px 0px 0px 60px;

		.church-icon {
			width: 20px;
			height: 20px;
			margin-right: 10px;
		}
	}

	.check {
		width: 120px;
		border-width: 1px;
		border-style: solid;
		border-color: #000;
		border-right: 0px;
		font-weight: 700;
		font-size: 14px;
	}
</style>
