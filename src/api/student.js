import request from '@/utils/request'

export function getExamInfo(data) {
  return request({
    url: '/api/examInfo/getPageExamInfo',
    method: 'post',
    data:data
  })
}

export function createExamInfo(data) {
  return request({
    url: '/api/examInfo/add',
    method: 'post',
    data:data
  })
}

export function updateExamInfo(data) {
  return request({
    url: '/api/examInfo/update',
    method: 'post',
    data:data
  })
}

export function delExamInfo(data) {
  return request({
    url: '/api/examInfo/delete',
    method: 'post',
    data:data
  })
}

