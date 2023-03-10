import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui';
import router from '../../src/router'

// 配置请求默认接口
//axios.defaults.baseURL = "http://localhost:8093"
axios.defaults.baseURL ='/api';
// 设置请求超时时间
// axios.defaults.timeout = 15000
// 是否允许跨域携带cookie信息
axios.defaults.withCredentials = false;
// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// http request 拦截器 添加一个请求拦截器
axios.interceptors.request.use((config) => {
    // config 是 axios 配置对象
    // 获取token
    let token = window.localStorage.getItem('token');
    // 添加token
    token && (config.headers.token = token)
    return config;
}, (error) => {
    // 请求出错
    return Promise.reject(error);
});
// http response 拦截器 添加一个响应拦截器
axios.interceptors.response.use((response) => {
    // 响应成功，根据后台返回数据统一处理错误码
    switch (response.data.code) {
        case 5005:
            // 提示内容及操作
            ElementUI.Message({
	            message: "登录超时，请重新登录验证！",
	            type: 'warning'
	        });
	        router.push('/')
            break;
        case 401:
            // 提示内容及操作
            break;
        // 更多状态提示...
    }
    return response;
}, (error) => {
    // 响应失败
    return Promise.reject(error);
})

Vue.prototype.$axios = axios
