import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    idCard: '@integer(24)',
    name: '@title(5, 10)',
    examNum: '@first',
    serialNum: '@title(5, 10)',
    carInfo: 'mock data',
    startTime: '@datetime',
    endTime: '@datetime',
    examFlag: '@integer(1, 3)',
    delFlag: '@datetime',
    tenantId: true,
    examInfoDetails: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/api/examInfo/getPageExamInfo',
    type: 'post',
    response: config => {
      const {idCard, pageNum = 1, pageSize = 20} = config.query

      let mockList = List.filter(item => {

        return true
      })

      const pageList = mockList.filter((item, index) => index < pageSize * pageNum && index >= pageSize * (pageNum - 1))

      return {
        code: 0,
        message: '查询成功',
        data: {
          pageNum: 1,
          pageSize: 10,
          size: 2,
          startRow: 1,
          endRow: 2,
          total: mockList.length,
          pages: 1,
          list: pageList
        }
      }
    }
  },

  {
    url: '/article/detail',
    type: 'get',
    response: config => {
      const {id} = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            {key: 'PC', pv: 1024},
            {key: 'mobile', pv: 1024},
            {key: 'ios', pv: 1024},
            {key: 'android', pv: 1024}
          ]
        }
      }
    }
  },

  {
    url: '/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

