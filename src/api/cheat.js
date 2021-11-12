import request from '@/utils/request'

export function getExamInfoDetail(data) {
  return request({
    url: '/api/examInfoDetail/getPageExamInfoDetail',
    method: 'post',
    data: data
  })
}

export function getProjectAndMarkRule(data) {
  return request({
    url: '/api/examProject/getProjectAndMarkRule',
    method: 'post',
    data: data
  })
}

export function getSignalInfo(data) {
  return request({
    url: '/api/examInfoDetail/getSignalInfo',
    method: 'post',
    data: data
  })
}

export function createExamInfoDetail(data) {
  return request({
    url: '/api/examInfoDetail/add',
    method: 'post',
    data: data
  })
}

export function updateExamInfoDetail(data) {
  return request({
    url: '/api/examInfoDetail/update',
    method: 'post',
    data: data
  })
}

export function delExamInfoDetail(data) {
  return request({
    url: '/api/examInfoDetail/delete',
    method: 'post',
    data: data
  })
}

export function startRecordVideo(data) {
  return request({
    url: '/api/recordVideo/startRecordVideo',
    method: 'post',
    data: data
  })
}

export function getCheatDetail(data) {
  return request({
    url: '/api/CheatDetail/getPageCheat',
    method: 'post',
    data: data
  })
}
