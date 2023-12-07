<template>
  <viewer :images="imgList" class="descimgBox">
    <img
      v-for="(decImg, index) in imgList"
      :key="index"
      :src="decImg.url"
      :style="{ 'object-fit': imgStyle, 'border-radius': borderRadius }"
    />
  </viewer>
</template>
<script>
export default {
  name: 'imageUtil',
  props: {
    options: {
      // 图片列表
      type: Array,
      required: true
    },
    imgStyle: {
      // 值有fill， contain， cover， scale-down,默认为contain
      type: String,
      default() {
        return 'contain'
      }
    },
    borderRadius: {
      // 图片的圆角效果
      type: String,
      default: '0px'
    }
  },
  data() {
    return {
      imgList: []
    }
  },
  created() {
    this.imgList = this.options //图片列表
  },
  methods: {}
}
</script>
<style scoped>
.descimgBox {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  align-items: baseline;
  /* align-items: flex-start; */
}
.descimgBox img {
  width: 90%;
  height: 80%;
  margin: 5px 1%;
  cursor: zoom-in;
}
</style>