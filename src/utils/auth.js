import Cookies from 'js-cookie'
import { getQueryObject } from '@/utils/index'

const TokenKey = 'Admin-Token'

export function getToken() {

  var obj = getQueryObject(window.location.href);
  if (obj.token) {
    Cookies.set(TokenKey, obj.token)
  }

  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
