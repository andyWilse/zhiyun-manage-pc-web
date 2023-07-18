import Vue from 'vue' //引入 Vue
import VueRouter from 'vue-router' //引入 Vue 路由

import layOut from '@/mainpage/layOut';
import firstPage from '@/mainpage/dialog/FirstPage';
import loginView from '@/views/loginView';
import venuesIndexs from '@/views/venuses/venuesIndex';
import venusesAdd from '@/views/venuses/venusesAdd';
import venusesModify from '@/views/venuses/venusesModify';
import staffIndex from '@/views/staff/staffIndex';
import managerIndex from '@/views/manager/managerIndex';
import managerAdd from '@/views/manager/managerAdd';
import managerModify from '@/views/manager/managerModify';
import logIndex from '@/views/syspage/LogIndex';
import eventIndex from '@/views/syspage/EventIndex';
import monitorIndex from '@/views/monitor/MonitorIndex';
import monitorNow from '@/views/monitor/MonitorNow';
import monitorBack from '@/views/monitor/MonitorBack';
import userIndex from '@/views/user/userIndex';
import userAdd from '@/views/user/userAdd';
import userModify from '@/views/user/userModify';
import userLimit from '@/views/user/userLimit';
import mapIndex from '@/views/charts/map/mapIndex';
import eventChart from '@/views/charts/event/eventChart';
import taskChart from '@/views/charts/task/taskChart';
import newsIndex from '@/views/news/newsIndex';
import newsAdd from '@/views/news/newsAdd';
import newsModify from '@/views/news/newsModify';
import newDetail from '@/views/news/newDetail';
import deployTask from '@/views/task/deployTask';
import finishTask from '@/views/task/finishTask';
import unFinishTask from '@/views/task/unFinishTask';

import sus from '@/views/successView';

Vue.use(VueRouter); //安装插件

export const constantRouterMap = [
    //配置默认的路径，默认显示登录页
    { path: '/',name:'loginView', component: loginView,meta:{requireAuth:true}},
    //配置登录成功页面，使用时需要使用 path 路径来实现跳转
    { path: '/success',name:'success', component: () => import('@/views/successView')},
    //配置登录失败页面，使用时需要使用 path 路径来实现跳转
    { path: '/error', name:'error',component: () => import('@/views/errorView'), hidden: true },
    //菜单
    {path:'/layOut',name:'layOut',component:layOut,redirect:'firstPage',
        children:[
            {path:'/firstPage',name:'firstPage',component:firstPage, meta: {title: "firstPage",show: true}},
            {path:'/venuesIndex',name:'venuesIndexss- ',component:venuesIndexs,meta:{requireAuth:true}},
            {path:'/venusesAdd',name:'venusesAdd',component:venusesAdd,meta:{requireAuth:true}},
            {path:'/venusesModify',name:'venusesModify',component:venusesModify,meta:{requireAuth:true}},
            {path:'/staffIndex',name:'staffIndex',component:staffIndex,meta:{requireAuth:true}},
            {path:'/managerIndex',name:'managerIndex',component:managerIndex,meta:{requireAuth:true}},
            {path:'/managerAdd',name:'managerAdd',component:managerAdd,meta:{requireAuth:true}},
            {path:'/managerModify',name:'managerModify',component:managerModify,meta:{requireAuth:true}},
            {path:'/logIndex',name:'logIndex',component:logIndex,meta:{requireAuth:true}},
            {path:'/monitorIndex',name:'monitorIndex',component:monitorIndex,meta:{requireAuth:true}},
            {path:'/eventIndex',name:'eventIndex',component:eventIndex,meta:{requireAuth:true}},
            {path:'/userIndex',name:'userIndex',component:userIndex,meta:{requireAuth:true}},
            {path:'/userAdd',name:'userAdd',component:userAdd,meta:{requireAuth:true}},
            {path:'/userModify',name:'userModify',component:userModify,meta:{requireAuth:true}},
            {path:'/userLimit',name:'userLimit',component:userLimit,meta:{requireAuth:true}},
            {path:'/mapIndex',name:'mapIndex',component:mapIndex,meta:{requireAuth:true}},
            {path:'/eventChart',name:'eventChart',component:eventChart,meta:{requireAuth:true}},
            {path:'/taskChart',name:'taskChart',component:taskChart,meta:{requireAuth:true}},
            {path:'/newsIndex',name:'newsIndex',component:newsIndex,meta:{requireAuth:true}},
            {path:'/newsAdd',name:'newsAdd',component:newsAdd,meta:{requireAuth:true}},
            {path:'/newsModify',name:'newsModify',component:newsModify,meta:{requireAuth:true}},
            {path:'/newDetail',name:'newDetail',component:newDetail,meta:{requireAuth:true}},
            {path:'/monitorNow',name:'monitorNow',component:monitorNow,meta:{requireAuth:true}},
            {path:'/monitorBack',name:'monitorBack',component:monitorBack,meta:{requireAuth:true}},
            {path:'/deployTask',name:'deployTask',component:deployTask,meta:{requireAuth:true}},
            {path:'/finishTask',name:'finishTask',component:finishTask,meta:{requireAuth:true}},
            {path:'/unFinishTask',name:'unFinishTask',component:unFinishTask,meta:{requireAuth:true}},
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