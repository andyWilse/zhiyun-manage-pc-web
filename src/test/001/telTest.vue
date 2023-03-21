<template slot-scope="scope">
  		<p class="telNum" @click="callPhone(phoneNum)">18514260203</p>
</template>


<script>

  export default {
    data() {
      return {
        dataForm: {
          id: 0,
          noticeId: '',
          attachName: '',
          attachUrl: '',
        },

      }
    },
    methods:{
          callPhone (phoneNum) {
          phoneNum=18514260203
            window.location.href = 'tel://' + phoneNum
          }
      }
  }
</script>

