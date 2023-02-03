<template>
  <div style="display: none;">
	<video id="videoElement" controls autoplay muted width="300px" height="200px">
    </video>
	//<button @click="play">播放</button>
  </div>
</template>
<script>
import flvjs from 'flv.js'
export default {
  data () {
    return {
	  flvPlayer:null
    }
  },
   mounted() {
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        this.flvPlayer = flvjs.createPlayer({
          type: 'flv',
		  isLive: true,
		  hasAudio: false,
		  fluid: true,
                        stashInitialSize: 128,// 减少首桢显示等待时长
          url: 'https://39.174.193.59:30084/live/33030400002000200826_33030400001310439922.live.flv?auth_key=1706955512-126c5cf2db48535f80877e4d95a34af8-466f5118c84042038889a0186a0270e147167bc40705ed1ee2f429a75c2cd1302962ae182b96e027ae8bccded461aa10585047eb4fccd0260963a96cc58f0a8c'
          //url: 'https://prod-streaming-video-msn-com.akamaized.net/6ea6a8be-4bdb-498c-a34a-6ce0b3c5fe81/06096b63-be6b-4ccc-a7d5-d6b488be6974.mp4'

        },{
                        enableStashBuffer: false,
                        fixAudioTimestampGap:false,
                        isLive: true
                  });
        this.flvPlayer.attachMediaElement(videoElement);
        this.flvPlayer.load();
		this.flvPlayer.play();
      }
    },
    methods:{
      play () {
        this.flvPlayer.play();
      }
    }
}
</script>

<style>

</style>