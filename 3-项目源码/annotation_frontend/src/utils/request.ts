import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import Vrouter from '../routes'
import { MessagePlugin } from 'tdesign-vue-next'
import type { ResultModel } from '@/types/system'
import { useUserStore } from '@/stores/user'

const BaseUrl = '/api'

// create an axios instance
const request: AxiosInstance = axios.create({
  baseURL: BaseUrl,
  timeout: 8000,
})

request.interceptors.request.use(
  (config) => {
    if (config.headers && localStorage.getItem('token')) {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      MessagePlugin.error('请求超时')
    }
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 400: {
          const { msg } = error.response.data
          // 接口异常
          msg && MessagePlugin.error(msg)
          break
        }
        case 401:
          MessagePlugin.warning('登录状态已过期，请您重新登录')
          useUserStore().clearToken()
          Vrouter.push('/login')
          break
        case 403:
          Vrouter.push('/unauthorized')
          break
        case 404:
          MessagePlugin.error('访问的请求不存在')
          break
        default:
          MessagePlugin.error('服务异常，请联系管理员')
      }
    }
    return Promise.reject(error.response.data)
  }
)

export function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ResultModel<T>> {
  return request.get(url, config)
}

export function post<T>(
  url: string,
  data: unknown,
  config?: AxiosRequestConfig
): Promise<ResultModel<T>> {
  return request.post(url, data, config)
}

export function getFile<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return request.get(url, config)
}
