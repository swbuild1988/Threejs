import {
    State
} from './state'

const TOKEN_KEY: string = "TOKEN"
const USERNAME_KEY: string = "USER_NAME"

export default {

    /** 初始所有的参数 */
    initParamter(state: State) {
        state.token = localStorage.getItem(TOKEN_KEY)
        state.userName = localStorage.getItem(USERNAME_KEY)
        state.roles = []
        state.permissions = []
    },

    /** 清除所有的缓存 */
    removeParamter(state: State) {
        state.token = null
        localStorage.removeItem(TOKEN_KEY)
        state.userName = null
        localStorage.removeItem(USERNAME_KEY)
        state.roles = []
        state.permissions = []
    },

    setUserName(state: State, value: any) {
        state.userName = value.userName
        localStorage.setItem(USERNAME_KEY, value.userName)
    },

    setToken(state: State, value: any) {
        state.token = value.token
        localStorage.setItem(TOKEN_KEY, value.token)
    },

    setRoles(state: State, value: any){
        state.roles = value.roles
    },

    setPermissions(state: State, value: any){
        state.permissions = value.permissions
    }
}