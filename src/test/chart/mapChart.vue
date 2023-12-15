<template>
    <div class="mapChartClass" style="position: absolute;">
          <div class="search-fo" style="position: absolute; z-index: 30;bottom:250px;width: 100px;">
               <el-button  round icon="el-icon-fo" @click="searchByHand" style="width: 100px;left:0;padding: 8px;text-align: left;">
                    <span>佛教</span>
               </el-button>
          </div>
          <div class="search-dao" style="position: absolute; z-index: 30;bottom:210px;">
               <el-button  round icon="el-icon-dao" @click="searchByHand" style="width: 100px;left:0;padding: 8px;text-align: left;">
                    <span>道教</span>
               </el-button>
          </div>
          <div class="search-ji" style="position: absolute; z-index: 30;bottom:170px;">
               <el-button  round icon="el-icon-ji" @click="searchByHand" style="width: 100px;left:0;padding: 8px;text-align: left;">
                    <span>基督教</span>
               </el-button>
          </div>
          <div class="search-tian" style="position: absolute; z-index: 30;bottom:130px;">
              <el-button  round icon="el-icon-tian" @click="searchByHand" style="width: 100px;left:0;padding: 8px;text-align: left;">
                    <span>天主教</span>
              </el-button>
          </div>
          <div class="search-me" style="position: absolute; z-index: 30;bottom:90px;">
              <el-button  round icon="el-icon-me" @click="searchByHand" style="width: 100px;left:0;padding: 8px;text-align: left;">
                    <span>我的辖区</span>
              </el-button>
          </div>
          <el-amap
                ref="map"
                :vid="'amapDemo'"
                :center="center"
                :zoom="zoom"
                :plugin="plugin"
                :events="events"
                class="amap-demo"
                style="height: 600px;left: 0px;right: 0px;position: absolute;bottom:10px;">
               <el-amap-marker v-for="(u,i) in markers" :position="u.position" :key="i" :icon="u.icon">
               </el-amap-marker>
            </el-amap>
            </div>
     </div>
</template>

<script>
 export default {
        name: 'index',
        data() {
            return {
            };
        },
        created(){
                this.initTableData();
        },
        methods: {
        searchByHand(){},
            initTableData(){
                this.$axios.get('/venues/map/mapVenues',
                 {
                   params: {
                     search: this.search,
                     religiousSect: this.religiousSect,
                     type:this.type,
                   }
                 }
                ).then(successResponse => {
                        if (successResponse.data.code === 200) {
                          let arr=successResponse.data.result;
                          this.markers=arr;
                            for (var i = 0; i < arr.length; i++) {
                               //var item = arr[i];
                               //item.put("icon",'require("../../assets/region/foJiao.png")');
                               let position=[120.68309, 27.974069];
                               let icon="../../assets/region/foJiao.png";
                        let marker = new AMap.Marker({
							position: position, // 基点位置
							// position: [item.longitude , item.Latitude], // 基点位置
							// zooms: [14, 20],
							styles: [{
								icon: {
									img: icon,
									size: [30, 36], //可见区域的大小
									anchor: "bottom-center", //锚点
									fitZoom: 14, //最合适的级别
									scaleFactor: 2, //地图放大一级的缩放比例系数
									maxScale: 1.4, //最大放大比例
									minScale: 0.8, //最小放大比例
								},
							}, ],
							extData: {
								//id: item.venuesId,
								icon: icon,
								//name: item.religiousSectCn,
								position: position,
							},
							//zoomStyleMapping: zoomStyleMapping,
						});
                               //this.markers.push([pois[0].lng,pois[0].lat])
                            }

                        }else{
                          let message=successResponse.data.message;
                          this.$message({message: message,type: 'warning'});
                        }
                      })

            },
        },
    }
</script>

<style>
/* 图标大小修改 */
.amap-icon img {
    max-width: 2rem !important;
    max-height: 2rem !important;
}


.mapChartClass {
  position: absolute;
  left: 25%;
  /* 内部框框距离 */
  top: 0px;
  padding: 10px;
  right: 0px;
  overflow-y: auto;
  bottom: 0px;
  /* background-color: rebeccapurple; */
}


.el-icon-fo{
    background: url('~@/assets/region/foJiao.png') center no-repeat;
    background-size: cover;
    font-size: 19px;
}
.el-icon-fo:before{
    content: "替";
    font-size: 19px;
    visibility: hidden;
}
.el-icon-dao{
    background: url('~@/assets/region/daoJiao.png') center no-repeat;
    background-size: cover;
    font-size: 19px;
}
.el-icon-dao:before{
    content: "替";
    font-size: 19px;
    visibility: hidden;
}
.el-icon-tian{
    background: url('~@/assets/region/tianZhu.png') center no-repeat;
    background-size: cover;
    font-size: 19px;
}
.el-icon-tian:before{
    content: "替";
    font-size: 19px;
    visibility: hidden;
}
.el-icon-ji{
    background: url('~@/assets/region/jiDu.png') center no-repeat;
    background-size: cover;
    font-size: 19px;
}
.el-icon-ji:before{
    content: "替";
    font-size: 19px;
    visibility: hidden;
}
.el-icon-me{
    background: url('~@/assets/region/xiaqu.png') center no-repeat;
    background-size: cover;
    font-size: 19px;
}
.el-icon-me:before{
    content: "替";
    font-size: 19px;
    visibility: hidden;
}


</style>