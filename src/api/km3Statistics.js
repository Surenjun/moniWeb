import request from '@/utils/request'


export function doStatisticsByConditon(data) {
  return request({
    url: '/api/km3statistics/doStatistics',
    method: 'post',
    data: data
  })
}

export function exportReport(data) {
  return request({
    url: '/api/km3statistics/export',
    method: 'post',
    data: data
  })
}

