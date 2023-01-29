// 配置项目的axios,导出进行全局配置

// 基准地址
// axios.defaults.baseURL =
//     'http://10.88.155.43/tkweb-legal-platform/lumen/public/rest/'

import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import router from '../router'
import base from './baseUrl'
const config = {
    // baseURL在此处省略配置,考虑到项目可能由多人协作完成开发，域名也各不相同，此处通过对api的抽离，域名单独配置在base.js中

    // 请求超时时间
    timeout: 60 * 1000,
    //————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

    // baseURL: 'http://10.88.155.43/takweb-legal-platform/lumen/public/rest/',
    //本地验证接口时用
    baseURL: base('dev'),
    //开发机验证接口时用
    // baseURL: '/rest/',
    //————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

    // 跨域请求时是否需要凭证
    // withCredentials: true, // Check cross-site Access-Control
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
    }
}

// 创建实例
const _axios = axios.create(config)
// 请求拦截器
_axios.interceptors.request.use(
    function (config) {
        // 从vuex里获取token
        // const token = store.state.token
        //     // 如果token存在就在请求头里添加
        // token && (config.headers.token = token)
        return config
    },
    function (error) {
        // // Do something with request error
        // error.data = {}
        // error.data.msg = '服务器异常'
        return Promise.reject(error)
    }
)

// 响应拦截器
_axios.interceptors.response.use(
    function (response) {
        // 清除本地存储中的token,如果需要刷新token，在这里通过旧的token跟服务器换新token，将新的token设置的vuex中
        //console.log('haha', repsonse)
        //if(response.data.code===401){
        //    localStorage.removeItem("token");
        //delete storage.token;
        //}
        // 只返回response中的data数据
        return response.data
    },
    function (error) {
        if (error) {
            // 请求已发出，但不在2xx范围内
            //  errorHandle(error.status,error.data.msg);
            if (error.response.status == '401') {
                if (store.getters['auth/isLoggedIn']) {
                    delete localStorage.token;
                    store.dispatch('auth/login_status_change');
                } else {
                    store.dispatch('auth/login_status_change');
                }
                router.currentRoute.path !== '/login' &&
                router.replace({
                    path: '/login',
                    query: {
                        redirect: router.currentRoute.fullPath
                    }
                });
                //store.dispatch('auth/gotoLogin');
            }
            return Promise.reject(error)
        } else {
            // 断网
            return Promise.reject(error)
        }
    }
)

/**
 * get 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
const get = (url, data = {}) => {
    return new Promise((resolve, reject) => {
        _axios.get(url, {
            params: data
        }).then(
            response => {
                resolve(response)
            },
            err => {
                if (err.response.status == '401') {
                    if (store.getters['auth/isLoggedIn']) {
                        delete localStorage.token;
                        store.dispatch('auth/login_status_change');
                    } else {
                        store.dispatch('auth/login_status_change');
                    }
                    router.currentRoute.path !== '/login' &&
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                }
                /*| err.response.status == '405'
                if(err.response.status == 401){
                    localStorage.removeItem("token");
                }

                if (store.getters['auth/isLoggedIn']) {
                    store.dispatch('auth/logout');
                    this.$router.push({path:'/login', query: {redirect:this.$route.fullPath}});
                }
                */
                reject(err)
            }
        )
    })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
const post = (url, params) => {
    return new Promise((resolve, reject) => {
        _axios.post(url, qs.stringify(params))
            .then(
                response => {
                    resolve(response)
                },
                err => {
                    reject(err)
                }
            )
    })
}

//  DELETE 方法封装
//  export const deleteRequest = (url) => {
//    return axios({
//        method: 'delete',
//            url: url
//              });
//              }
const deleteRequest = (url) => {
    return new Promise((resolve, reject) => {
        _axios.delete(url)
            .then(
                response => {
                    resolve(response)
                },
                err => {
                    reject(err)
                }
            )
    })
}

/**
 * put 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
const put = (url, params) => {
    return new Promise((resolve, reject) => {
        _axios.put(url, qs.stringify(params))
            .then(
                response => {
                    resolve(response)
                },
                err => {
                    reject(err)
                }
            )
    })
}

export default {
    get,
    post,
    deleteRequest,
    put
}
