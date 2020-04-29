import axios from 'axios'
import store from '@/store'
import {
    getToken
} from './tokenUtil'
import router from '../router'

// 创建axios实例
const service = axios.create({
    // url前缀，如/api
    baseURL: '',
    // timeout: 5000, // request timeout
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})

// request拦截器
service.interceptors.request.use(
    (config: any) => {
        if (store.state.token) {
            let Authorization = 'Authorization'
            config.headers.common[Authorization] = store.state.token
        }
        return config
    },
    (error: any) => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// respone拦截器
service.interceptors.response.use(
    (response: any) => {
        const res: any = response.data
        if (response.status !== 200) {
            return Promise.reject(res)
        } else {
            if (res.code === 503 || res.data === 500) {
                router.push({
                    path: '/login'
                })
            } else {
                return response
            }
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default service