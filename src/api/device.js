import request from '@/utils/request'

export function getAllDeviceList(data) {
  return request({
    url: 'api/carInfo/getCarAndDevice',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}


export function getCarInfoList(data) {
  return request({
    // url: '/api/carInfo/getPageList',
    url: '/api/carInfo/getCarAndDevice',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}

export function addCarInfo(data) {
  return request({
    url: '/api/carInfo/add',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}

export function updateCarInfo(data) {
  return request({
    url: '/api/carInfo/update',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}
export function updateCarStatus(data) {
  return request({
    url: '/api/carInfo/bindCarAndEquipment',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}

export function deleteCarInfo(data) {
  return request({
    url: '/api/carInfo/delete',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}

export function getAndroidList(data) {
  return request({
    url: '/api/androidTerminalDevice/getPageList',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}

export function updateAndroid(data) {
  return request({
    url: '/api/androidTerminalDevice/update',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}

export function deleteAndroid(data) {
  return request({
    url: '/api/androidTerminalDevice/delete',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}

export function getTx2List(data) {
  return request({
    url: '/api/tx2/getPageList',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}

export function updateTx2(data) {
  return request({
    url: '/api/tx2/update',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}

export function deleteTx2(data) {
  return request({
    url: '/api/tx2/delete',
    method: 'post',
    data: data,
    processData: false,
    contentType: false,
  });
}

/**车型*/
export function getNoPageList() {
  return request({
    url: '/api/carType/getNoPageList',
    method: 'post'
  });
}



