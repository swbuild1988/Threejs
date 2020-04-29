import store from '@/store'

export default {
    inserted(el: any, binding: any, vnode: any) {
        const {
            value
        } = binding

        const permissions = store.state.permissions

        if (value && value instanceof Array && value.length > 0) {
            const permissionRoles = value

            const hasPermission = permissions.some(permission => {
                return permissionRoles.includes(permission) || permission === 'admin'
            })

            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            // console.error(`使用方式： v-permission="['admin','editor']`)
        }

    }
}