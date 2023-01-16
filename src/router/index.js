import Vue from 'vue' //引入 Vue
import VueRouter from 'vue-router' //引入 Vue 路由
import layOut from '@/lay/layOut';
import venuesIndex from '@/table/venuesIndex';
import staffIndex from '@/staff/staffIndex';
import logIndex from '@/syspage/LogIndex';
import monitorIndex from '@/syspage/MonitorIndex';
import eventIndex from '@/syspage/EventIndex';
import userIndex from '@/user/userIndex';
import userLimit from '@/user/userLimit';

import error from '@/views/errorView';
import pu from '@/picture/duoPic';


Vue.use(VueRouter); //安装插件

export const constantRouterMap = [
    //配置默认的路径，默认显示登录页
    { path: '/', component: () => import('@/views/loginView')},

    //配置登录成功页面，使用时需要使用 path 路径来实现跳转
    { path: '/success', component: () => import('@/views/successView')},

    //配置登录失败页面，使用时需要使用 path 路径来实现跳转
/*
    { path: '/error', component: () => import('@/views/errorView'), hidden: true },
*/
    { path: '/sideMenu',
        component: () => import('@/main/SideMenu'),
        meta: {
            index:0,
            showFooter:true,
            needLogin: true
        }
    },
    { path: '/lay',
        component: () => import('@/lay/layOut'),
        meta: {
            index:0,
            showFooter:true,
            needLogin: true
        }
    },

    {
        path: '/pu',
        name: 'pu',
        component: pu,
        meta: {
            index:0,
            showFooter:true,
            needLogin: true
        }
    },
    { path: '/pus', component: () => import('@/picture/duoPIC2')},

    { path: '/tw', component: () => import('@/picture/test/testNe')},
    { path: '/tws', component: () => import('@/user/userLimit')},
    { path: '/li', component: () => import('@/limit/limitIndex')},


    {path:'/layOut',name:'layOut',component:layOut,redirect:'userIndex',
        children:[
            {path:'/venuesIndex',name:'venuesIndex',component:venuesIndex},
            {path:'/staffIndex',name:'staffIndex',component:staffIndex},
            {path:'/logIndex',name:'logIndex',component:logIndex},
            {path:'/monitorIndex',name:'monitorIndex',component:monitorIndex},
            {path:'/eventIndex',name:'eventIndex',component:eventIndex},
            {path:'/userIndex',name:'userIndex',component:userIndex},
            {path:'/userLimit',name:'userLimit',component:userLimit,
                meta: {
                    index:0,
                    showFooter:true,
                    needLogin: true
                }
            },

            {path:'/error',name:'error',component:error},
        ]},

]

export default new VueRouter({
     /*mode: 'history', //后端支持可开*/
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap //指定路由列表
})