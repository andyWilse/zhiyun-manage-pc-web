import Vue from 'vue' //引入 Vue
import VueRouter from 'vue-router' //引入 Vue 路由

import layOut from '@/mainpage/layOut';
import firstPage from '@/mainpage/dialog/FirstPage';
import taskDetail from '@/mainpage/dialog/taskDetail';

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
    { path: '/',name:'loginView', component: loginView,meta:{requireAuth:true,title:'瓯海宗教智治管理端'}},
    //配置登录成功页面，使用时需要使用 path 路径来实现跳转
    { path: '/success',name:'success', component: () => import('@/views/successView')},
    //配置登录失败页面，使用时需要使用 path 路径来实现跳转
    { path: '/error', name:'error',component: () => import('@/views/errorView'), hidden: true },
    //菜单
    {path:'/layOut',name:'layOut',component:layOut,redirect:'firstPage',
        children:[
            {path:'/firstPage',name:'firstPage',component:firstPage, meta: {title: "瓯海宗教智治管理端",show: true}},
            {path:'/taskDetail',name:'taskDetail',component:taskDetail, meta: {title: "瓯海宗教智治管理端",show: true}},
            {path:'/venuesIndex',name:'venuesIndexss- ',component:venuesIndexs,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/venusesAdd',name:'venusesAdd',component:venusesAdd,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/venusesModify',name:'venusesModify',component:venusesModify,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/staffIndex',name:'staffIndex',component:staffIndex,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/managerIndex',name:'managerIndex',component:managerIndex,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/managerAdd',name:'managerAdd',component:managerAdd,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/managerModify',name:'managerModify',component:managerModify,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/logIndex',name:'logIndex',component:logIndex,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/monitorIndex',name:'monitorIndex',component:monitorIndex,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/eventIndex',name:'eventIndex',component:eventIndex,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/userIndex',name:'userIndex',component:userIndex,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/userAdd',name:'userAdd',component:userAdd,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/userModify',name:'userModify',component:userModify,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/userLimit',name:'userLimit',component:userLimit,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/mapIndex',name:'mapIndex',component:mapIndex,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/eventChart',name:'eventChart',component:eventChart,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/taskChart',name:'taskChart',component:taskChart,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/newsIndex',name:'newsIndex',component:newsIndex,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/newsAdd',name:'newsAdd',component:newsAdd,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/newsModify',name:'newsModify',component:newsModify,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/newDetail',name:'newDetail',component:newDetail,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/monitorNow',name:'monitorNow',component:monitorNow,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/monitorBack',name:'monitorBack',component:monitorBack,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/deployTask',name:'deployTask',component:deployTask,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/finishTask',name:'finishTask',component:finishTask,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
            {path:'/unFinishTask',name:'unFinishTask',component:unFinishTask,meta:{title: "瓯海宗教智治管理端",requireAuth:true}},
        ],meta:{
          		index:1,
          		title: "瓯海宗教智治管理端",
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