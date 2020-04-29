import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
    Message,
    Modal
} from 'iview'
import iview from './iview';
import 'iview/dist/styles/iview.css';
// 权限判断
import permission from '@/components/permission/permission'
// import '@/util/poperty'

import {
    UserClass
} from '@/types/user.interface'


Vue.config.productionTip = false;
Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal
Vue.prototype.$User = new UserClass(1, 'hahha')

Vue.use(iview)
// 权限指令
Vue.directive('permission', permission)

async function main_init() {
    try {
        store.commit("initParamter")

        let request = (await import('./util/config')).default;
        await request();
        let routerInitialization = (await import('./util/routerInitialization')).routerInitialization;
        await routerInitialization();
        return "success"
    } catch (error) {
        throw new Error(error)
    }
}

main_init().then(res => {
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount("#app");
})