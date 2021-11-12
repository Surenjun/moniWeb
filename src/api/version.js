import request from '@/utils/request'

export function uploadFile(formData) {
  return request({
    url: '/api/versionInfo/upLoadNewVersion',
    method: 'post',
    data: formData,
    processData: false, //因为data值是FormData对象，不需要对数据做处理。
    contentType: false,
  });
}

export function getPageVersion(data) {
  return request({
    url: '/api/versionInfo/getPageVersion',
    method: 'post',
    data: data
  });
}

export function configVersion(data) {
  return request({
    url: '/api/versionInfo/configVersion',
    method: 'post',
    data: data
  });
}

export function stopVersion(data) {
  return request({
    url: '/api/versionInfo/stopVersion',
    method: 'post',
    data: data
  });
}

export function deleteVersion(data) {
  return request({
    url: '/api/versionInfo/deleteVersion',
    method: 'post',
    data: data
  });
}

