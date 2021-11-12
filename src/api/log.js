import request from '@/utils/request'

export function getLogList(data) {
  return request({
    url: '/api/log/getLogList',
    method: 'post',
    data: data
  })
}

export function editSysParamConfig(data) {
  return request({
    url: '/api/log/editSysParamConfig',
    method: 'post',
    data: data
  })
}

export function getSysParamConfig(data) {
  return request({
    url: '/api/log/getSysParamConfig',
    method: 'post',
    data: data
  })
}

