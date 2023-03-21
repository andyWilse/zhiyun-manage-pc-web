<template>
  <div>
	<video id="videoElement" controls autoplay muted width="300px" height="200px">
    </video>
  </div>
</template>
<script>
import flvJs from 'flv.js'
export default {
  data () {
    return {
	  flvPlayer:null,
    }
  },
   mounted() {
        if (flvJs.isSupported()) {
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
        }
    },
    methods:{

    }
}
</script>

<style>

</style>