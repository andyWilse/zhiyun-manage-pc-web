<template>
  <div>
	<button @click="launch">发起</button>
	<button @click="report">上报</button>
	<button @click="approve">通过</button>
	<button @click="finish">已完成</button>
	<button @click="unFinish">未完成</button>

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
    methods:{
      launch () {
      this.$axios.get('/eventTask/launch', {
              params: {
              }
            }).then(successResponse => {
              if (successResponse.data === 200) {
              }else{
                this.$alert('新闻信息获取失败,请联系管理员！');
              }
            })
      },
      report () {
            this.$axios.get('/eventTask/report', {
                    params: {
                    }
                  }).then(successResponse => {
                    if (successResponse.data === 200) {
                    }else{
                      this.$alert('新闻信息获取失败,请联系管理员！');
                    }
                  })
            },
            approve () {
                  this.$axios.get('/eventTask/approve', {
                          params: {
                          }
                        }).then(successResponse => {
                          if (successResponse.data === 200) {
                          }else{
                            this.$alert('新闻信息获取失败,请联系管理员！');
                          }
                        })
                  },
                  unfinish () {
                    this.$axios.get('/eventTask/unFinish', {
                            params: {
                            }
                          }).then(successResponse => {
                            if (successResponse.data === 200) {
                            }else{
                              this.$alert('新闻信息获取失败,请联系管理员！');
                            }
                          })
                    },
                    finish () {
                      this.$axios.get('/eventTask/finish', {
                              params: {
                              }
                            }).then(successResponse => {
                              if (successResponse.data === 200) {
                              }else{
                                this.$alert('新闻信息获取失败,请联系管理员！');
                              }
                            })
                      },
    }
}
</script>

<style>

</style>