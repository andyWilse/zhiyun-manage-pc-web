import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router' //引入路由配置
import store from './store' //引入 Vuex 状态管理
import VueSimpleAlert from "vue-simple-alert";

import { Message } from 'element-ui'
Vue.prototype.$message = Message


Vue.use(VueSimpleAlert);
// 设置反向代理，前端请求默认发送到 http://localhost:8443/api
var axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8092/religion/zhiyun'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios

Vue.config.productionTip = false

axios.interceptors.request.use(
    function (config) {
                let token = localStorage.getItem('token');
                if (token) {
                    config.headers['x-token'] = token;
                    config.headers['login-name']=localStorage.getItem('userNbr');
                }
                return config;
            }
    );

// 全局路由守卫
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token')
    if (to.meta.needLogin) { // 判断该路由是否需要登录权限
        // 判断是否已经登录
        if (token) {
            next();
        }else {
            next({path: '/'}) ; //跳转到登录页
        }
    } else {
        next()
    }
});


new Vue({
    render: h => h(App),
    router, //使用路由配置
    store //使用 Vuex 进行状态管理
}).$mount('#app');
