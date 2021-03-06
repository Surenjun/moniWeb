import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authRedirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true },
        permission: 'home:view'
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/index',
    meta: { title: '????????????', icon: 'chart' },
    children: [
      {
        path: 'index',
        name: 'statistics',
        component: () => import('@/views/statistics/index'),
        meta: { title: '????????????', icon: 'chart' },
        permission: 'statistics:getStatisticsPage'
      },
      {
        path: 'condition',
        name: 'conditionStatistics',
        component: () => import('@/views/statistics/condition'),
        meta: { title: '??????????????????', icon: 'chart' },
        permission: 'statistics:getStatisticsPage'
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: '/student/index',
    children: [
      {
        path: 'index',
        name: 'student',
        component: () => import('@/views/student/index'),
        meta: { title: '????????????', icon: 'peoples' },
        permission: 'student:view'
      }
    ]
  },
  {
    path: '/cheat',
    component: Layout,
    redirect: '/cheat/index',
    children: [{
      path: 'index',
      name: 'cheat',
      component: () => import('@/views/cheat/index'),
      // props: { idcard:null },
      meta: { title: '????????????', icon: 'bug' },
      permission: 'cheat:view'
    },{
      path: 'video',
      name: 'cheatVideo',
      component: () => import('@/views/cheat/video'),
      meta: { title: '??????????????????', icon: 'bug', noCache: true },
      hidden: true
    },{
      path: 'videoTest',
      name: 'cheatVideoTest',
      component: () => import('@/views/cheat/videoTest'),
      meta: { title: '??????????????????', icon: 'bug', noCache: true },
      hidden: true
    },{
      path: 'detail',
      name: 'cheatDetail',
      component: () => import('@/views/cheat/detail'),
      meta: { title: '??????', icon: 'bug', noCache: true},
      hidden: true
    }]
  },
  {
    path: '/live',
    component: Layout,
    redirect: '/live/index',
    hidden: true,
    children: [{
      path: 'index',
      name: 'live',
      component: () => import('@/views/live/index'),
      // props: { idcard:null },
      meta: { title: '??????', icon: 'bug' },
      permission: 'live:view',
      hidden: true
    }]
  },
  {
    path: '/subject_three',
    component: Layout,
    redirect: '/subject_three/index',
    meta: { title: '????????????', icon: 'car' },
    // hidden: true,
    children: [{
      path: 'index',
      name: 'subjectThree',
      component: () => import('@/views/subjectThree/index'),
      // props: { idcard:null },
      meta: { title: '????????????????????????', icon: 'documentation' },
      permission: 'km3:file:view',
      // hidden: true
    },{
      path: 'video',
      name: 'subjectThreeVideo',
      component: () => import('@/views/subjectThree/video'),
      meta: { title: '??????????????????', icon: 'link', noCache: true },
      hidden: true
    },

      {
        path: 'commonFile',
        name: 'commonFile',
        component: () => import('@/views/subjectThree/commonFile'),
        meta: { title: '??????????????????', icon: 'documentation' },
        permission: 'km3:commonFile:view',

      },

      {
        path: 'km3statistics',
        name: 'km3statistics',
        component: () => import('@/views/subjectThree/km3statistics'),
        meta: { title: '????????????', icon: 'chart'},
        permission: 'km3:km3statistics:view',
      }

    ]
  },

  {
    path: '/system_operation',
    component: Layout,
    // redirect: '/system_operation/index',
    meta: { title: '????????????', icon: 'car' },
    // hidden: true,
    children: [

      {
        path: 'loginLog',
        name: 'loginLog',
        component: () => import('@/views/wuxi/loginLog'),
        meta: { title: '??????????????????', icon: 'documentation' },
        permission: 'system_operation:loginLog',

      },
      {
        path: 'operateLog',
        name: 'operateLog',
        component: () => import('@/views/wuxi/operateLog'),
        meta: { title: '??????????????????', icon: 'documentation' },
        permission: 'system_operation:operateLog',

      },
      {
        path: 'pageLog',
        name: 'pageLog',
        component: () => import('@/views/wuxi/pageLog'),
        meta: { title: '??????????????????', icon: 'documentation' },
        permission: 'system_operation:pageLog',
      },
      {
        path: 'sysParamConfig',
        name: 'sysParamConfig',
        component: () => import('@/views/wuxi/sysParamConfig'),
        meta: { title: '????????????', icon: 'documentation' },
        permission: 'system_operation:paramConfig',
      }



    ]
  },
  {
    path: '/version',
    component: Layout,
    redirect: '/version/index',
    children: [
      {
        path: 'index',
        name: 'version',
        component: () => import('@/views/version/index'),
        meta: { title: '????????????', icon: 'list' },
        permission: 'version:view'
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/index',
    meta: { title: '????????????', icon: 'nested' },
    children: [
      {
        path: 'index',
        name: 'device',
        component: () => import('@/views/device/index'),
        meta: { title: '????????????', icon: 'nested' },
        permission: 'device:view'
      },
      {
        path: 'index/car',
        name: 'car',
        component: () => import('@/views/device/car'),
        meta: { title: '????????????', icon: 'nested' },
        permission: 'car:view'
      },
      {
        path: 'index/android',
        name: 'android',
        component: () => import('@/views/device/android'),
        meta: { title: '????????????', icon: 'nested' },
        permission: 'android:view'
      },
      {
        path: 'index/tx2',
        name: 'tx2',
        component: () => import('@/views/device/tx2'),
        meta: { title: '????????????', icon: 'nested' },
        permission: 'tx2:view'
      }
    ]
  },


  {
    path: '/rule',
    component: Layout,
    redirect: '/rule/index',
    meta: { title: '????????????',icon: 'pdf' },
    children: [
      // {
      //     path: '/rule/index',
      //     name: 'rule',
      //     component: ()=>import('@/views/rule/index'),
      //     meta: { title: '????????????',icon: 'pdf' },
      //     permission: 'rule:view'
      // },
      {
        path: '/rule/examSubject',
        name: 'examSubject',
        component: () => import('@/views/rule/examSubject'),
        meta: { title: '????????????', icon: 'pdf' },
        permission: 'examSubject:view'
      },
      {
        path: '/rule/behaviour',
        name: 'behaviour',
        component: () => import('@/views/rule/behaviour'),
        meta: { title: '????????????', icon: 'pdf' },
        permission: 'behaviour:view'
      },
      {
        path: '/rule/OBD',
        name: 'OBD',
        component: () => import('@/views/rule/OBD'),
        meta: { title: 'OBD', icon: 'pdf' },
        permission: 'OBD:view'
      },
      {
        path: '/rule/ruleConfig',
        name: 'ruleConfig',
        component: () => import('@/views/rule/ruleConfig'),
        meta: { title: '??????????????????', icon: 'pdf' },
        permission: 'ruleConfig:view'
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',

    meta: {
      title: '????????????',
      icon: 'lock'
    },
    children: [
      {
        path: 'auth',
        component: () => import('@/views/permission/auth'),
        name: 'AuthPermission',
        meta: {
          title: 'authPermission'
        },
        permission: 'system_operation:monitor',
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission'
        },
        permission: 'system_operation:monitor',
      },
      {
        path: 'user',
        component: () => import('@/views/permission/user'),
        name: 'UserPermission',
        meta: {
          title: 'userPermission'
        },
        permission: 'system_operation:monitor',
      }
    ]
  },


  {
    //????????????
    path:'/evaluation',
    component: Layout,
    redirect: '/permission/index',

    meta: {
      title: '????????????',
      icon: 'car'
    },
    children: [
      {
        path: 'monitor',
        component: () => import('@/views/viewsPlus/evaluation/monitor'),
        name: '????????????',
        meta: {
          title: '????????????', icon: 'documentation'
        },
        permission: 'system_operation:monitor',
      },
      {
        path: 'subjectThree',
        name: 'subjectThree',
        component: () => import('@/views/subjectThree/index'),
        meta: { title: '????????????', icon: 'documentation' },
        permission: 'system_operation:subjectThree',
      },

    ]
  },
  {
    //????????????
    path:'/alert',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: '????????????',
      icon: 'bug'
    },
    children:[
      {
        path: 'warning-query',
        component: () => import('@/views/viewsPlus/business-alert/warningQuery'),
        name: '????????????',
        meta: {
          title: '????????????', icon: 'documentation'
        },
        permission: 'system_operation:warning-query',
      },
      {
        path: 'warning-list',
        component: () => import('@/views/viewsPlus/business-alert/warningList'),
        name: '??????????????????',
        meta: {
          title: '??????????????????', icon: 'documentation'
        },
        permission: 'system_operation:warning-list',
      }
    ]
  },
  {
    //??????????????????
    path:'/playback',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: '??????????????????',
      icon: 'video-camera'
    },
    children: [{
      path: '/playback',
      name: 'subjectThree',
      component: () => import('@/views/subjectThree/index'),
      meta: { title: '??????????????????', icon: 'documentation' },
      permission: 'system_operation:playback',
    }]
  },
  {
    //????????????
    path:'/achievement',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: '????????????',
      icon: 'user'
    },
    children: [{
      path: 'print',
      name: 'subjectThree',
      component: () => import('@/views/viewsPlus/achievement/print'),
      meta: { title: '???????????????', icon: 'documentation' },
      //system_operation:achievement-print
      permission: 'system_operation:achievement-print',
    }]
  },
  {
    //??????
    path:'/evaluating-list',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: '??????',
      icon: 'lock'
    },
    children: [
      {
        path: '/evaluating-list',
        name: '????????????',
        component: () => import('@/views/rule/examSubject'),
        meta: { title: '????????????', icon: 'documentation' },
        permission: 'system_operation:evaluating-list'
      },
      {
        path: '/manage',
        name: '??????????????????',
        component: () => import('@/views/viewsPlus/evaluation/manage'),
        meta: { title: '??????????????????', icon: 'documentation' },
        permission: 'system_operation:manage'
      }

    ]
  },
  {
    //????????????
    path:'/evaluation-management',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: '????????????',
      icon: 'list',
    },
    children: [
      {
        path: '/evaluation-download',
        name: '????????????????????????',
        component: () => import('@/views/viewsPlus/evaluation-management/download'),
        meta: { title: '????????????????????????', icon: 'documentation' },
        permission: 'system_operation:evaluation-download'
      },
      {
        path: '/evaluation-road',
        name: '????????????',
        component: () => import('@/views/viewsPlus/evaluation-management/evaluation-management'),
        meta: { title: '????????????', icon: 'documentation' },
        permission: 'system_operation:evaluation-road'
      },
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
