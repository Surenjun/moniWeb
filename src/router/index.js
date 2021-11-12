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
    meta: { title: '统计分析', icon: 'chart' },
    children: [
      {
        path: 'index',
        name: 'statistics',
        component: () => import('@/views/statistics/index'),
        meta: { title: '统计分析', icon: 'chart' },
        permission: 'statistics:getStatisticsPage'
      },
      {
        path: 'condition',
        name: 'conditionStatistics',
        component: () => import('@/views/statistics/condition'),
        meta: { title: '条件统计分析', icon: 'chart' },
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
        meta: { title: '学员信息', icon: 'peoples' },
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
      meta: { title: '异常行为', icon: 'bug' },
      permission: 'cheat:view'
    },{
      path: 'video',
      name: 'cheatVideo',
      component: () => import('@/views/cheat/video'),
      meta: { title: '异常行为录像', icon: 'bug', noCache: true },
      hidden: true
    },{
      path: 'videoTest',
      name: 'cheatVideoTest',
      component: () => import('@/views/cheat/videoTest'),
      meta: { title: '异常行为录像', icon: 'bug', noCache: true },
      hidden: true
    },{
      path: 'detail',
      name: 'cheatDetail',
      component: () => import('@/views/cheat/detail'),
      meta: { title: '详情', icon: 'bug', noCache: true},
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
      meta: { title: '直播', icon: 'bug' },
      permission: 'live:view',
      hidden: true
    }]
  },
  {
    path: '/subject_three',
    component: Layout,
    redirect: '/subject_three/index',
    meta: { title: '新科目三', icon: 'car' },
    // hidden: true,
    children: [{
      path: 'index',
      name: 'subjectThree',
      component: () => import('@/views/subjectThree/index'),
      // props: { idcard:null },
      meta: { title: '视频融合文件列表', icon: 'documentation' },
      permission: 'km3:file:view',
      // hidden: true
    },{
      path: 'video',
      name: 'subjectThreeVideo',
      component: () => import('@/views/subjectThree/video'),
      meta: { title: '视频融合展示', icon: 'link', noCache: true },
      hidden: true
    },

      {
        path: 'commonFile',
        name: 'commonFile',
        component: () => import('@/views/subjectThree/commonFile'),
        meta: { title: '通用文件展示', icon: 'documentation' },
        permission: 'km3:commonFile:view',

      },

      {
        path: 'km3statistics',
        name: 'km3statistics',
        component: () => import('@/views/subjectThree/km3statistics'),
        meta: { title: '条件统计', icon: 'chart'},
        permission: 'km3:km3statistics:view',
      }

    ]
  },

  {
    path: '/system_operation',
    component: Layout,
    // redirect: '/system_operation/index',
    meta: { title: '系统操作', icon: 'car' },
    // hidden: true,
    children: [

      {
        path: 'loginLog',
        name: 'loginLog',
        component: () => import('@/views/wuxi/loginLog'),
        meta: { title: '平台登陆日志', icon: 'documentation' },
        permission: 'system_operation:loginLog',

      },
      {
        path: 'operateLog',
        name: 'operateLog',
        component: () => import('@/views/wuxi/operateLog'),
        meta: { title: '数据操作日志', icon: 'documentation' },
        permission: 'system_operation:operateLog',

      },
      {
        path: 'pageLog',
        name: 'pageLog',
        component: () => import('@/views/wuxi/pageLog'),
        meta: { title: '页面操作日志', icon: 'documentation' },
        permission: 'system_operation:pageLog',
      },
      {
        path: 'sysParamConfig',
        name: 'sysParamConfig',
        component: () => import('@/views/wuxi/sysParamConfig'),
        meta: { title: '系统参数', icon: 'documentation' },
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
        meta: { title: '版本控制', icon: 'list' },
        permission: 'version:view'
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/index',
    meta: { title: '设备管理', icon: 'nested' },
    children: [
      {
        path: 'index',
        name: 'device',
        component: () => import('@/views/device/index'),
        meta: { title: '设备总览', icon: 'nested' },
        permission: 'device:view'
      },
      {
        path: 'index/car',
        name: 'car',
        component: () => import('@/views/device/car'),
        meta: { title: '车辆管理', icon: 'nested' },
        permission: 'car:view'
      },
      {
        path: 'index/android',
        name: 'android',
        component: () => import('@/views/device/android'),
        meta: { title: '安卓设备', icon: 'nested' },
        permission: 'android:view'
      },
      {
        path: 'index/tx2',
        name: 'tx2',
        component: () => import('@/views/device/tx2'),
        meta: { title: '识别终端', icon: 'nested' },
        permission: 'tx2:view'
      }
    ]
  },


  {
    path: '/rule',
    component: Layout,
    redirect: '/rule/index',
    meta: { title: '规则管理',icon: 'pdf' },
    children: [
      // {
      //     path: '/rule/index',
      //     name: 'rule',
      //     component: ()=>import('@/views/rule/index'),
      //     meta: { title: '作弊规则',icon: 'pdf' },
      //     permission: 'rule:view'
      // },
      {
        path: '/rule/examSubject',
        name: 'examSubject',
        component: () => import('@/views/rule/examSubject'),
        meta: { title: '考试项目', icon: 'pdf' },
        permission: 'examSubject:view'
      },
      {
        path: '/rule/behaviour',
        name: 'behaviour',
        component: () => import('@/views/rule/behaviour'),
        meta: { title: '行为规范', icon: 'pdf' },
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
        meta: { title: '作弊规则配置', icon: 'pdf' },
        permission: 'ruleConfig:view'
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',

    meta: {
      title: '用户权限',
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
    //评测监控
    path:'/evaluation',
    component: Layout,
    redirect: '/permission/index',

    meta: {
      title: '评测监控',
      icon: 'car'
    },
    children: [
      {
        path: 'monitor',
        component: () => import('@/views/viewsPlus/evaluation/monitor'),
        name: '评测监控',
        meta: {
          title: '评测监控', icon: 'documentation'
        },
        permission: 'system_operation:monitor',
      },
      {
        path: 'subjectThree',
        name: 'subjectThree',
        component: () => import('@/views/subjectThree/index'),
        meta: { title: '监控调度', icon: 'documentation' },
        permission: 'system_operation:subjectThree',
      },

    ]
  },
  {
    //业务预警
    path:'/alert',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: '业务预警',
      icon: 'bug'
    },
    children:[
      {
        path: 'warning-query',
        component: () => import('@/views/viewsPlus/business-alert/warningQuery'),
        name: '警告查询',
        meta: {
          title: '警告查询', icon: 'documentation'
        },
        permission: 'system_operation:warning-query',
      },
      {
        path: 'warning-list',
        component: () => import('@/views/viewsPlus/business-alert/warningList'),
        name: '警告信息列表',
        meta: {
          title: '警告信息列表', icon: 'documentation'
        },
        permission: 'system_operation:warning-list',
      }
    ]
  },
  {
    //评测过程回放
    path:'/playback',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: '评测过程回放',
      icon: 'video-camera'
    },
    children: [{
      path: '/playback',
      name: 'subjectThree',
      component: () => import('@/views/subjectThree/index'),
      meta: { title: '评测过程回放', icon: 'documentation' },
      permission: 'system_operation:playback',
    }]
  },
  {
    //成绩管理
    path:'/achievement',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: '成绩管理',
      icon: 'user'
    },
    children: [{
      path: 'print',
      name: 'subjectThree',
      component: () => import('@/views/viewsPlus/achievement/print'),
      meta: { title: '成绩单管理', icon: 'documentation' },
      //system_operation:achievement-print
      permission: 'system_operation:achievement-print',
    }]
  },
  {
    //评测
    path:'/evaluating-list',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: '评测',
      icon: 'lock'
    },
    children: [
      {
        path: '/evaluating-list',
        name: '评测查询',
        component: () => import('@/views/rule/examSubject'),
        meta: { title: '评测查询', icon: 'documentation' },
        permission: 'system_operation:evaluating-list'
      },
      {
        path: '/manage',
        name: '评测项目管理',
        component: () => import('@/views/viewsPlus/evaluation/manage'),
        meta: { title: '评测项目管理', icon: 'documentation' },
        permission: 'system_operation:manage'
      }

    ]
  },
  {
    //评测管理
    path:'/evaluation-management',
    component: Layout,
    redirect: '/permission/index',
    meta: {
      title: '评测管理',
      icon: 'list',
    },
    children: [
      {
        path: '/evaluation-download',
        name: '评测对象信息下载',
        component: () => import('@/views/viewsPlus/evaluation-management/download'),
        meta: { title: '评测对象信息下载', icon: 'documentation' },
        permission: 'system_operation:evaluation-download'
      },
      {
        path: '/evaluation-road',
        name: '评测路线',
        component: () => import('@/views/viewsPlus/evaluation-management/evaluation-management'),
        meta: { title: '评测路线', icon: 'documentation' },
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
