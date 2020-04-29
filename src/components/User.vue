<template>
    <div>
        <h4>用户管理</h4>
        <div class='btnClass'>
            <Button type='info' icon='md-add' v-permission="['user:add']">新建</Button>
            <Button type='success' icon='md-create' v-permission="['user:edit']">修改</Button>
            <Button type='error' icon='md-trash' v-permission="['user:delete']">删除</Button>
            <Button type='warning' icon='md-arrow-down'>导出</Button>
        </div>
        <Table border :columns="columns" :data="users">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="success" size="small" style="margin-right: 5px" icon='md-create'
                    @click="edit(index)">编辑</Button>
                <Button type="error" size="small" icon='md-trash' @click="remove(index)">删除</Button>
            </template>
        </Table>
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator'
    import {
        User
    } from '../types/user.interface'
    import {
        getUsers
    } from '../api/user'

    @Component({})
    export default class UserClass extends Vue {
        users: User[] = []

        columns: any[] = [{
                title: 'ID',
                key: 'id'
            },
            {
                title: '用户名',
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
            getUsers().then((res: any) => {
                let {
                    code,
                    data
                } = res.data
                if (code == 200) {
                    this.users = data
                }
            })
        }

        edit(index: number) {
            this.$Modal.info({
                title: 'User Info',
                content: `Name：${this.users[index].name}<br>Password：${this.users[index].password}`
            })
        }

        remove(index: number) {
            this.users.splice(index, 1);
        }
    }
</script>

<style scoped>
    .btnClass button {
        margin: 0px 10px;
    }
</style>