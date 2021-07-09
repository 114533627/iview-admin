import axios from '@/libs/api.request'
const grantType = 'password'
const scope = 'read'
const basicAuthorization = 'Basic ' + btoa('web_app:spring-microservice-exam-secret')

export const login = ({ username, password, code, randomStr }) => {
  return axios.request({
    url: '/oauth/token',
    headers: {
      'Authorization': basicAuthorization
    },
    method: 'post',
    params: { username, password, code, randomStr, grant_type: grantType, scope }
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/v1/user',
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/v1/authentication/remove_token',
    method: 'get'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
