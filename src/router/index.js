import Vue from 'vue' //引入 Vue
import VueRouter from 'vue-router' //引入 Vue 路由

import loginView from '@/views/loginView';
import layOut from '@/mainpage/layOut';
import venuesIndexs from '@/views/venuses/venuesIndex';
import staffIndex from '@/views/staff/staffIndex';
import logIndex from '@/views/syspage/LogIndex';
import monitorIndex from '@/views/monitor/MonitorIndex';
import monitorNow from '@/views/monitor/MonitorNow';
import monitorBack from '@/views/monitor/MonitorBack';
import eventIndex from '@/views/syspage/EventIndex';
import userIndex from '@/views/user/userIndex';
import userLimit from '@/views/user/userLimit';
import limitUser from '@/views/user/limit/LimitUserIndex';

import newsIndex from '@/views/news/newsIndex';
import firstPage from '@/mainpage/dialog/FirstPage';
import deployTask from '@/views/task/deployTask';

import sus from '@/views/successView';
//import managerAdd from '@/views/manager/managerAdd';


Vue.use(VueRouter); //安装插件

export const constantRouterMap = [
    //配置默认的路径，默认显示登录页
    { path: '/',name:'loginView', component: loginView,meta:{requireAuth:true}},
    //{ path: '/managerAdd',name:'managerAdd', component: managerAdd,meta:{requireAuth:true}},

/*
    //配置登录成功页面，使用时需要使用 path 路径来实现跳转
    { path: '/success',name:'success', component: () => import('@/views/successView')},
    //配置登录失败页面，使用时需要使用 path 路径来实现跳转
    { path: '/error', name:'error',component: () => import('@/views/errorView'), hidden: true },


    { path: '/test',name:'test', component: () => import('@/test/shiroTest'), hidden: true },
    { path: '/pass',name:'pass', component: () => import('@/test/updatePassword'), hidden: true },
*/

    //菜单
    {path:'/layOut',name:'layOut',component:layOut,redirect:'firstPage',
        children:[
            {path:'/firstPage',name:'firstPage',component:firstPage, meta: {title: "firstPage",show: true}},
            {path:'/venuesIndex',name:'venuesIndexss- ',component:venuesIndexs,meta:{requireAuth:true}},
            {path:'/staffIndex',name:'staffIndex',component:staffIndex,meta:{requireAuth:true}},
            {path:'/logIndex',name:'logIndex',component:logIndex,meta:{requireAuth:true}},
            {path:'/monitorIndex',name:'monitorIndex',component:monitorIndex,meta:{requireAuth:true}},
            {path:'/eventIndex',name:'eventIndex',component:eventIndex,meta:{requireAuth:true}},
            {path:'/userIndex',name:'userIndex',component:userIndex,meta:{requireAuth:true}},
            {path:'/userLimit',name:'userLimit',component:userLimit,meta:{requireAuth:true}},
            {path:'/limitUser',name:'limitUser',component:limitUser,meta:{requireAuth:true}},
            {path:'/newsIndex',name:'newsIndex',component:newsIndex,meta:{requireAuth:true}},
            {path:'/monitorNow',name:'monitorNow',component:monitorNow,meta:{requireAuth:true}},
            {path:'/monitorBack',name:'monitorBack',component:monitorBack,meta:{requireAuth:true}},
            {path:'/deployTask',name:'deployTask',component:deployTask,meta:{requireAuth:true}},
        ],meta:{
          		index:1,
          		showFooter:false
          	}
    },

]

export default new VueRouter({
     mode: 'history',//后端支持可开*/
     //base:'/m/',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap //指定路由列表
})
//index:0,
//showFooter:true,
//needLogin: true