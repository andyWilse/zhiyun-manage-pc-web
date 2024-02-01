import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui';
import router from '../../src/router'
import store from '../store';
const CRYPTOJSKEY= "7b30a18b75c44f36b9e3f5e2af4e6d85";//前后端定义的密钥，AES使用16位
var CryptoJS = require("crypto-js");
Vue.prototype.$axios = axios
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
    let token = store.state.token;
    // 添加token
    token && (config.headers.token = token)
    //加密
    config.data = encrypt(JSON.stringify(config.data));
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
        case 400:
                    // 提示内容及操作
                    ElementUI.Message({
                        message: response.data.message,
                        type: 'warning'
                    });
                    router.push('/')
                    break;
        case 401:
            // 提示内容及操作
            break;
        // 更多状态提示...
    }

    response.data =decrypt(response.data);
    return response;
}, (error) => {
    // 响应失败
    return Promise.reject(error);
})

// 加密
function encrypt(plaintText) {
  var plaintText = plaintText;
  var options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  };
  var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
  var encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
  var encryptedBase64Str = encryptedData.toString().replace(/\//g, "_");
  encryptedBase64Str = encryptedBase64Str.replace(/\+/g,"-");
  return encryptedBase64Str;
}

//解密
function decrypt(encryptedBase64Str) {
  var vals = encryptedBase64Str.toString().replace(/\-/g, '+').replace(/_/g, '/');
  var options = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  };
  var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
  var decryptedData = CryptoJS.AES.decrypt(vals, key, options);
  var decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData);
  var decryptedArr=JSON.parse(decryptedStr);
  return decryptedArr;
}


