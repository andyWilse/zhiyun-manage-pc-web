import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router' //引入路由配置
import store from './store' //引入 Vuex 状态管理
import VueSimpleAlert from "vue-simple-alert";
import { Message } from 'element-ui'
import Region from 'v-region'
import VueCookies from "vue-cookies";

import util from '@/libs/util.js'

Vue.use(VueSimpleAlert);
Vue.use(Region);
Vue.use(VueCookies);

Vue.prototype.$message = Message

// 设置反向代理，前端请求默认发送到 http://localhost:8443/api
var axios = require('axios')
axios.defaults.baseURL ='/api'
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


/*//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const roles = localStorage.getItem('roles');
    const permissions = localStorage.getItem('permissions');
    //这边可以用match()来判断所有需要权限的路径，to.matched.some(item => return item.meta.loginRequire)
    //let cookieroles = util.getCookie('roles');
    //console.log('cookies' +util.cookies.get('roles'));
    console.log("key: "+VueCookies.keys())
    let cookieRoles =VueCookies.keys("roles");
    console.log('cookie' + cookieRoles);
    if (!cookieRoles && to.path !== '/') { // cookie中有登陆用户信息跳转页面，否则到登陆页面
        next('/');
    } else if (to.meta.permission) {// 如果该页面配置了权限属性（自定义permission）
        // 如果是管理员权限则可进入
        roles.indexOf('admin') > -1 ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})*/
