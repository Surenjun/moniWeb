import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  baseURL:window.location.protocol+"//"+window.location.host+"/moni", // api 的 base_url
  // baseURL: 'http://127.0.0.1:9090/moni', 
  // baseURL: 'http://61.160.74.163:9090/moni', 
    //  baseURL: 'http://192.168.40.17:9090/moni', 
  // withCredentials: true, // 跨域请求时发送 cookies
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['token'] = getToken()
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
  */
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 XMLHttpRequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data;
    // if (res.code !== 0 || res.code !== -1 || res.code !== -2 || res.code !== -3) {
    //   Message({
    //     message: res.message || 'error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   return Promise.reject(res.message || 'error')
    // } else {
      if(res.code == 4002){
          Message({
            message: res.message,
            type: 'error',
            duration: 5 * 1000
          })

          window.location.reload();
      }
      return res
    // }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
