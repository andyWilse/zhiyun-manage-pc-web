const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  //productionSourceMap:false,  // 设置上线后是否加载webpack文件
  lintOnSave:false,
  devServer: {
    host: '0.0.0.0',
    //open: true, // 自动打开浏览器
    // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
    // 例如将'localhost:8080/api/xxx'代理到'www.example.com/api/xxx'
    proxy: {
      // 反向代理端口地址及端口为 http://localhost:8080
     /* proxy: 'http://localhost:8080',
      port: 8092*/
      //192.168.1.15
      '/api': { // 匹配所有以 '/api'开头的请求路径
        target: 'http://127.0.0.1:8092/', // 代理目标的基础路径
        // secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 支持跨域
        pathRewrite: { // 重写路径: 去掉路径中开头的'/api'
          '/api': '/religion/zhiyun'
        }
      },
    },
    port: 8081 // 此处修改你想要的端口号
  },

})
