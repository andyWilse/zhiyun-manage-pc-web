<template>
    <div class="numClass">
        <div class="switch_contain">
            <div class="switch">
                <el-switch
                       class="switch"
                       :inactive-value = 0
                       :active-value = 1
                       active-text="普通地图"
                       inactive-text="三色地图"
                       active-color="#1890ff"
                       inactive-color="#13ce66"
                       v-model= "value"
                       @change="changeSwitch"
                    />
                </el-switch>
            </div>
        </div>
		<div class="log_container" v-show="showChurch">
			<div class="church"
                :class="[type == '01' && listIndex.includes(index) ? 'check' : '']"
                @click="qiehuan(index)"
                v-for="(item, index) in list"
                :key="index">
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
		<div class="log_container" v-show="showColor" >
            <div class="church" :class="[colorType == '03' && colorListIndex.includes(index) ? 'check' : '']"
            @click="changeColor(index)" v-for="(item, index) in colorList" :key="index"
            style="background-color: #7FFFD4;">
                <img class="church-icon" :src="item.icon" alt="" />
                <div class="name blackColor">
                    {{ item.name }}
                </div>
                <span style="margin-left: 10px">{{ item.num }}</span>
            </div>
            <div class="church" :class="[colorType == '04' ? 'check' : '']" @click="changeColorType()" style="background-color:#7FFFD4;">
                <img class="church-icon" src="/region/xiaqu.png" alt="" />
                <div class="name blackColor">
                    我的辖区
                </div>
                <span style="margin-left: 5px">{{ myColorNum }}</span>
            </div>
        </div>
	</div>
</template>

<script>
	import bus from "@/utils/bus";
	export default {
		name: "Log",
		data() {
			return {
				listIndex: [],
				colorListIndex: [],
				myNum: 0,
				myColorNum: 0,
				type: '01',
				colorType: '03',
				list: [{
						id: 100100000001,
						icon: "/region/foJiao.png",
						sign: "/region/foJiao.png",
						name: "佛教",
						num: 0,
					},
					{
						id: 100100000002,
						icon: "/region/daoJiao.png",
						sign: "/region/daoJiao.png",
						name: "道教",
						num: 0,
					},
					{
						id: 100100000003,
						icon: "/region/jiDu.png",
						sign: "/region/jiDu.png",
						name: "基督教",
						num: 0,
					},
					{
						id: 100100000004,
						icon: "/region/tianZhu.png",
						sign: "/region/tianZhu.png",
						name: "天主教",
						num: 0,
					},
					// {
					// 	id: 100100000005,
					// 	icon: '/region/yiSiLan.png',
					// 	sign: '/region/yiSiLan.png',
					// 	name: '伊斯兰教'
					//	num: 0,
					// },
				],
				showChurch:true,
				showColor:false,
				value:1,
				colorList: [
                    {   id: 500101,
                        icon: "/region/color/red.png",
                        sign: "/region/color/red.png",
                        name: "红色",
                        num: 0,
                    },
                    {   id: 500102,
                        icon: "/region/color/yellow.png",
                        sign: "/region/color/yellow.png",
                        name: "黄色",
                        num: 0,
                    },
                    {   id: 500103,
                        icon: "/region/color/green.png",
                        sign: "/region/color/green.png",
                        name: "绿色",
                        num: 0,
                    },

				],
			};
		},
		created() {
			bus.$on("usermap", (value) => {
				console.log(value);
			});

			//this.getAllNum('01');
			this.getAllNum();
			this.getChurchList();
		},
		methods: {
			/**
			 * 各类教堂数量
			 */
			getAllNum() {
                this.$axios.get('/venues/map/getVeNum').then(successResponse => {
                    let data=successResponse.data
                    if (data.code === 200) {
                        let result=data.result[0];

                        let allReligiousNum = result.allReligiousNum;
                        if(null!==allReligiousNum){
                            this.list[0].num = allReligiousNum.Buddhism;
                            this.list[1].num = allReligiousNum.Taoism;
                            this.list[2].num = allReligiousNum.Christianity;
                            this.list[3].num = allReligiousNum.Catholicism;
                        }

                        let myReligiousNum = result.myReligiousNum;
                        if(null!==myReligiousNum){
                            this.myNum = myReligiousNum.total;
                        }

                        let allColorNum = result.allColorNum;
                        if(null!==allColorNum){
                            this.colorList[0].num = allColorNum.red;
                            this.colorList[1].num = allColorNum.yellow;
                            this.colorList[2].num = allColorNum.green;
                        }

                        let myColorNum = result.myColorNum;
                        if(null!==myColorNum){
                            this.myColorNum = myColorNum.total;
                        }
                    }
                })
			},
			/**
			 * 切换宗教
			 * @param {Object} index
			 */
			qiehuan(index) {
				this.type = '01';
				if (!this.listIndex.includes(index)) {
					this.listIndex.push(index);
				} else {
					let indexArr = [];
					this.listIndex.forEach((item) => {
						if (item != index) indexArr.push(item);
					});

					this.listIndex = indexArr;
				}

				this.getChurchList();
			},
			/**
			 * 我的辖区
			 */
			checkType(){
				this.type = '02';
				this.listIndex = [];
				this.getChurchList();
			},
			/**
			 * 通知
			 */
			getChurchList() {
				let list = [];
				this.listIndex.forEach((item) => {
					list.push(this.list[item]);
				});
				bus.$emit("selectChurch", {list: list,type: this.type});
			},
            //地图切换
			changeSwitch (status) {
                  if(1==status){
                      this.showChurch=true;
                      this.showColor=false;
                      this.getChurchList();
                  }else if(0==status){
                      this.showChurch=false;
                      this.showColor=true;
                      this.selectColor();
                  }
            },

            //三色要素
            changeColorType(){
                this.colorType = '04';
                this.colorListIndex = [];
                this.selectColor();
            },

            changeColor(index){
                this.colorType = '03';
                if (!this.colorListIndex.includes(index)) {
                    this.colorListIndex.push(index);
                } else {
                    let indexArr = [];
                    this.colorListIndex.forEach((item) => {
                        if (item != index) indexArr.push(item);
                    });

                    this.colorListIndex = indexArr;
                }
                this.selectColor();
            },

            /**
             * 三色要素通知
             */
            selectColor() {
                let listColor = [];
                this.colorListIndex.forEach((item) => {
                    listColor.push(this.colorList[item]);
                });
                bus.$emit("selectChurch", {list: listColor,type: this.colorType});
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
		width: 100px;
		margin:30px;
	}

	.church {
		width: 180px;
		display: flex;
		background-color: #87CEEB;
		padding: 7px 10px;
		margin-bottom: 10px;
		border-radius: 60px 60px 60px 60px;

		.church-icon {
			width: 20px;
			height: 20px;
			margin-right: 10px;
		}
	}

	.check {
		width: 180px;
		border-width: 2px;
		border-style: solid;
		border-color: #000;
		border-right: 0px;
		font-weight: 700;
		font-size: 14px;
	}

	.switch_contain {
    		position: absolute;
            right: 0;
            top: 17vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-end;
            width: 200px;
            height: 50px;
            margin:30px;
    }

    .switch {
    		width: 185;
    		//display: flex;
    		background-color: lightblue;
    		padding: 8px 5px 7px 6px;
    		margin-bottom: 6px;
    		border-radius: 60px 60px 60px 60px;

    	}



</style>
