<template>
    <div>
        <h4>权限管理</h4>
        <div class='btnClass'>
            <Button type='info' icon='md-add' @click="showAddModal=true" v-permission="['permission:add']">新建</Button>
            <Button type='success' icon='md-create' v-permission="['permission:edit']">修改</Button>
            <Button type='error' icon='md-trash' v-permission="['permission:delete']">删除</Button>
            <Button type='warning' icon='md-arrow-down'>导出</Button>
        </div>
        <Table border :columns="columns" :data="permissions">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="success" size="small" style="margin-right: 5px" icon='md-create'
                    @click="edit(index)">编辑</Button>
                <Button type="error" size="small" icon='md-trash' @click="remove(index)">删除</Button>
            </template>
        </Table>
        <Modal v-model="showAddModal" title="添加权限" @on-ok='ok' @on-cancel='cancel'>
            <label> 待添加权限名称： </label>
            <Input v-model="addPermission" />
        </Modal>
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator'
    import {
        Permission
    } from '../types/permission.interface'
    import {
        getPermissions,
        addPermissions
    } from '../api/permission'

    @Component({})
    export default class PermissionClass extends Vue {
        // 是否显示添加modal
        showAddModal: boolean = false
        // 待添加权限
        addPermission: string = ''

        permissions: Permission[] = []

        columns: any[] = [{
                title: 'ID',
                key: 'id'
            },
            {
                title: '权限',
                key: 'name'
            },
            {
                title: 'pid',
                key: 'pid'
            },
            {
                title: '描述',
                key: 'description'
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
            this.$Modal.info({
                title: 'Permission Info',
                content: `Name：${this.permissions[index].name}`
            })
        }

        remove(index: number) {
            // this.permissions.splice(index, 1);
            console.log("删除", this.permissions[index])
        }

        ok() {
            console.log("ok", this.addPermission)
            let l_permission: Permission[] = []
            let l_action: string[] = ['list', 'add', 'edit', 'delete']

            l_action.forEach((action: string) => {
                let t: Permission = {
                    name: this.addPermission + ":" + action,
                    description: '',
                    pid: 0
                }
                l_permission.push(t)
            })

            addPermissions(l_permission).then((res: any) => {
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    this.$Message.success("添加成功！")
                    this.initData()
                } else {
                    this.$Message.warning("添加失败~")
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