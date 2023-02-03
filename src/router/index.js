import Vue from 'vue' //引入 Vue
import VueRouter from 'vue-router' //引入 Vue 路由

import layOut from '@/mainpage/layOut';
import venuesIndex from '@/views/venuses/venuesIndex';
import staffIndex from '@/views/staff/staffIndex';
import logIndex from '@/views/syspage/LogIndex';
import monitorIndex from '@/views/monitor/MonitorIndex';
import monitorNow from '@/views/monitor/MonitorNow';
import monitorBack from '@/views/monitor/MonitorBack';
import eventIndex from '@/views/syspage/EventIndex';
import userIndex from '@/views/user/userIndex';
import userLimit from '@/views/user/userLimit';
import newsIndex from '@/views/news/newsIndex';
import sus from '@/views/successView';

Vue.use(VueRouter); //安装插件

export const constantRouterMap = [
    //配置默认的路径，默认显示登录页
    { path: '/', component: () => import('@/views/loginView')},
    //配置登录成功页面，使用时需要使用 path 路径来实现跳转
    { path: '/success', component: () => import('@/views/successView')},
    //配置登录失败页面，使用时需要使用 path 路径来实现跳转
    { path: '/error', component: () => import('@/views/errorView'), hidden: true },


    { path: '/test', component: () => import('@/test/testTd'), hidden: true },

    //菜单
    {path:'/layOut',name:'layOut',component:layOut,redirect:'sus',
        children:[
            {path:'/sus',name:'sus',component:sus},
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
            {path:'/newsIndex',name:'newsIndex',component:newsIndex},
            {path:'/monitorNow',name:'monitorNow',component:monitorNow},
            {path:'/monitorBack',name:'monitorBack',component:monitorBack},

        ]
    },

]

export default new VueRouter({
     /*mode: 'history', //后端支持可开*/
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap //指定路由列表
})