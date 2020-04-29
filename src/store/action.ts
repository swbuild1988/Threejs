import {
    loginApi
} from '@/api/user'

export default {
    login(context: any, param: any) {
        const {
            username,
            password
        } = param
        return new Promise((resolve: any, reject: any) => {
            loginApi({
                name: username,
                password: password
            }).then((response: any) => {
                const {
                    code,
                    data,
                } = response.data

                if (code === 200 && Object.prototype.toString.call(data) === '[object Object]') {
                    console.log("data", data)
                    context.commit("setToken", {
                        token: data.token
                    })
                    context.commit("setUserName", {
                        userName: data.user.name
                    })
                    context.commit("setRoles", {
                        roles: data.roles
                    })
                    context.commit("setPermissions", {
                        permissions: data.permissions
                    })
                    console.log("成功")
                    resolve(data)

                } else {
                    console.log("失败")
                    reject(data)
                }
            }).catch(err => {
                console.log("错误")
                reject(err)
            })
        })
    },

    logout(context: any) {
        context.commit("removeParamter")
    }
}