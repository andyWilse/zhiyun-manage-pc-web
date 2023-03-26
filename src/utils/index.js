import axios from "axios";
import router from '@/router'

const service = axios.create({
	baseURL: "http://zszjadmin.860577.net:8808/api/",
	timeout: 30000,

})
/** 
 * 添加请求拦截器
 */
service.interceptors.request.use(config => {
		let token = localStorage.getItem('token')
		if(token){ config.headers['token'] = token}
		return config
	},
	error => {
		console.log('添加请求拦截器失败' , error);
		return Promise.reject(error);
	}
)

/**
 * 添加响应拦截器
 */
service.interceptors.response.use(response => {
		if(response.data.code == 400){
			router.replace({
				path: '/'
			});
		}else{
			return response;
		}
	},
	error => {
		// Message.error("操作失败！")
		return Promise.response(error)
	}
)

export default service
