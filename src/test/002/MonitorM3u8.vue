<template>
  <div>
	<video id="singleVideo" autoplay controls muted="muted" width=1200 height=500 ></video>
  </div>
</template>
<script>
import videoJs from 'video.js';
export default {
  data () {
    return {
    }
  },
  mounted() {
        var monitorUrl=this.$route.query.monitorUrl;
        this.singlePlayer = videoJs("singleVideo", {
            autoplay: true,
            controls: true,
        });
        let res = monitorUrl;
        if(res){
            this.singlePlayer.src({ src: res, type: "application/x-mpegURL" });
            this.singlePlayer.play();
        }
    },
    methods:{

    }
}
</script>

<style>

</style>