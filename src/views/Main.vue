<template>
    <Layout class="layout">
        <Header class="header">
            <Menu mode="horizontal" theme="dark" active-name="1">
                <div class="layout-logo"></div>
                <div class="layout-nav">
                    <MenuItem name="1">
                    <Icon type="ios-navigate"></Icon>
                    Item 1
                    </MenuItem>
                    <MenuItem name="2">
                    <Icon type="ios-keypad"></Icon>
                    Item 2
                    </MenuItem>
                    <MenuItem name="3">
                    <Icon type="ios-analytics"></Icon>
                    {{UserName}}
                    </MenuItem>
                    <MenuItem name="4" @click.native="logout">
                    <Icon type="ios-paper"></Icon>
                    登出
                    </MenuItem>
                </div>
            </Menu>
        </Header>
        <Layout class="comment">
            <Sider hide-trigger :style="{background: '#fff'}">
                <Menu theme="light" width="auto" accordion active-name="1" :open-names="['mainMenu']">
                    <Submenu name="mainMenu">
                        <template slot="title">
                            <Icon type="ios-navigate" />
                            后台管理
                        </template>
                        <div v-for="(item,index) in leftTree" :key="item.key" style="text-align: center"
                            v-permission="item.permissions">
                            <!--二级菜单-->
                            <Submenu :name="item.id" v-if="item.childNode && item.childNode.length > 0">
                                <template slot="title">
                                    <Icon :type="item.typeName" size="50" color="#052752" style="display: block" />
                                    <Icon type="ios-home-outline" />
                                    <div style="font-size: 14px;display: inline">{{ item.name}}</div>
                                </template>
                                <MenuItem v-for="(child,childIndex) in item.childNode" :name="childIndex+'child'"
                                    :key="child.id" @click.native="goToMoudle(child)" v-permission="child.permissions">
                                <span> {{child.name}}</span>
                                </MenuItem>
                            </Submenu>
                            <!--一级菜单-->
                            <MenuItem :name="index" v-else @click.native="goToMoudle(item)">
                            <Icon type="ios-paper" size="50"></Icon>
                            <div style="font-size: 14px;"> {{item.name}}</div>
                            </MenuItem>
                        </div>
                    </Submenu>
                </Menu>
            </Sider>
            <Layout :style="{padding: '0 24px 24px'}">
                <Content :style="{padding: '24px', background: '#fff'}">
                    <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </Layout>
</template>
<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator';
    import router from '../router'

    @Component({})
    export default class Main extends Vue {
        leftTree: any[] = [{
                id: 1,
                name: '首页',
                typeName: "drag",
                url: '/main',
                routerName: 'main'
            },
            {
                id: 2,
                name: '后台管理',
                typeName: 'drag',
                permissions: [],
                childNode: [{
                        id: 21,
                        name: '用户管理',
                        url: '/system/user',
                        routerName: 'user',
                        permissions: ['user:list'],
                    },
                    {
                        id: 22,
                        name: '角色管理',
                        url: '/system/role',
                        routerName: 'role',
                        permissions: ['role:list'],
                    },
                    {
                        id: 23,
                        name: '权限管理',
                        url: '/system/permission',
                        routerName: 'permission',
                        permissions: ['permission:list'],
                    }
                ]
            },
            {
                id: 3,
                name: 'WebGL',
                typeName: 'drag',
                permission: [],
                url: '/main/three',
                routerName: 'three'
            }
        ]

        get UserName(): string {
            return this.$store.state.userName
        }

        goToMoudle(item: any) {
            let param: any = {
                name: item.routerName
            }
            this.$router.push(param)
        }

        logout() {
            this.$store.dispatch('logout').then((result: any) => {
                this.$Message.success("登出成功~")
                this.$router.push({
                    path: "/login"
                });
            }).catch(err => {
                this.$Message.warning('登陆失败！')
            })
        }
    }
</script>
<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height: 100%;
        width: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .layout-logo {
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }

    .layout-nav {
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }

    .comment {
        height: 100%;
    }
</style>