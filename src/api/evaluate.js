import request from '@/utils/request'

export function getRuleList(data) {
  return request({
    url: 'api/markrule/getProjectAndMarkRule',
    method: 'post',
    data,
    processData: false,
    contentType: false,
  });
}
