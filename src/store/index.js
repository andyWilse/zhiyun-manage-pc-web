//  store.js 中都mutation中增加添加和删除token的方法
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {     // 全局管理的数据存储
	 isLogin:'0',
	 ser:null,
	 token:localStorage.getItem('token') ? localStorage.getItem('token'):'',   // token
};
export default new Vuex.Store({
	state,
	getters:{    // 监听数据变化的
		getStorage(state){   // 获取本地存储的登录信息
	      if(!state.token){
	        state.token =JSON.parse(localStorage.getItem(key))
	      }
	      return state.token
	    }
	},
	mutations:{
		$_setToken(state, value) { // 设置存储token
	        state.token = value;
	        localStorage.setItem('token', value);
	    },
	    $_removeStorage(state, value){  // 删除token
		      localStorage.removeItem('token');
	    },
	}
})



/*
import Vue from 'vue' //引入 Vue
import Vuex from 'vuex' //引入 Vuex
import user from './modules/user' //引入 user module

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user //使用 user.js 中的 action
  }
})

export default store*/
