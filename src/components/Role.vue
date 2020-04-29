<template>
    <div>
        <h4>角色管理</h4>
        <div class='btnClass'>
            <Button type='info' icon='md-add' v-permission="['role:add']">新建</Button>
            <Button type='success' icon='md-create' v-permission="['role:edit']">修改</Button>
            <Button type='error' icon='md-trash' v-permission="['role:delete']">删除</Button>
            <Button type='warning' icon='md-arrow-down'>导出</Button>
        </div>
        <Table border :columns="columns" :data="roles">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="success" size="small" style="margin-right: 5px" icon='md-create'
                    @click="edit(index)">编辑</Button>
                <Button type="error" size="small" icon='md-trash' @click="remove(index)">删除</Button>
            </template>
        </Table>

        <Modal v-model="showEditModal" title="编辑角色" @on-ok='ok' @on-cancel='cancel'>
            <label> 角色： {{editRole.name}} </label> <br>
            <label> 角色可用权限： </label>
            <Select v-model='editPermissions' multiple>
                <Option v-for="item in permissions" :value="item.name" :key="item.id">{{item.name}}</Option>
            </Select>
        </Modal>
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator'
    import {
        Role
    } from '../types/role.interface'
    import {
        Permission
    } from '../types/permission.interface'
    import {
        getRoles
    } from '../api/role'
    import {
        getPermissions,
        getPermissionsByRole,
        updateRelationShipOfRoleAndPermission
    } from '../api/permission'

    @Component({})
    export default class RoleClass extends Vue {
        /** 当前编辑角色 */
        editRole: Role = {
            id: 0,
            name: ''
        }
        /** 当前角色可关联的权限 */
        editPermissions: string[] = []
        /** 所有的权限 */
        permissions: Permission[] = []

        showEditModal: boolean = false

        roles: Role[] = []

        columns: any[] = [{
                title: 'ID',
                key: 'id'
            },
            {
                title: '角色名',
                key: 'name'
            },
            {
                title: '操作',
                slot: 'action',
                width: 350,
                align: 'center'
            }
        ]

        mounted() {
            this.initData()
        }

        initData() {
            getRoles().then((res: any) => {
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    this.roles = data
                }
            })
            getPermissions().then((res: any) => {
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    this.permissions = data
                }
            })
        }

        edit(index: number) {
            this.showEditModal = true
            this.editRole = this.roles[index]
            getPermissionsByRole(this.editRole.id).then((res: any) => {
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    this.editPermissions = (data as Array < any > ).map((a: any) => {
                        return a.name
                    })
                    console.log("editPermissions.", this.editPermissions)
                }
            })
        }

        remove(index: number) {
            this.roles.splice(index, 1);
        }

        ok() {
            let permissionIds: number[] = []
            this.editPermissions.forEach((element: string) => {
                let t: Permission | undefined = this.permissions.find((a: Permission) => {
                    return a.name === element
                })
                console.log("t", t)
                if (t != undefined) permissionIds.push(t.id as number)
            });

            updateRelationShipOfRoleAndPermission({
                roleId: this.editRole.id,
                permissionIds: permissionIds
            }).then((res:any)=>{
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    console.log("修改成功")
                    this.$Message.success("修改成功")
                    location.reload()
                }
            })
        }

        cancel() {
            console.log("cancel")
        }
    }
</script>

<style scoped>
    .btnClass button {
        margin: 0px 10px;
    }
</style>