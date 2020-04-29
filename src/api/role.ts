import request from '../util/request'

/** 获取所有的角色 */
export function getRoles() {
    return request({
        url: 'allroles',
        method: 'get'
    })
}