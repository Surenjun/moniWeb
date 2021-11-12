import request from '@/utils/request'

export function getExamProject(data) {
  return request({
    url: 'api/examProject/getPageList',
    method: 'post',
    data: data
  })
}

export function getBehaviourList(data) {
  return request({
    url: 'api/behaviour/getPageList',
    method: 'post',
    data: data
  })
}

export function changeBehaviourStatus(data) {
  return request({
    url: '/api/behaviour/config',
    method: 'post',
    data: data
  })
}

export function addBehaviour(data) {
  return request({
    url: '/api/behaviour/add',
    method: 'post',
    data: data
  })
}

export function deleteBehaviour(data) {
  return request({
    url: '/api/behaviour/delete',
    method: 'post',
    data: data
  })
}

export function updateBehaviour(data) {
  return request({
    url: '/api/behaviour/update',
    method: 'post',
    data: data
  })
}

export function getOBDList(data) {
  return request({
    url: '/api/obdSignalInfo/getPageList',
    method: 'post',
    data: data
  })
}

export function addObd(data) {
  return request({
    url: '/api/obdSignalInfo/add',
    method: 'post',
    data: data
  })
}

export function deleteObd(data) {
  return request({
    url: '/api/obdSignalInfo/delete',
    method: 'post',
    data: data
  })
}

export function updateObd(data) {
  return request({
    url: '/api/obdSignalInfo/update',
    method: 'post',
    data: data
  })
}

export function getCheatRuleView(data) {
  return request({
    url: '/api/examProject/getCheatRuleView',
    method: 'post',
    data: data
  })
}

export function batchConfigRule(data) {
  return request({
    url: '/api/proBehaviorObd/batchConfigRule',
    method: 'post',
    data: data
  })
}

export function examProjectAdd(data) {
  return request({
    url: '/api/examProject/add',
    method: 'post',
    data: data
  })
}

export function examProjectUpdate(data) {
  return request({
    url: '/api/examProject/update',
    method: 'post',
    data: data
  })
}

export function examProjectDelete(data) {
  return request({
    url: '/api/examProject/delete',
    method: 'post',
    data: data
  })
}
