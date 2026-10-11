import { get, post } from '@/utils/request'
import { PageModel, User } from '@/types/system'

const Api = {
  login: '/login',
  logout: '/logout',
  getProfile: '/get-profile',
  usernameExist: '/username-exist',
  register: '/register',
  pageUser: '/user/page',
}

export function login(params: LoginParams) {
  return post<string>(Api.login, null, { params: params })
}

export function logout() {
  return get<string>(Api.logout)
}

export function getProfile() {
  return get<User>(Api.getProfile)
}

export function usernameExist(username: string) {
  return get<boolean>(Api.usernameExist, { params: { username } })
}

export function register(params: RegisterParams) {
  return post<null>(Api.register, params)
}

export function pageUser(params: PageUserParams) {
  return get<PageModel<User>>(Api.pageUser, { params: params })
}

interface LoginParams {
  username: string
  password: string
}

interface RegisterParams {
  username: string
  realName: string
  password: string
}

interface PageUserParams {
  pageNum: number
  pageSize: number
}
