import request from '../util/request'
import {
    Permission
} from '@/types/permission.interface'

/** 获取所有的权限 */
export function getPermissions() {
    return request({
        url: 'allpermissions',
        method: 'get'
    })
}

export function addPermissions(permissions: Permission[]) {
    return request({
        url: 'permissions',
        method: 'post',
        data: permissions
    })
}

export function getPermissionsByRole(roleId: number) {
    return request({
        url: 'roles/' + roleId + '/permissions',
        method: 'get'
    })
}

/** 更新角色和权限关系 */
export function updateRelationShipOfRoleAndPermission(data: {
    roleId: number,
    permissionIds: Array < number >
}) {
    return request({
        url: 'role-permission-relationship',
        method: 'post',
        data: data
    })
}