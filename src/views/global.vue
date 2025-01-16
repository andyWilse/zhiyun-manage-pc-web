<template>

</template>

<script type="text/javascript">
  // 定义一些公共的属性和方法
  //const baseUrl ='https://zszjadmin.860577.net:8088/api';
  const baseUrl ='http://183.246.59.33:7081/api';
//const baseUrl ='http://localhost:7081/api';

  const httpUrl =baseUrl+ '/file/images/upload';
  const httpVideoUrl = baseUrl+'/file/uploadVideo';
  const imageUrlPc =baseUrl+ '/file/pc/imagesUpload';


  // 暴露出这些属性
  export default {
    httpUrl,
    imageUrlPc,
    httpVideoUrl,
  }

</script>
