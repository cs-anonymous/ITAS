import { defineStore } from 'pinia'
import type { User } from '@/types/system'
import { getProfile, login, logout } from '@/apis/user'

interface UserState {
  token: string
  user: User | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    user: null,
  }),
  getters: {
    username: (state) => {
      return state.user?.username
    },
    hasAdminRole: (state) => {
      if (!state.user) {
        return false
      }
      return state.user.roles.filter((r) => r === 'admin').length > 0
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    clearToken() {
      localStorage.removeItem('token')
      this.$reset()
    },
    getUserInfo() {
      if (localStorage.getItem('token')) {
        this.setToken(localStorage.getItem('token')!)
      }
      return new Promise((resolve, reject) => {
        if (this.token) {
          getProfile()
            .then((res) => {
              this.user = res.payload
              resolve(res)
            })
            .catch(() => {
              this.clearToken()
              reject()
            })
        } else {
          reject()
        }
      })
    },
    login(username: string, password: string) {
      return new Promise((resolve, reject) => {
        login({ username, password })
          .then((res) => {
            if (res.payload) {
              this.setToken(res.payload)
              this.getUserInfo()
                .then(() => {
                  resolve(res)
                })
                .catch(() => {
                  this.clearToken()
                  reject()
                })
            } else {
              this.clearToken()
              reject()
            }
          })
          .catch(() => {
            this.clearToken()
            reject()
          })
      })
    },
    logout() {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            this.clearToken()
            resolve('')
          })
          .catch(() => {
            this.clearToken()
            reject()
          })
      })
    },
  },
})
