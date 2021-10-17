import axios from 'axios'
import store from '@/store'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      let token = store.getters.token
      if (token) {
        const authorization = config.headers['Authorization']
        if (authorization === undefined || authorization.indexOf('Basic') === -1) {
          config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带
        }
      }
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      if (url.indexOf('export') !== -1) return res // 导出
      const { data, status } = res
      if (data.code && data.code !== 200) return Promise.reject(data)
      return data
    }, async error => {
      this.destroy(url)
      let errorInfo = error.response
      let originalRequest = error.config
      // debugger
      if (errorInfo.status === 401 && errorInfo.data && errorInfo.data.error === 'invalid_token') {
        // 退出请求
        if (originalRequest.url.indexOf('remove_token') !== -1) {
          return
        }
        await store.dispatch('handleRefreshToken').then(async res => {
          // debugger
          console.log('重新请求...')
          let req = { ...originalRequest }
          req.url = req.url.replace(this.baseUrl, '')
          await this.request(req)
        }).catch(async () => {
          // 刷新失败，执行退出
          await store.dispatch('handleLogOut')
          window.location = '/admin/index.html'
        })
      }
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
