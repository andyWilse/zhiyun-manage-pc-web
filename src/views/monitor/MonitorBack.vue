<template>
    <div>
        <div v-show="showFlag">
            <el-row>
                <el-col :span="5">
                    <el-date-picker v-model="value1" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-col>
                <el-col :span="5">
                    <el-button class="qclass" icon="el-icon-search" type="primary" @click="play">回放</el-button>
                </el-col>
            </el-row>
        </div>

        <div v-show="playFlag" style="">
            <video id="videoElement" controls autoplay muted width="300px" height="200px">
            </video>
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