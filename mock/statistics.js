import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    idCard: '@integer(24)',
    name: '@title(5, 10)',
    type: '@first',
    time: '@title(5, 10)',
    fileStr: 'mock data',
    messageFlag: '@datetime',
    handleFlag: '@datetime'
  }))
}
console.log('statistics added');
export default [
  {
    url: '/api/statistics/getStatistics',
    type: 'post',
    response: config => {
      return {
        code: 0,
        message: '查询成功',
        data: {
          "id": null,
          "totalPeopleNumber": 1,
          "examNumber": 14,
          "examTotalTime": 14849,
          "totalCheatTime": 11880,
          "totalCheatNumber": 990,
          "cheats": null,
          "recordDate": null,
          "cheatZeroNumber": 0,
          "cheatOneNumber": 108,
          "cheatTwoNumber": 882,
          "cheatThreeNumber": 500,
          "remark": null,
          "delFlag": null,
          "createTime": null,
          "updateTime": null,
          "tenantId": null
        }
      }
    }
  }
]

