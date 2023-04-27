import Vue from 'vue';
import App from './App.vue';
import './plugins/element.js';
import router from './router' ;//引入路由配置
import store from './store'; //引入 Vuex 状态管理
import VueSimpleAlert from "vue-simple-alert";
import { Message } from 'element-ui';
import Region from 'v-region';
import VueCookies  from "vue-cookies";
import axios from 'axios'
import util from '@/libs/util.js';
//前端每次发送请求时就会带上 sessionId
import './static/http.js';
import VueRouter from 'vue-router';
import Plugin from 'v-fit-columns';
import * as echarts from 'echarts';
//import * as echarts from 'echarts/lib/echarts';
import * as utils from './utils/util.js';
import gloMsg from './utils/global.js' ;  //注意文件路径，实际路径以项目目录结构为准

/*import VueQuillEditor from 'vue-quill-editor';
import * as Quill from 'quill'; //引入编辑器
import resizeImage from 'quill-image-resize-module'; // 图片缩放组件。
Quill.register('modules/resizeImage ', resizeImage);
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor);*/

Vue.use(router);
Vue.use(Plugin);
Vue.use(VueRouter);
Vue.use(VueSimpleAlert);
Vue.use(Region);
Vue.use(VueCookies);
Vue.prototype.$store = store;
Vue.prototype.$message = Message;
Vue.prototype.$gloMsg = gloMsg;
Vue.prototype.$utils = utils;
Vue.config.productionTip = false;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
 if (to.matched.some(m => m.meta.requireAuth)) {    // 需要登录
    if(window.localStorage.token && window.localStorage.isLogin === '1'){
      next()
    } else if (to.path !== '/firstPage' && to.path !== '/') {
      let token = window.localStorage.token;
      if (token === 'null' || token === '' || token === undefined){
          next({path: '/'})
          //Toast({ message: '检测到您还未登录,请登录后操作！', duration: 1500 })
      }else{
        next();
      }
    } else {
        if (to.meta.title) {
            document.title = to.meta.title
        };
        next();

    }
  } else {
    if (to.meta.title) {
            document.title = to.meta.title
        };// 不需要登录
    next();
  }
});
new Vue({
    render: h => h(App),
    router, //使用路由配置
    store //使用 Vuex 进行状态管理
}).$mount('#app');


//Vue.prototype.$cookies = cookies;
// 设置反向代理，前端请求默认发送到 http://localhost:8443/api
//var axios = require('axios');
//axios.defaults.baseURL ='/api';

/*// 配置请求默认接口
axios.defaults.baseURL = "http://localhost:8093"
axios.defaults.withCredentials = true;

// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios;*/


/*//添加请求拦截器
axios.interceptors.request.use(
  config =>{
    if(store.state.token){
      config.headers.common['token'] =store.state.token
    }
    return config;
  },
  error =>{
    //对请求错误做什么
    return Promise.reject(error);
  });

//http reponse响应拦截器
axios.interceptors.response.use(
  response =>{
    return response;
  },
  error=>{
    if(error.response){
      switch(error.response.status){
        case 401:
          localStorage.removeItem('token');
          router.replace({
            path: '/views/login',
            query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
          })
      }
    }
  });*/

/*Vue.prototype.$apps = Apps;    //  app.js公用方法
Vue.config.productionTip = false;*/
    /*const roles = localStorage.getItem('roles');
    const permissions = localStorage.getItem('permissions');
    //这边可以用match()来判断所有需要权限的路径，to.matched.some(item => return item.meta.loginRequire)
    //let cookieroles = util.getCookie('roles');
    //console.log('cookies' +util.cookies.get('roles'));

    console.log("key: "+VueCookies.keys())
    let cookieRoles =VueCookies.keys("roles");
    console.log('cookie' + cookieRoles);
    if (1=== cookieRoles.length && to.path !== '/') { // cookie中有登陆用户信息跳转页面，否则到登陆页面
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
         // 更改标题
          util.title("ddd")
            next();
        }
    }*/



