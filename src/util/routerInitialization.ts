import router from "@/router"
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'; // Progress 进度条样式
import {
    getRoles,
    getPermissions
} from '@/api/user'

NProgress.configure({
    showSpinner: false
}) // NProgress Configuration

const whiteList: string[] = ['/login'] // no redirect 的白名单

const routerInitialization = async () => {

    // router.beforeEach(async (to: any, from: any, next: any) => {

    //     NProgress.start()
    //     // 确定用户是否登录
    //     const hasToken: any = store.state.token

    //     if (hasToken) {

    //         // 先获取当前人员的角色和权限
    //         await storeRolesAndPermissions()

    //         if (to.path === '/login' || to.path == '/') {
    //             next('/main')
    //             NProgress.done(); // 结束Progress
    //         } else {
    //             next()
    //         }

    //     } else {

    //         if (whiteList.indexOf(to.path) !== -1) {
    //             // 白名单内 直接进入
    //             next()
    //         } else {
    //             // 没有访问权限的其他页将重定向到登录页。
    //             next(`/login`)
    //             NProgress.done()
    //         }
    //     }
    // })

    router.afterEach(() => {
        NProgress.done()
    })
}

function getRolesPromise() {
    return new Promise((resolve, reject) => {
        getRoles().then((response: any) => {
            const {
                code,
                data,
            } = response.data

            if (code == 200) {
                let res: Array < string > = (data as Array < any > ).map((a: any) => {
                    return a.name
                })
                resolve(res)
            } else {
                reject()
            }
        }).catch(err => {
            reject(err)
        })
    })
}

function getPermissionsPromise() {
    return new Promise((resolve, reject) => {
        getPermissions().then((response: any) => {
            const {
                code,
                data,
            } = response.data

            if (code == 200) {
                let res: Array < string > = (data as Array < any > ).map((a: any) => {
                    return a.name
                })
                resolve(res)
            } else {
                reject()
            }
        }).catch(err => {
            reject(err)
        })
    })
}

/** 异步转同步，获取角色和权限 */
async function storeRolesAndPermissions() {

    let roles = await getRolesPromise()
    let permissions = await getPermissionsPromise()

    store.commit("setRoles", {
        roles: roles
    })
    store.commit("setPermissions", {
        permissions: permissions
    })

}

export {
    routerInitialization
}
// 判断有没有登陆过（token），否则直接跳到登录页