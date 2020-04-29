import request from '../util/request'

export function loginApi(data: any) {
    return request({
        url: 'login',
        method: 'post',
        data
    })
}

/** 获取所有用户 */
export function getUsers() {
    return request({
        url: 'users',
        method: 'get'
    })
}

/** 获取当前用户的角色 */
export function getRoles() {
    return request({
        url: 'roles',
        method: 'get'
    })
}

/** 获取当前用户的所有权限 */
export function getPermissions() {
    return request({
        url: 'permissions',
        method: 'get'
    })
}