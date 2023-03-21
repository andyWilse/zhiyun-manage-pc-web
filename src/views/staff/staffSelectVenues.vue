<template>
    <div>
        <div v-show="showFlag">
            <el-row>
                <el-col :span="5">

                </el-col>
                <el-col :span="5">
                    <el-button class="qclass" icon="el-icon-search" type="primary" @click="play">获取教职人员</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import flvJs from 'flv.js'

export default {
  data () {
    return {
        value1:'',
        flvPlayer:null,
        showFlag:true,
        playFlag:false,
    }
  },
    mounted() {
        this.getData();
        this.flvPlay();
    },
    methods:{
        //默认显示今天
        getData(){
            this.value1= new Date();
        },
        flvPlay(){
            var monitorUrl=this.$route.query.monitorUrl;
            var videoElement = document.getElementById('videoElement');
            this.flvPlayer = flvJs.createPlayer(
                {
                    type: 'flv',
                    isLive: true,
                    hasAudio: false,
                    fluid: true,
                    stashInitialSize: 128,// 减少首桢显示等待时长
                    url:monitorUrl
                },
                {
                    enableStashBuffer: false,
                    fixAudioTimestampGap:false,
                    isLive: true
                }
            );
            this.flvPlayer.attachMediaElement(videoElement);
            this.flvPlayer.load();
            this.flvPlayer.play();
        },
        play(){
            //this.showFlag=false;
            this.playFlag=true;
        },
    }
}
</script>

<style>
.qclass{
  background-color:#156AA8;
}
</style>