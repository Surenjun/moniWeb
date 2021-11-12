import request from '@/utils/request'

export function addMenu(data) {
  return request({
    url: '/api/sysMenu/add',
    method: 'post',
    data: data
  })
}

export function editMenu(data) {
  return request({
    url: '/api/sysMenu/update',
    method: 'post',
    data: data
  })
}


export function getAuthList(data) {
  return request({
    url: '/api/sysMenu/getNoPageList',
    method: 'post',
    data: data
  })
}

export function deleteAuth(data) {
  return request({
    url: '/api/sysMenu/batchDelete',
    method: 'post',
    data: data
  })
}

export function getRoles(data) {
  return request({
    url: '/api/sysRole/getRoleAndMenu',
    method: 'post',
    data: data
  })
}

export function addRole(data) {
  return request({
    url: '/api/sysRole/add',
    method: 'post',
    data: data
  })
}

export function editRole(data) {
  return request({
    url: '/api/sysRole/update',
    method: 'post',
    data: data
  })
}

export function deleteRole(data) {
  return request({
    url: '/api/sysRole/delete',
    method: 'post',
    data: data
  })
}

export function getUser(data) {
  return request({
    url: '/api/sysUser/getUserAndRole',
    method: 'post',
    data: data
  })
}

export function addUser(data) {
  return request({
    url: '/api/sysUser/add',
    method: 'post',
    data: data
  })
}

export function editUser(data) {
  return request({
    url: '/api/sysUser/update',
    method: 'post',
    data: data
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/sysUser/delete',
    method: 'post',
    data: data
  })
}

export function getPermissions(data) {
  return request({
    url: '/api/sysMenu/getPermissionCodeRelation',
    method: 'post',
    data: data
  })
}


