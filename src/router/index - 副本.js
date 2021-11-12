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
  },
  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },

  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/index',
    children: [
      {
        path: 'index',
        name: 'statistics',
        component: () => import('@/views/statistics/index'),
        meta: { title: '统计分析', icon: 'chart' }
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: '/student/index',
    meta: { title: '学员信息' },
    children: [{
        path: 'index',
        name: 'student',
        component: ()=>import('@/views/student/index'),
        meta: { title: '学员信息',icon: 'peoples' }
    }]
  },
  {
    path: '/live',
    component: Layout,
    redirect: '/live/index',
    meta: { title: '视频直播' },
    children: [{
      path: 'index',
      name: 'live',
      component: ()=>import('@/views/live/index'),
      meta: { title: '视频直播',icon: 'eye-open' , noCache: true},
    }],
    hidden:true
  },
  {
    path: '/cheat',
    component: Layout,
    redirect: '/cheat/index',
    meta: {title: '异常行为',icon: 'bug'},
    children: [{
      path: 'index',
      name: 'cheat',
      component: ()=>import('@/views/cheat/index'),
      // props: { idcard:null },
      meta: { title: '异常行为',icon: 'bug'  }
    },{
      path: 'video',
      name: 'cheatVideo',
      component: ()=>import('@/views/cheat/video'),
      meta: { title: '异常行为录像',icon: 'bug' ,noCache: true },
      hidden:true
    },{
      path: 'videoTest',
      name: 'cheatVideoTest',
      component: ()=>import('@/views/cheat/playback'),
      meta: { title: '异常行为录像',icon: 'bug' ,noCache: true },
      hidden:true
    },{
      path: 'start',
      name: 'startRecord',
      component: ()=>import('@/views/cheat/start'),
      meta: { title: '开始录像',icon: 'bug' ,noCache: true },
      hidden:true
    },{
      path: 'detail',
      name: 'cheatDetail',
      component: ()=>import('@/views/cheat/detail'),
      meta: { title: '详情',icon: 'bug' ,noCache: true},
      hidden:true
    }]
  },
  {
    path: '/playback',
    component: Layout,
    redirect: '/playback/index',
    meta: { title: '视频回放' },
    hidden:true,
    children: [{
      path: 'index',
      name: 'playback',
      component: ()=>import('@/views/cheat/playback'),
      meta: { title: '视频回放',icon: 'eye-open',noCache: true },
      hidden:true
    }]
  },
  {
    path: '/version',
    component: Layout,
    redirect: '/version/index',
    meta: { title: '版本控制' },
    children: [{
        path: 'index',
        name: 'version',
        component: ()=>import('@/views/version/index'),
        meta: { title: '版本控制',icon: 'list' }
    }]
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/index',
    meta: { title: '设备管理',icon: 'nested'  },
    children: [{
        path: 'index',
        name: 'car',
        component: ()=>import('@/views/device/index'),
        meta: { title: '设备总览',icon: 'nested' }
    },{
        path: 'index/car',
        name: 'car',
        component: ()=>import('@/views/device/car'),
        meta: { title: '车辆管理',icon: 'nested' }
    },{
        path: 'index/android',
        name: 'android',
        component: ()=>import('@/views/device/android'),
        meta: { title: '安卓设备',icon: 'nested' }
    },{
        path: 'index/tx2',
        name: 'tx2',
        component: ()=>import('@/views/device/tx2'),
        meta: { title: '识别终端',icon: 'nested' }
    }]
  },
  {
    path: '/rule',
    component: Layout,
    redirect: '/rule/index',
    meta: { title: '作弊规则',icon: 'pdf' },
    children: [{
        path: '/rule/index',
        component: ()=>import('@/views/rule/index'),
        meta: { title: '作弊规则',icon: 'pdf' }
    },{
        path: '/rule/examSubject',
        component: ()=>import('@/views/rule/examSubject'),
        meta: { title: '考试项目',icon: 'pdf' }
    },{
        path: '/rule/behaviour',
        component: ()=>import('@/views/rule/behaviour'),
        meta: { title: '行为规范',icon: 'pdf' }
    },{
        path: '/rule/OBD',
        component: ()=>import('@/views/rule/OBD'),
        meta: { title: 'OBD',icon: 'pdf' }
    }]
  },
  // {
  //   path: '/voice',
  //   component: Layout,
  //   redirect: '/voice/index',
  //   meta: { title: '学员信息' },
  //   children: [{
  //     path: 'index',
  //     name: 'voice',//
  //     component: ()=>import('@/views/cheat/voice'),
  //     meta: { title: '声音录像',icon: 'peoples' }
  //   }]
  // },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      // {
      //   path: 'page',
      //   component: () => import('@/views/permission/page'),
      //   name: 'PagePermission',
      //   meta: {
      //     title: 'pagePermission',
      //     roles: ['admin'] // or you can only set roles in sub nav
      //   }
      // },
      // {
      //   path: 'directive',
      //   component: () => import('@/views/permission/directive'),
      //   name: 'DirectivePermission',
      //   meta: {
      //     title: 'directivePermission'
      //     // if do not set roles, means: this page does not require permission
      //   }
      // },
      {
        path: 'auth',
        component: () => import('@/views/permission/auth'),
        name: 'AuthPermission',
        meta: {
          title: 'authPermission',
          roles: ['admin']
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      },
      {
        path: 'user',
        component: () => import('@/views/permission/user'),
        name: 'UserPermission',
        meta: {
          title: 'userPermission',
          roles: ['admin']
        }
      }
    ]
  },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/svg-icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter
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
