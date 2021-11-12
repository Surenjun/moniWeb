import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/sysUser/getUserByToken',
    method: 'post'
  })

  // return Promise.resolve( {
  //   code: 0,
  //   data: {
  //     roles: ['哈哈'],
  //     user: {username: 'super man'},
  //     permissions: ["behaviour:view","statistics:getStatisticsPage","OBD:view","rule:view"]
  //   }
  // });
}

export function logout(data) {
  return request({
    url: '/logOut',
    method: 'post',
    data: data
  })
}

export function routerList(data) {
  return request({
    url: '/api/sysMenu/test',
    method: 'post',
    data: data
  })
}

export function getCaptcha(data) {
  return request({
    url: '/api/captcha/captchaImage',
    method: 'post',
    data: data
  })
}


export function getSystemInfo(data) {
  return request({
    url: '/getSystemInfo',
    method: 'post'
  })
}

