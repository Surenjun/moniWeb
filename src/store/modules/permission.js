import { asyncRoutes, constantRoutes } from '@/router'
import { routerList } from '@/api/user'
import store from '@/store'


/**
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {

    const tmp = { ...route }
    if (tmp.children) {
      var childrens = tmp.children;
      tmp.hidden = true;
      childrens.forEach(child => {
        if(store.getters.permissions.indexOf(child.permission) != -1){
          child.hidden = false;
          tmp.hidden = false;
        }else{
          child.hidden = true
        }

        return child;
      });
    }
    res.push(tmp)
  })

  console.log('routes == ', res);

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {

    return new Promise(resolve => {
      let accessedRoutes

      if (roles.includes('超级管理员')) {
        accessedRoutes = asyncRoutes
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
