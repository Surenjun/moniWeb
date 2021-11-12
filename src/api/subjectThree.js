import request from '@/utils/request'

export function getkm3FilePageList(data) {
  return request({
    url: '/api/km3File/getPageList',
    method: 'post',
    data: data
  })
}


export function getNearData(data) {
  return request({
    url: '/api/km3File/getNearData',
    method: 'post',
    data: data
  })
}

export function startRecordVideo(data) {
  return request({
    url: '/api/km3File/playProcVideo',
    method: 'post',
    data: data
  })
}

export function doVerify(data) {
  return request({
    url: '/api/km3File/doVerify',
    method: 'post',
    data: data
  })
}


//  通用文件类

export function getCommonFilePageList(data) {
  return request({
    url: '/api/km3CommonFile/getPageList',
    method: 'post',
    data: data
  })
}

export function downloadCommonFile(data) {
  return request({
    url: '/api/km3CommonFile/download',
    method: 'post',
    data: data
  })
}
