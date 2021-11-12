import request from '@/utils/request'

export function getStatistics(data) {
  return request({
    url: '/api/statistics/getStatistics',
    method: 'post',
    data: data
  })
}

export function getStatisticsPage(data) {
  return request({
    url: '/api/statistics/getStatisticsPage',
    method: 'post',
    data: data
  })
}

//
export function statisticsConditioDdoStatistics(data) {
  return request({
    url: '/api/statisticsCondition/doStatistics',
    method: 'post',
    data: data
  })
}

export function statisticsConditionGetPageStatistics(data) {
  return request({
    url: '/api/statisticsCondition/getPageStatistics',
    method: 'post',
    data: data
  })
}

export function statisticsConditionGetNoPageStatistics(data) {
  return request({
    url: '/api/statisticsCondition/getNoPageStatistics',
    method: 'post',
    data: data
  })
}
